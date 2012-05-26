var http = require('http');
var path = require('path');
var url = require('url');
var connect = require('connect');

var app = connect();
app.use(connect.static("www"));
app.use(connect.query());
app.use(connect.bodyParser());
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
      console.log(chunk);
    });
    response.on('end', function () {
      res.end();
    });
  });
  proxyReq.end();
});

app.listen(8001);
console.log("Server is launching at port 8001.");
