import express from 'express';
import serve from 'serve-static';
import logger from 'morgan';
import socketIO from 'socket.io';
import config from 'server.config.js';
import Api from 'api.js';
import _ from 'lodash';

let api = new Api(config.api.uri, config.api.key);

let app = express();

//app.use(logger('combined'));

app.use(serve('static'));
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

let server = app.listen(8000, function() {
  console.log('listening on *:8000');
});

let io = socketIO.listen(server);

let users = new Map();
let socketUserMap = new Map();
let rooms = new Map();

setInterval(function() {
  Object.keys(users).map(function(username) {
    let user = users[username];
    console.log('#Current track', user)
  });
}, 60000 /* 1 minute */);

io.on('connection', function(socket) {
  console.log('connection');

  socket.on('client.login', function(userName) {
    console.log('login', userName);

    handleLogin(socket, userName).then(function(user) {

      socketUserMap.set(socket, user);

      socket.on('client.message.send', function(message) {
        console.log('client.message.send', userName, message, socket);
        handleMessage(user, message);
      });

      socket.once('client.logout', function() {
        console.log('client.logout', userName);
        handleLogout(userName);
        socket.removeAllListeners('client.message.send');
      });

      socket.emit('server.login.completed', user.infos);

    }).catch(function(error) {
      console.error(error);
      socket.emit('server.login.failed', error.message);
    });
  });

  socket.once('disconnect', function() {
    console.log('disconnected');
    handleDisconnect(socket);
    socketUserMap.delete(socket);
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

function getOrCreateRoom(channel, name) {
  if (rooms.has(channel)) {
    return rooms.get(channel);
  }
  let room = {
    channel,
    name,
    messages: []
  };
  rooms.set(channel, room);
  return room;
}


function extractRooms(track) {
  let inTrack = getPath.bind(null, track);
  let artistName = inTrack('artist.#text'),
    albumName = inTrack('album.#text'),
    trackName = inTrack('name');
  let artistChannel = artistName,
    albumChannel = artistName + '/' + albumName,
    trackChannel = artistName + '/' + albumName + '/' + trackName;

  return {
    [artistChannel]: getOrCreateRoom(artistChannel, artistName),
    [albumChannel]: getOrCreateRoom(albumChannel, albumName),
    [trackChannel]: getOrCreateRoom(trackChannel, trackName)
  };
}

function updateUserCurrentTrack(user, track) {
  let oldRooms = extractRooms(user.currentTrack);
  let newRooms = extractRooms(track);

  user.sockets.forEach(function(socket) {
    console.log('updating socket', socket.id);
    Object.keys(newRooms).forEach(function(roomKey) {

      let oldChannel = oldRooms[roomKey] && oldRooms[roomKey].channel;
      let newChannel = newRooms[roomKey].channel;

      console.log('oldChannel', oldChannel);
      console.log('newChannel', newChannel);

      if (newChannel !== oldChannel) {
        // Leave old channel
        if(oldChannel){
            console.log('leaving channel', oldChannel);
            socket.leave(oldChannel, function(err) {
                if (err) console.error('socket.leave', oldChannel, err);
            });
        }
        // Join new channel if any
        if (newChannel) {
          console.log('join channel', newChannel);
          socket.join(newChannel, function(err) {
            if (err) console.error('socket.join', newChannel, err);
          });
        }
      }
    });
    socket.emit('server.rooms.update', newRooms, function(err){
      if (err) console.error('server.rooms.update', newRooms, err);
    });
  });

  user.currentTrack = track;
}

function handleMessage(user, {channel, text}) {
  let room = rooms.get(channel);
  let date = Date.now();

  let message = {
      user: user.infos,
      date,
      channel,
      text
  };

  room.messages.push(message);

  console.log('server.message.send', message);

  io.in(channel).emit('server.message.send', message);
}

function getUser(userName) {
  if (users.has(userName)) {
    return Promise.resolve(users.get(userName));
  }
  return api.getUserInfos(userName).then(function(userInfos) {
    let user =  {
      infos: userInfos,
      sockets: []
    };
    users.set(userName, user);
    return user;
  });
}

function handleLogin(socket, userName) {
  return getUser(userName).then(function(user) {
    // Add current socket to user socket list
    user.sockets.push(socket);
    return api.getCurrentTrack(user.infos.name).then(function(currentTrack) {
      console.log('currentTrack', user.infos.name, currentTrack)
      updateUserCurrentTrack(user, currentTrack);
      return user;
    });
  });
}

function handleLogout(userName) {
  let user = users.get(userName);
  let rooms = extractRooms(user.currentTrack);

  delete user.currentTrack;

  user.sockets.forEach(function(socket) {
    Object.keys(rooms).forEach(function(channel) {
      console.log(`leaving channel ${channel} for socket ${socket.id}`);
      socket.leave(channel);
    });
    socket.emit('server.logout');
  });
}

function handleDisconnect(socket) {
  let user = socketUserMap.get(socket);
  if (user) {
    let socketIndex = user.sockets.indexOf(socket);
    if (socketIndex !== -1) {
      console.log(`removing socket ${user.sockets[socketIndex].id} for user ${user.infos.name}`);
      user.sockets.splice(socketIndex);
    }
    if(user.sockets.length === 0){
      users.delete(user.infos.name);
    }
  }
  socketUserMap.delete(socket);
}
