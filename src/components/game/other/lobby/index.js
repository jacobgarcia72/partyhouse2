import React, {Component} from 'react';
import RoomCode from '../room-code';
import PlayerList from '../player-list';
import {connect} from 'react-redux';

class Lobby extends Component {

  render() {
    return <div>
      <RoomCode roomCode={this.props.room.code}/>
      <PlayerList />
    </div>;
  }
}

function mapStateToProps({room}) {
  return { room };
}

export default connect(mapStateToProps, null)(Lobby);
