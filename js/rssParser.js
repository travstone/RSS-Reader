var x = new XMLHttpRequest();
x.open("GET", "http://rss.slashdot.org/Slashdot/slashdot", true);
x.onreadystatechange = function () {
  if (x.readyState == 4 && x.status == 200)
  {
    var doc = x.responseXML;
    // …
    document.write(doc);
  }
};
x.send(null);