import React from 'react';
import _ from 'lodash';
import {TextField, RaisedButton, FontIcon} from 'material-ui';
import {roomsActions} from 'actions.js';

let Room = React.createClass({
  getInitialState: function(){
      return {
          value: ''
      };
  },
  handleChange: function(event){
    this.setState({
      value: event.target.value
    });
  },
  handleSubmit: function(event){
      event.preventDefault();
      let value = this.state.value.trim()
      if(value !== ''){
          roomsActions.send({
             channel: this.props.room.get('channel'),
             text: value
          });
          this.setState({
              value: ''
          });
      }
  },
  render: function () {
    let messages = this.props.room.get('messages').map(function(message, index){
      return (
        <div key={index} className="room__entry">
          <span className="room__entry_date">{message.get('date')}</span>
          <span className="room__entry_user">{message.getIn(['user', 'name'])}</span>
          <span className="room__entry_text">{message.get('text')}</span>
        </div>
      );
    }).toJS();

    return (
        <div className="room">
          <div className="room__infos">
            {this.props.room.get('name')}
          </div>
          <div className="room__entries">
            {messages}
          </div>
          <form
              className="room__actions"
              onSubmit={this.handleSubmit}>
            <TextField
              onChange={this.handleChange}
              value={this.state.value}
              className="room__input"
              hintText={'Your message here'} />
          <RaisedButton primary={true}>
              <span className="mui-raised-button-label room__input_label">Envoyer</span>
              <FontIcon className="room__input_icon mdi-send"/>
          </RaisedButton>
          </form>
        </div>
    );
  }
});

export default Room;
