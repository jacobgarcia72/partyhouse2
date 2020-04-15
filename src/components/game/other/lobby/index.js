import React, {Component} from 'react';
import RoomCode from '../room-code';
import PlayerList from '../player-list';
import {connect} from 'react-redux';

class Lobby extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: ''
    };
  }

  onSubmit = event => {
    event.preventDefault();
    const { players, game } = this.props;
    const { minPlayers, maxPlayers } = game;
    let error = '';
    if (minPlayers > players.length) {
      error = `This game requires at least ${minPlayers} players.`;
    } else if (maxPlayers < players.length) {
      error = `This game has a limit of ${maxPlayers} players.`;
    } else {
      this.props.onContinue();
      return;
    }
    this.setState({ error });
  }

  render() {
    return <div className="column">
      <RoomCode roomCode={this.props.room.code}/>
      {this.props.game.displayName}
      <PlayerList />
      <form onSubmit={this.onSubmit}>
        <input type="submit"
          value="Start Game!"
        ></input>
        <div className="error">{this.state.error}</div>
      </form>
    </div>;
  }
}

function mapStateToProps({ room, players, game }) {
  return { room, players, game };
}

export default connect(mapStateToProps, null)(Lobby);
