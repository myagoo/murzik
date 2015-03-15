import Reflux from 'reflux';
import Immutable from 'immutable';
import currentUserActions from 'actions/currentUser.js';

var currentUserStore = Reflux.createStore({
    listenables: currentUserActions,
    onLoginCompleted: function(user) {
      this.currentUser = Immutable.fromJS(user);
      this.trigger(this.currentUser);
    },
    onLogoutCompleted: function(){
      delete this.currentUser;
      this.trigger();
    }
});

export default currentUserStore;
