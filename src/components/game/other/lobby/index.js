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
      <RoomCode roomCode={this.props.code}/>
      <div style={{fontSize: '1.2em', marginBottom: '1em'}}>
        {this.props.game.displayName}
      </div>
      <PlayerList />
      {this.props.isHost ? <form onSubmit={this.onSubmit}>
        <input type="submit"
          value="Start Game!"
        ></input>
        <div className="error">{this.state.error}</div>
      </form> : null}
    </div>;
  }
}

function mapStateToProps({ code, players, game, isHost }) {
  return { code, players, game, isHost };
}

export default connect(mapStateToProps, null)(Lobby);
