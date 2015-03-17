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
  getRooms: function(){
    return this.state.rooms.map(function(room, index){
      return <Room key={index} room={room} />
    }.bind(this));
  },
  render: function () {
    return (
      <div className="layout">
        <Toolbar className="toolbar">
          {this.props.currentUser.get('name')}
          <ToolbarGroup float="right">
            <RaisedButton
              onClick={this.handleLogoutClick}
              label="Logout"
              primary={true}/>
          </ToolbarGroup>
        </Toolbar>
        <div className="rooms">
          <Room key={0} ty />
          <Room key={1} />
          <Room key={2}/>
        </div>
      </div>
    );
  }
});

export default Layout;
