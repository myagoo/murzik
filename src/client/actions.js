import Reflux from 'reflux';
import Api from 'api.js';
import config from 'client.config.js';
import io from 'socket.io-client';

let api = new Api(config.api.uri, config.api.key);
let socket = io();

/**
 * Current User Actions
 */
export let currentUserActions = Reflux.createActions({
  'login': {
    preEmit: function(payload) {
      console.log('client.login');
      socket.emit('client.login', payload.username);
    },
    asyncResult: true
  },
  'logout': {
    preEmit: function() {
      console.log('client.logout');
      socket.emit('client.logout');
    }
  }
});

socket.on('server.logout', function() {
  console.log('server.logout');
  currentUserActions.logout();
});

socket.on('server.login.completed', function(user) {
  console.log('server.login.completed', user);
  currentUserActions.login.completed(user);
});

socket.on('server.login.failed', function(error) {
  console.log('server.login.completed', error);
  currentUserActions.login.failed(error);
});

/**
 * Rooms Actions
 */
export let roomsActions = Reflux.createActions({
  'update': {}
});

socket.on('server.rooms.update', function(rooms) {
  console.log('server.rooms.update', rooms);
  roomsActions.update(rooms);
});
