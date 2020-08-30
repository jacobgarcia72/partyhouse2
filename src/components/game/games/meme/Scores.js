import React, {Component} from 'react';
import { connect } from 'react-redux';

class Scores extends Component {

  render() {
    const { gameState, isHost, continueGame, players } = this.props;
    const minPlayers = 3;
    return (
      <div className="scores column">
        {gameState.scores.map((s, i) => <div key={i}>{s.playerName}: {s.points}</div>)}
        {isHost && players.length >= minPlayers ? <button type="submit" onClick={continueGame}>Continue Game</button> : null}
      </div>
    )
  }
}

function mapStateToProps({ gameState, isHost, players }) {
  return { gameState, isHost, players };
}

export default connect(mapStateToProps, null)(Scores);