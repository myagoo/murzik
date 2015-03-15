var app = require('express')();
var http = require('http').Server(app);
var serveStatic = require('serve-static')('static');
var logger = require('morgan')('combined');
var io = require('socket.io')(http);
var config = require('server.config.js');
var Api = require('api.js');
let api = new Api(config.api.uri, config.api.key);

app.use(logger);
app.use(serveStatic);
app.get('/', function (req, res) {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <script src="/socket.io/socket.io.js"></script>
      <script src="${__HOST__}/dist/client.js"></script>
      <link href='http://fonts.googleapis.com/css?family=Roboto:400,300,500' rel='stylesheet' type='text/css'>
      <link rel="stylesheet" href="material-design-icons/style.css" />
    </head>
    <body>
      <div id="app"></div>
    </body>
    </html>
  `);
});

http.listen(8000, function(){
  console.log('listening on *:8000');
});

var users = {};
var rooms = {};

/*setInterval(function(){
  Object.keys(users).map(function(username){
    console.log('retreiving current track for user', username);
    var user = users[username];
    api.getCurrentTrack(username).then(function(currentTrack){
      console.log(username, currentTrack);
    });
  });
}, 10000);*/

io.on('connection', function(socket){
  console.log('user connected');

  socket.on('login', function(user){
    console.log('user login', user);
    users[user.name] = {
      user: user,
      socket: socket,
      currentTrack: undefined
    };
    console.log('get currentTrack', user.name)
    api.getCurrentTrack(user.name).then((currentTrack) =>
      users[user.name].currentTrack = currentTrack);
  });

  socket.on('logout', function(user){
    console.log('user logout', user);
    delete users[user.name];
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
