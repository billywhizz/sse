var port = process.env.PORT || 3000;
var express = require('express');
var app = express();
var sse = require("./");
var subscribers = {};
var id = 0;
var count = 0;
app.use(express.static(__dirname + '/public'));
app.get('/events', sse, function (req, res) {
  req.sse_id = id++;
  req.socket.on("end", function() {
    delete subscribers[req.sse_id];
    console.log("subscriber.end: " + req.sse_id);
  });
  subscribers[req.sse_id] = {
    req: req,
    res: res
  };
  console.log("subscriber.start: " + req.sse_id);
});
app.listen(port);
setInterval(function() {
  Object.keys(subscribers).forEach(function(k) {
    var subscriber = subscribers[k];
    subscriber.res.event({
      time: Date.now()
    }, "ping");
  });
  count++;
}, 1000);

