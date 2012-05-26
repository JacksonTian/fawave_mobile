var path = require('path');
var connect = require('connect');

var app = connect();
app.use(connect.static(path.join(__dirname, "www")));
app.listen(8001);
console.log("Server is launching at port 8001.");