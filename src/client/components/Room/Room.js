import React from 'react';
import _ from 'lodash';
import {TextField, RaisedButton} from 'material-ui';
import {roomsActions} from 'actions.js';

let Room = React.createClass({
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

    this.roomsActions.send({
      channel: this.props.room.get('channel'),
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
    let messages = _.range(10).map(function(index){
      return (
        <div key={index} className="room__entry">
          {index}
        </div>
      );
    });

    return (
      <div className="room">
        <div className="room__infos">
          {this.props.room.get('name')}
        </div>
        <div className="room__entries">
          {messages}
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
