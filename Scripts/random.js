importPackage(Packages.com.vordel.trace);
importPackage(Packages.java.util);
importPackage(Packages.com.vordel.common.base64);

function invoke(msg) {
  var gen = new Random();
  var bytes = java.lang.reflect.Array.newInstance (java.lang.Byte.TYPE, 32);
  gen.nextBytes(bytes);
  msg.put("hawk.key", Encoder.encode(bytes));
  return true;
}
