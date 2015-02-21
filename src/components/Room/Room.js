var React = require('react');
var _ = require('lodash');
var {TextField, RaisedButton} = require('material-ui');
var Room = React.createClass({
  render: function () {

    var entries = _.range(100).map(function(index){
      return (
        <div className="room__entry">
          TEST ! {index}
        </div>
      );
    }.bind(this));

    return (
      <div className="room">
        <div className="room__infos">
          TEST
        </div>
        <div className="room__entries">
          {entries}
        </div>
        <div className="room__actions">
          <TextField className="room__input" hintText={'Your message here'} />
        </div>
      </div>
    );
  }
});
module.exports = Room;
