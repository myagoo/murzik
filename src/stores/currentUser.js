import Reflux from 'reflux';
import {Map} from 'immutable';
import currentUserActions from 'actions/currentUser.js';

var currentUserStore = Reflux.createStore({
    listenables: currentUserActions,
    onLoginCompleted: function({username, password}) {
      this.currentUser = Map({
        username: username
      });
      this.trigger(this.currentUser);
    },
    onLogoutCompleted: function(){
      delete this.currentUser;
      this.trigger();
    }
});

export default currentUserStore;
