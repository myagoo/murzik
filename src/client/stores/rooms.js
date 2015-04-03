import Reflux from 'reflux';
import Immutable from 'expose?Immutable!immutable';
import {roomsActions} from 'actions.js';

let roomsStore = Reflux.createStore({
  listenables: roomsActions,
  init: function() {
    this.rooms = Immutable.Map();
  },
  getInitialState: function() {
    return this.rooms;
  },
  onUpdate: function(rooms) {
    this.rooms = Immutable.fromJS(rooms);
    this.trigger(this.rooms);
  },
  onReceive: function(message) {
    this.rooms = this.rooms.updateIn([message.channel, 'messages'], (messages) => messages.push(Immutable.fromJS(message)));
    this.trigger(this.rooms);
  }
});

export default roomsStore;
