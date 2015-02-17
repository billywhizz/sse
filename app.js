var sse = require('connect-sse')();
var express = require('express')
var app = express()
app.use(express.static(__dirname + '/public'));
app.get('/events', sse, function (req, res) {
  setInterval(function() {
    res.json({
      message: "ping",
      time: Date.now()
    })
  }, 1000);
});
app.listen(8003);
