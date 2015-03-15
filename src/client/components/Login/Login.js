import React from 'react';
import {Paper, TextField, RaisedButton} from 'material-ui';
import currentUserActions from 'actions/currentUser.js';

var Login = React.createClass({
  getInitialState: function(){
    return {
      username: ''
    };
  },
  handleUsernameChange: function(e){
    this.setState({
      username: e.target.value
    });
  },
  handleSubmit: function(e){
    e.preventDefault();
    currentUserActions.login({
      username: this.state.username
    });
  },
  render: function(){
    return (
      <Paper
        className="login"
        innerClassName="login__inner"
        zDepth={3}>
        <div className="mui-font-style-display-3">Murzik</div>
        <form
          action="login"
          method="post"
          className="login__form"
          onSubmit={this.handleSubmit}>
          <TextField
            autoFocus
            name="username"
            floatingLabelText="Your Last.fm username"
            value={this.state.username}
            onChange={this.handleUsernameChange}/>
          <RaisedButton
            label="Sign in"
            primary={true}/>
        </form>
      </Paper>
    );
  }
});

export default Login;
