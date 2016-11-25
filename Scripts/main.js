importPackage(Packages.javax.crypto);
importPackage(Packages.java.security);
importPackage(Packages.java.io);
importPackage(Packages.com.vordel.trace);
importPackage(Packages.com.vordel.common.base64);
importPackage(Packages.javax.crypto.spec);
importPackage(Packages.java.nio.charset);


function parseHawkHeader(header) {
  // the header variable can be something like this :
  //   Hawk id="my-sample-key", mac="WUsudR+2seHAGF+c/QCBu/mvfqu4dxumAPe2T/R1OWQ=",
  //        ts="1466424453", nonce="L8TKu/+n", hash="B/K97zTtFuOhug27fke4/Zgc4Myz4b/lZNgsQjy6fkc="';
  if (header != null && header.startsWith("Hawk ")) {
    var count = 0;
    var hawkHeaders = {};
    var regex = new RegExp('[ ,]*(([a-z]+)="([^"]*)")', "g");
    var match = regex.exec(header);
    while (match != null && count < 32) { // safeguard against potential infinite loop
      hawkHeaders[match[2]] = match[3];
      match = regex.exec(header);
      count++;
    }
    return hawkHeaders;
  } else {
    return null;
  }
}

function getHostAndPort(msg) {
  var hostHeader = msg.get("http.header.Host");
  var proto = msg.get("http.request.protocol");
  var components = hostHeader.split(":");
  var port = null;
  var hostname = hostHeader;
  if (components.length > 1) {
    port = components[components.length - 1]; // Port is always the last item
    hostname = hostHeader.substr(0, hostHeader.lastIndexOf(":"));
  }
  return [ hostname, port ];
}

function computeNormalizedString(msg, headers) {
  var method = msg.get("http.request.verb");
  var url = msg.get("http.request.uri");
  var hostAndPort = getHostAndPort(msg);

  var normalized = "hawk.1.header\n"
                + (headers.ts || "") + "\n"
                + (headers.nonce || "") + "\n"
                + method + "\n"
                + url + "\n"
                + hostAndPort[0] + "\n"
                + hostAndPort[1] + "\n"
                + (headers.hash || "") + "\n"
                + (headers.ext || "") + "\n";

  if (headers.app != null) {
    normalized += headers.app + "\n" + (headers.dlg || "") + "\n";
  }

  return normalized;
}

function computeBodyHash(msg) {
  var hash = MessageDigest.getInstance("SHA-256");
  var body = msg.get("content.body");

  // Wait for the complete body to be available
  if (! body.contentAvailable()) {
    body.bufferInput();
  }

  // Header
  var charset = Charset.forName("US-ASCII");
  hash.update(charset.encode("hawk.1.payload\n").array());

  // Content-Type
  var contentType = msg.get("http.header.Content-Type") || "";
  contentType = contentType.split(";")[0].replace("^\s+|\s+$", '').toLowerCase();
  Trace.info("Content-Type: " + contentType);
  contentType += "\n";
  hash.update(charset.encode(contentType).array());

  // Compute the hash over the whole body
  var baos = new ByteArrayOutputStream();
  body.write(baos, 0);
  hash.update(baos.toByteArray());
  hash.update(charset.encode("\n").array());
  var hash = hash.digest();

  // Encode it in Base64
  return Encoder.encode(hash);
}

function computeHawkSignature(normalizedString, key) {
  var rawkey = Decoder.decode(key);
  var keyspec = new SecretKeySpec(rawkey, "HmacSHA256");
  var charset = Charset.forName("US-ASCII");

  // Compute the hmac
  var hmac = Mac.getInstance("HmacSHA256");
  hmac.init(keyspec);
  var signature = hmac.doFinal(charset.encode(normalizedString).array());

  // Encode it in Base64
  return Encoder.encode(signature);
}

function invoke(msg) {
  var headers = msg.get("http.header.Authorization");
  Trace.info("Authorization Header: " + headers);

  var hawkHeaders = parseHawkHeader(headers);
  Trace.info("Decoded Hawk Headers: " + JSON.stringify(hawkHeaders));

  var normalizedString = computeNormalizedString(msg, hawkHeaders);
  Trace.info("Normalized String: [" + normalizedString + "]");

  var secretKey = msg.get("hawk.key");
  Trace.info("Secret HAWK Key: " + secretKey);

  var computedHawkSignature = computeHawkSignature(normalizedString, secretKey);
  Trace.info("Computed Hawk Signature: " + computedHawkSignature);
  if (computedHawkSignature != hawkHeaders.mac) {
    Trace.error("Hawk Signature differs ! (" + computedHawkSignature + " vs " + hawkHeaders.mac + ")");
    return false;
  }

  if (hawkHeaders.hash != null && hawkHeaders.hash != "") {
    var computedBodyHash = computeBodyHash(msg);
    Trace.info("Computed Body Hash: " + computedBodyHash);

    if (computedBodyHash != hawkHeaders.hash) {
      Trace.error("Body Hash differs ! (" + computedBodyHash + " vs " + hawkHeaders.hash + ")");
      return false;
    }
  }

  // Return the HAWK Nonce to main policy for replay protection
  msg.put("hawk.nonce", hawkHeaders.nonce);

  return true;
}
