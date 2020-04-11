import React, {Component} from 'react';
import RoomCode from '../../other/room-code';

export default class MemeGame extends Component {

  roomCode = this.props.match.params.roomCode;

  render() {
    return <div>
      <RoomCode roomCode={this.roomCode}/>
    </div>;
  }
}
