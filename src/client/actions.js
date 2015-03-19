import Reflux from 'reflux';
import io from 'socket.io-client';

let socket = io();

/**
 * Current User Actions
 */
export let currentUserActions = Reflux.createActions({
  'login': {
    preEmit: function(userName) {
      console.log('client.login', userName);
      socket.emit('client.login', userName);
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
  'update': {},
  'send': {
    preEmit: function(payload) {
      console.log('client.message.send', payload);
      socket.emit('client.message.send', payload);
    }
  },
  'receive': {}
});

socket.on('server.rooms.update', function(rooms) {
  console.log('server.rooms.update', rooms);
  roomsActions.update(rooms);
});

socket.on('server.message.send', function(message) {
  console.log('server.message.send', message);
  roomsActions.receive(message);
});
