module.exports = function(req, res, next) {
  var count = 0;
  if(req.headers.hasOwnProperty("last-event-id")) {
    console.log("last event: " + req.headers["last-event-id"]);
  }
  req.socket.setTimeout(0);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.write("retry: 1000\n");
  res.event = function(o, event){
    res.write("id: " + (count++) + "\n");
    if(event) {
      res.write("event: " + event + "\n");
    }
    res.write("data: " + JSON.stringify(o) + "\n\n");
  };
  next();    
};