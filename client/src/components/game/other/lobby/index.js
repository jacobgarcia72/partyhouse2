import React, {Component} from 'react';
import PlayerList from '../player-list';
import {connect} from 'react-redux';
import './style.sass';
import { incrementGame } from '../../../../functions';

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
      incrementGame(game.url);
      this.props.onContinue();
      return;
    }
    this.setState({ error });
  }

  render() {
    return <div className="column Lobby">
      <div className="column">
        <h1 style={{marginBottom: 0}}>
          {this.props.game.displayName}
        </h1>
        <PlayerList />
      </div>
      {this.props.isHost ? <form onSubmit={this.onSubmit} className="column">
        <input type="submit"
          value="Start Game!"
        ></input>
        <div className="error">{this.state.error}</div>
      </form> : <p style={{margin: '1.5em'}}>{ this.props.players.length >= this.props.game.minPlayers ? 'Waiting on host to start the game.' : 'Go to partyhouse.tv on your device to join the game!' }</p>}
    </div>;
  }
}

function mapStateToProps({ players, game, isHost }) {
  return { players, game, isHost };
}

export default connect(mapStateToProps, null)(Lobby);
