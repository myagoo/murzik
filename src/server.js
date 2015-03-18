var app = require('express')();
var http = require('http').Server(app);
var serveStatic = require('serve-static')('static');
var logger = require('morgan')('combined');
var io = require('socket.io')(http);
var config = require('server.config.js');
var Api = require('api.js');
let api = new Api(config.api.uri, config.api.key);
import _ from 'lodash';

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

let users = new Map();
let socketUserMap = new Map();
let rooms = new Map();

/*setInterval(function() {
  Object.keys(users).map(function(username) {
    let user = users[username];
    console.log('#Current track', user)
  });
}, 1000);*/

io.on('connection', function(socket) {
  console.log('connection');

  socket.on('client.login', function(userName) {
    console.log('login', userName);

    handleLogin(socket, userName).then(function(user) {

      socketUserMap.set(socket, user);

      socket.once('client.logout', function() {
        console.log('logout', userName);
        handleLogout(userName);
      });

      socket.on('client.message.send', function(message) {
        console.log('message', userName, message);
        handleMessage(user, message);
      });

      socket.emit('server.login.completed', user.infos);

    }).catch(function(error) {
      console.error('#ERROR', error);
      socket.emit('server.login.failed', error);
    });
  });

  socket.once('disconnect', function() {
    console.log('disconnected');
    handleDisconnect(socket);
  });
});

function getPath(obj, ks) {
  if (typeof ks == "string") ks = ks.split(".");

  // If we have reached an undefined property
  // then stop executing and return undefined
  if (obj === undefined) return void 0;

  // If the path array has no more elements, we've reached
  // the intended property and return its value
  if (ks.length === 0) return obj;

  // If we still have elements in the path array and the current
  // value is null, stop executing and return undefined
  if (obj === null) return void 0;

  return getPath(obj[_.first(ks)], _.rest(ks));
}

function extractRooms(track) {
  let inTrack = getPath.bind(null, track);
  let artistName = inTrack('artist.#text');
  let albumName = inTrack('album.#text');
  let trackName = inTrack('name');

  return [{
    channel: artistName,
    name: artistName
  }, {
    channel: artistName + '/' + albumName,
    name: albumName
  }, {
    channel: artistName + '/' + albumName + '/' + trackName,
    name: trackName
  }];
}

function updateUserCurrentTrack(user, track) {
  let oldRooms = extractRooms(user.currentTrack);
  let newRooms = extractRooms(track);

  user.sockets.forEach(function(socket) {
    newRooms.forEach(function(newRoom, index) {
      let oldChannel = oldRooms[index] && oldRooms[index].channel;
      let newChannel = newRoom.channel;

      if (newChannel !== oldChannel) {
        user.sockets.forEach(function(socket) {
          // Leave old channel
          socket.leave(oldChannel, function(err){
            if(err) console.error(err);

          });
          // Join new channel if any
          if (newChannel) {
            socket.join(newChannel, function(err){
              if(err) console.error(err);

            });
          }
        });
      }
    });
    socket.emit('server.rooms.update', newRooms);
  });

  user.currentTrack = track;
}

function getRoom(channel){
    if(rooms.has(channel)){
        return rooms.get(channel);
    }
    let room = {
        messages: []
    }
    rooms.set(channel, room);
    return room;
}

function handleMessage(user, {channel, text}){
    let room = getRoom(channel);
    let date = Date.now();

    room.messages.push({
        date,
        user,
        text
    });

    io.in(channel).emit('server.message.send', {
        user: user.infos,
        date,
        channel,
        text
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

function handleLogin(socket, userName) {
  return getUser(userName).then(function(user) {
    // Add current socket to user socket list
    user.sockets.push(socket);
    return api.getCurrentTrack(user.infos.name).then(function(currentTrack) {
      updateUserCurrentTrack(user, currentTrack);
      return user;
    });
  });
}

function handleLogout(userName) {
  let user = users[userName];
  let rooms = extractRooms(user.currentTrack);

  user.sockets.forEach(function(socket) {
    rooms.forEach(function(room) {
      socket.leave(room.channel);
    });
    socket.emit('server.logout');
  });
}

function handleDisconnect(socket) {
  let user = socketUserMap.get(socket);
  if (user) {
    let socketIndex = user.sockets.indexOf(socket);
    if (socketIndex !== -1) {
      user.sockets.splice(socketIndex);
    }
  }
}
