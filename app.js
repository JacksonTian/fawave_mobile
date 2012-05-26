var http = require('http');
var path = require('path');
var url = require('url');
var connect = require('connect');

var app = connect();
app.use(connect.query());
app.use("/proxy", function (req, res) {
  var target = url.parse(req.query.url);
  var options = {
    host: target.hostname,
    port: target.port || 80,
    path: target.path,
    method: req.method
  };

  var proxyReq = http.request(options, function (response) {
    res.writeHead(response.statusCode, response.headers);
    response.on('data', function (chunk) {
      res.write(chunk);
    });
    response.on('end', function () {
      res.end();
    });
  });

  proxyReq.on('error', function (err) {
    proxyReq.abort();
    res.end(req.query.url + ' error: ' + err.message);
  });

  req.on('data', function (chunk) {
    console.log('data', chunk.toString());
    proxyReq.write(chunk);
  });
  req.on('end', function () {
    console.log('end');
    proxyReq.end();
  });

});

app.use(connect.static(path.join(__dirname, "www")));


app.listen(8001);
console.log("Server is launching at port 8001.");
