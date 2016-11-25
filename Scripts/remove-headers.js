importPackage(Packages.com.vordel.trace);

function clearHeaders(msg, property) {
  var headers = msg.get(property);

  // Since we cannot go through an iterator while removing elements,
  // we have to build a list of header names first
  var names = [];
  var it = headers.getNames();
  while (it.hasNext()) {
    var name = it.next();
    names.push(name);
  }

  // And then iterate over this list to remove all headers
  var len = names.length;
  for (var i = 0; i < len; i++) {
    var name = names[i];
    headers.remove(name);
  }
}

function invoke(msg) {
  clearHeaders(msg, "http.content.headers")
  clearHeaders(msg, "http.headers")
  return true;
}
