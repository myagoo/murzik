import React from 'react';
import Reflux from 'reflux';
import {Toolbar, ToolbarGroup, DropDownMenu, DropDownIcon, IconButton, FontIcon, RaisedButton} from 'material-ui';
import Room from 'components/Room/Room.js';
import {currentUserActions} from 'actions.js';
import roomsStore from 'stores/rooms.js';

let Layout = React.createClass({
  mixins: [Reflux.connect(roomsStore, 'rooms')],
  handleLogoutClick: function(e){
    e.preventDefault();
    currentUserActions.logout();
  },
  render: function () {
    let rooms = this.state.rooms.map(function(room, index){
      return <Room key={index} room={room} />
    }.bind(this)).toJS();

    return (
      <div className="layout">
        <Toolbar className="toolbar">
            <span className="mui-font-style-display-2">
                {this.props.currentUser.get('name')}
            </span>
          <ToolbarGroup float="right">
            <RaisedButton
              onClick={this.handleLogoutClick}
              label="Logout"
              primary={true}/>
          </ToolbarGroup>
        </Toolbar>
        <div className="rooms">
            {rooms}
        </div>
      </div>
    );
  }
});

export default Layout;
