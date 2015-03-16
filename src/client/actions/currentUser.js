import Reflux from 'reflux';
import Api from 'api.js';
import config from 'client.config.js';
import io from 'socket.io-client';

let api = new Api(config.api.uri, config.api.key);

let socket = io();

let currentUserActions = Reflux.createActions({
  'login': {
    asyncResult: true
  },
  'logout': {
    asyncResult: true
  }
});

// when 'load' is triggered, call async operation and trigger related actions
currentUserActions.login.listen(function(payload) {
  api.getUserInfos(payload.username)
    .then(function(user) {
      socket.emit('login', user);
      this.completed(user);
    }.bind(this))
    .catch(this.failed);
});

currentUserActions.logout.listen(function(payload) {
  // By default, the listener is bound to the action
  // so we can access child actions using 'this'
  Promise.resolve(payload)
    .then(function(user) {
      socket.emit('logout', user.toJS());
      this.completed();
    }.bind(this))
    .catch(this.failed);
});

export default currentUserActions;
