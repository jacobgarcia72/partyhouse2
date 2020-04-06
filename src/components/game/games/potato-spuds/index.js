import React, {Component} from 'react';
import RoomCode from '../../other/room-code';

export default class Potato extends Component {

  roomCode = this.props.match.params.roomCode;

  render() {
    return <div>
      <RoomCode roomCode={this.roomCode}/>
    </div>;
  }
}
