import React from 'react';
import {Paper, TextField, RaisedButton} from 'material-ui';
import currentUserActions from 'actions/currentUser.js';

var Login = React.createClass({
  getInitialState: function(){
    return {
      username: '',
      password: ''
    };
  },
  handleUsernameChange: function(e){
    this.setState({
      username: e.target.value
    });
  },
  handlePasswordChange: function(e){
    this.setState({
      password: e.target.value
    });
  },
  handleSubmit: function(e){
    e.preventDefault();
    currentUserActions.login({
      username: this.state.username,
      password: this.state.password
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
            floatingLabelText="Username"
            value={this.state.username}
            onChange={this.handleUsernameChange}/>
          <TextField
            name="password"
            type="password"
            floatingLabelText="Password"
            value={this.state.password}
            onChange={this.handlePasswordChange}/>
          <RaisedButton
            label="Sign in"
            primary={true}/>
        </form>
      </Paper>
    );
  }
});

export default Login;
