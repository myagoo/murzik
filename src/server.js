var app = require('express')();
var http = require('http').Server(app);
var serveStatic = require('serve-static')('dist');
var logger = require('morgan')('combined');
var io = require('socket.io')(http);

app.use(logger);
app.use(serveStatic);

http.listen(8080, function(){
  console.log('listening on *:8080');
});

io.on('connection', function(socket){
  console.log('a user connected');
});
