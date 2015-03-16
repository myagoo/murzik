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
app.get('/', function(req, res) {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
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

http.listen(8000, function() {
  console.log('listening on *:8000');
});

var users = {};
var rooms = {};

setInterval(function() {
  Object.keys(users).map(function(username) {
    let user = users[username];
    console.log(user.currentTrack)
  });
}, 1000);

io.on('connection', function(socket) {

  socket.once('login', function(userName) {
    handleLogin(socket, userName).then(function(user) {

      socket.once('logout', function() {
        handleLogout(user);
      });

      socket.on('message', function(message) {
        io.to(message.channel).emit(message);
      });
    });
  });

  socket.once('disconnect', function() {
    console.log('user disconnected');
  });
});

function extractChannels(track) {
  return {
    artist: track.artist.name,
    album: track.artist.name + '/' + track.album.name,
    track: track.artist.name + '/' + track.album.name + '/' + track.name,
  };
}

function updateUserChannels(user, track) {
  let oldChannels = extractChannels(user.currentTrack);
  let newChannels = extractChannels(track);

  Object.keys(newChannels).forEach(function(key) {
    if (newChannels[key] !== oldChannels[key]) {
      user.sockets.forEach(function(socket) {
        // Leave old channel
        socket.leave(oldChannels[key]);
        // Join new channel if any
        if (newChannels[key]) {
          socket.join(newChannels[key]);
        }
        // Tell the client about the new channel
        socket.emit('channel.update', {
          oldChannel: oldChannels[key],
          newChannel: newChannels[key]
        });
      });
    }
  });
}

function getUser(userName) {
  if (users[userName]) {
    return Promise.resolve(users[userName]);
  }
  return api.getUserInfos(userName).then(function(userInfos) {
    users[userName] = {
      infos: userInfos,
      sockets: []
    };
    return users[userName];
  });
}

function handleUserLogin(socket, userName) {
  return getUser(userName).then(function(user) {
    // Add current socket to user socket list
    user.sockets.push(socket);
    return api.getCurrentTrack(user.name).then(function(currentTrack) {
      updateUserChannels(user, currentTrack);
      return user;
    });
  });
}

function handleUserLogout(user) {
    let channels = extractChannels(user.currentTrack);
    let channelKeys = Object.keys(channels);

    user.sockets.forEach(function(socket) {
        channelKeys.forEach(function(key) {
            socket.leave(channels[key]);
          }
          socket.emit('app.logout');
        });

      delete users[userName];
    }
