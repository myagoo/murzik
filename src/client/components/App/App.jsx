import React from 'react';
import Reflux from 'reflux';
import {Toolbar, ToolbarGroup, DropDownMenu, DropDownIcon, IconButton, FontIcon, RaisedButton} from 'material-ui';
import Login from 'components/Login/Login.jsx';
import Layout from 'components/Layout/Layout.jsx';
import currentUserStore from 'stores/currentUser.js';

let App = React.createClass({
  mixins: [Reflux.connect(currentUserStore, 'currentUser')],
  render: function () {
    if(this.state.currentUser === undefined){
      return (
        <Login/>
      );
    }else{
      return (
        <Layout currentUser={this.state.currentUser}/>
      );
    }
  }
});

export default App;
