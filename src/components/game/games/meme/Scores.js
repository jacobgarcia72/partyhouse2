import React, {Component} from 'react';
import { connect } from 'react-redux';

class Scores extends Component {

  render() {
    const { gameState, isHost, continueGame } = this.props;
    return (
      <div className="scores column">
        {gameState.scores.map((s, i) => <div key={i}>{s.playerName}: {s.points}</div>)}
        {isHost ? <button type="submit" onClick={continueGame}>Continue Game</button> : null}
      </div>
    )
  }
}

function mapStateToProps({ gameState, isHost }) {
  return { gameState, isHost };
}

export default connect(mapStateToProps, null)(Scores);