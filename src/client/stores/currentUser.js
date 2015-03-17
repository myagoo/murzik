import Reflux from 'reflux';
import Immutable from 'immutable';
import {currentUserActions} from 'actions.js';

let currentUserStore = Reflux.createStore({
  listenables: currentUserActions,
  onLoginCompleted: function(currentUser) {
    let newCurrentUser = Immutable.fromJS(currentUser);
    if (Immutable.is(this.currentUser, newCurrentUser) === false) {
      this.currentUser = newCurrentUser;
      this.trigger(this.currentUser);
    }
  },
  onLogout: function() {
    delete this.currentUser;
    this.trigger(this.currentUser);
  }
});

export default currentUserStore;
