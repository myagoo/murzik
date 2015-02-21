var React = require('react');
var {Toolbar, ToolbarGroup, DropDownMenu, DropDownIcon, IconButton, FontIcon, RaisedButton} = require('material-ui');
var Room = require('components/Room/Room.js');
var App = React.createClass({
  render: function () {
    var filterOptions = [
      { payload: '1', text: 'All Broadcasts' },
      { payload: '2', text: 'All Voice' },
      { payload: '3', text: 'All Text' },
      { payload: '4', text: 'Complete Voice' },
      { payload: '5', text: 'Complete Text' },
      { payload: '6', text: 'Active Voice' },
      { payload: '7', text: 'Active Text' },
    ];

    var iconMenuItems = [
      { payload: '1', text: 'Download' },
      { payload: '2', text: 'More Info' }
    ];

    return (
      <div className="app">
        <Toolbar>
          <ToolbarGroup key={0} float="left">
            <IconButton tooltip="you bastard">
              <FontIcon className="mdi-account-circle" />
            </IconButton>
            <DropDownMenu menuItems={filterOptions} />
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
            <DropDownIcon iconClassName="mdi-keyboard-arrow-down" menuItems={iconMenuItems} />
            <span className="mui-toolbar-separator">&nbsp;</span>
            <RaisedButton label="Create Broadcast" primary={true}/>
          </ToolbarGroup>
        </Toolbar>
        <div className="rooms">
          <Room />
          <Room />
          <Room />
        </div>
      </div>
    );
  }
});
module.exports = App;
