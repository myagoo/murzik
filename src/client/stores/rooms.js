import Reflux from 'reflux';
import Immutable from 'immutable';
import {roomsActions} from 'actions.js';

let roomsStore = Reflux.createStore({
    listenables: roomsActions,
    init: function () {
        this.rooms = Immutable.fromJS([]);
    },
    getInitialState: function () {
        return this.rooms;
    },
    onUpdate: function (rooms) {
        let newRooms = Immutable.fromJS(rooms);
        if (Immutable.is(this.rooms, newRooms) === false) {
            this.rooms = newRooms;
            this.trigger(this.rooms);
        }
    }
});

export default roomsStore;
