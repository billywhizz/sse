module.exports = function(req, res, next) {
  var count = 0;
  req.socket.setTimeout(0);
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
  next();    
};