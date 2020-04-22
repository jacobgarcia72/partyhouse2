import React, {Component} from 'react';
import { connect } from 'react-redux';
import { screens, setRounds } from './helpers';
import { setGameState } from '../../../../functions/index';

class ReadQuestion extends Component {

  handleClickDone = () => {
    const { gameState, code, players } = this.props;
    let { round, rounds } = gameState;
    round++;
    if (round === players.length) {
      round = 0;
      rounds = setRounds(this.props.players);
    }
    setGameState(code, {
      screen: screens.chooseCategory,
      round, rounds
    });
  }

  render() {
    const { playerIndex, gameState, players } = this.props;
    const { round, rounds, question } = gameState;
    const { answeringIndex } = rounds[round];
    const answeringPlayer = answeringIndex === playerIndex ? 'you' : players.find(player => player.index === answeringIndex).name;
    if (!rounds || !rounds[round]) {
      return <div>Loading...</div>;
    } else {
      const submitButton = (
        <form onSubmit={e => e.preventDefault()}>
          <button type="submit" onClick={this.handleClickDone}>Done</button>
        </form>
      );
      return <div className="column">
          <div>{answeringIndex === playerIndex ? 'Your' : `${answeringPlayer}'s`} question:</div>
          <div>{question}</div>
          {answeringIndex === playerIndex ? submitButton : null}
        </div>
    }
  }
}

function mapStateToProps({ gameState, playerIndex, players, code }) {
  return { gameState, playerIndex, players, code };
}

export default connect(mapStateToProps, null)(ReadQuestion);
