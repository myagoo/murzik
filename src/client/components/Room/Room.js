import React from 'react';
import _ from 'lodash';
import {TextField, RaisedButton} from 'material-ui';

var Room = React.createClass({
  getInitialState: function(){
      return {
          value: ''
      };
  },
  handleKeyDown: function(event){
    if(event.keyCode !== 27){
      return;
    }

    let value = this.state.value.trim();

    if(value === ''){
      return;
    }

    this.roomAction.send({
      channel: this.props.channel,
      message: value
    });

    this.setState({
      value: ''
    });
  },
  handleChange: function(event){
    this.setState({
      value: event.target.value
    });
  },
  render: function () {
    var entries = _.range(100).map(function(index){
      return (
        <div key={index} className="room__entry">
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
          <TextField
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            value={this.state.value}
            className="room__input"
            hintText={'Your message here'} />
        </div>
      </div>
    );
  }
});

export default Room;
