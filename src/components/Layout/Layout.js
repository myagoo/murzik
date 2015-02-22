import React from 'react';
import {Toolbar, ToolbarGroup, DropDownMenu, DropDownIcon, IconButton, FontIcon, RaisedButton} from 'material-ui';
import Room from 'components/Room/Room.js';
import currentUserActions from 'actions/currentUser.js';

var Layout = React.createClass({
  handleLogoutClick: function(e){
    e.preventDefault();
    currentUserActions.logout();
  },
  render: function () {
    return (
      <div className="layout">
        <Toolbar>
          <IconButton
            iconClassName="mdi-account-circle"
            tooltip="GitHub"/>
          <ToolbarGroup float="right">
            <RaisedButton
              onClick={this.handleLogoutClick}
              label="Logout"
              primary={true}/>
          </ToolbarGroup>
        </Toolbar>
        <div className="rooms">
          <Room key={0} />
          <Room key={1} />
          <Room key={2}/>
        </div>
      </div>
    );
  }
});

export default Layout;
