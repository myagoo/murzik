import Reflux from 'reflux';

var currentUserActions = Reflux.createActions({
    'login': {
      asyncResult: true
    },
    'logout': {
      asyncResult: true
    }
});

// when 'load' is triggered, call async operation and trigger related actions
currentUserActions.login.listen( function(payload) {
    // By default, the listener is bound to the action
    // so we can access child actions using 'this'
    Promise.resolve(payload)
        .then( this.completed )
        .catch( this.failed );
});

currentUserActions.logout.listen( function(payload) {
    // By default, the listener is bound to the action
    // so we can access child actions using 'this'
    Promise.resolve(payload)
        .then( this.completed )
        .catch( this.failed );
});

export default currentUserActions;
