var port = process.env.PORT || 3000;
var express = require('express');
var app = express();

var subscribers = {};
var id = 0;
var sse = function(req, res, next) {
  var count = 0;
  req.socket.setTimeout(0);
  req.sse_id = id++;
  req.socket.on("end", function() {
    delete subscribers[req.sse_id];
  });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.event = function(o, event){
    res.write("id: " + (count++) + "\n");
    if(event) {
      res.write("event: " + event + "\n");
    }
    res.write("data: " + JSON.stringify(o) + "\n\n");
  };
  subscribers[req.sse_id] = {
    req: req,
    res: res
  };
  next();    
};

app.use(express.static(__dirname + '/public'));
app.get('/events', sse, function (req, res) {});
app.listen(port);

var count = 0;
setInterval(function() {
  Object.keys(subscribers).forEach(function(k) {
    var subscriber = subscribers[k];
    subscriber.res.event({
      message: "message " + count
    });
    subscriber.res.event({
      time: Date.now()
    }, "ping");
  });
  count++;
}, 1000);

