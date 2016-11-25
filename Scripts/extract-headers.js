importPackage(Packages.com.vordel.trace);

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

function invoke(msg) {
  var headers = msg.get("http.header.Authorization");
  Trace.info("Authorization Header: " + headers);

  var hawkHeaders = parseHawkHeader(headers);
  Trace.info("Decoded Hawk Headers: " + JSON.stringify(hawkHeaders));

  if (hawkHeaders != null) {
    msg.put("hawk.id", hawkHeaders.id);
  }

  return hawkHeaders != null;
}
