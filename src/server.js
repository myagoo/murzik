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
app.get('/', function (req, res) {
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

http.listen(8000, function () {
    console.log('listening on *:8000');
});

var users = {};
var rooms = {};

setInterval(function () {
    Object.keys(users).map(function (username) {
        let user = users[username];
        console.log('#Current track', user.infos.name, user.currentTrack)
    });
}, 1000);

io.on('connection', function (socket) {

    socket.once('login', function (userName) {
        console.log('login', userName)
        handleLogin(socket, userName).then(function (user) {

            socket.once('logout', function () {
                handleLogout(user);
            });

            socket.on('message', function (message) {
                io.to(message.channel).emit(message);
            });

            socket.emit('login.completed', user);
        }).catch(function (error) {
            console.error('#ERROR', error);
            socket.emit('login.failed', error);
        });
    });

    socket.once('disconnect', function () {
        console.log('user disconnected');
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

function extractChannels(track) {
    let inTrack = getPath.bind(null, track);
    let artistName = inTrack('artist.#text');
    let albumName = inTrack('album.#text');
    let trackName = inTrack('name');

    return {
        artist: artistName,
        album: artistName + '/' + albumName,
        track: artistName + '/' + albumName + '/' + trackName,
    };
}

function updateUserChannels(user, track) {
    let oldChannels = extractChannels(user.currentTrack);
    let newChannels = extractChannels(track);

    Object.keys(newChannels).forEach(function (key) {
        if (newChannels[key] !== oldChannels[key]) {
            user.sockets.forEach(function (socket) {
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
    return api.getUserInfos(userName).then(function (userInfos) {
        users[userName] = {
            infos: userInfos,
            sockets: []
        };
        return users[userName];
    });
}

function handleLogin(socket, userName) {
    return getUser(userName).then(function (user) {
        // Add current socket to user socket list
        user.sockets.push(socket);
        return api.getCurrentTrack(user.infos.name).then(function (currentTrack) {
            console.log('getCurrentTrack', currentTrack);
            updateUserChannels(user, currentTrack);
            return user;
        });
    });
}

function handleLogout(user) {
    let channels = extractChannels(user.currentTrack);
    let channelKeys = Object.keys(channels);

    user.sockets.forEach(function (socket) {
        channelKeys.forEach(function (key) {
            socket.leave(channels[key]);
        });
        socket.emit('app.logout');
    });

    delete users[userName];
}
