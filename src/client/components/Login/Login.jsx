import React from 'react';
import {Paper, TextField, RaisedButton} from 'material-ui';
import {currentUserActions} from 'actions.js';

let Login = React.createClass({
  getInitialState: function(){
    return {
      username: ''
    };
  },
  handleUsernameChange: function(event){
    this.setState({
      username: event.target.value
    });
  },
  handleSubmit: function(event){
    event.preventDefault();
    currentUserActions.login(this.state.username);
  },

  render: function(){
    return (
      <div className="login_container">
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
      </div>
    );
  }
});

export default Login;
