import React, {Component} from 'react';
import Lobby from '../../other/lobby';
import { screens, setRounds } from './helpers';
import { setGameState } from '../../../../functions/index';
import { connect } from 'react-redux';
import Intro from './intro';
import ChooseCategory from './chooseCategory';
import ChooseQuestion from './chooseQuestion';
import ReadQuestion from './readQuestion';

class HonestAnswers extends Component {

  componentDidMount() {
    if (this.props.isHost) {
      setGameState(this.props.code, {
        screen: screens.lobby,
        round: -1,
        rounds: []
      });
    }
  }

  nextScreen = screen => {
    let { round, rounds } = this.props.gameState;
    if (screen === screens.intro) {
      round = 0;
      rounds = setRounds(this.props.players);
    }
    setGameState(this.props.code, {screen, round, rounds});
  }

  render() {
    switch (this.props.gameState.screen) {
      case screens.lobby:
        return <Lobby onContinue={() => this.nextScreen(screens.intro)}/>;
      case screens.intro:
        return <Intro nextScreen={() => this.nextScreen(screens.chooseCategory)}/>;
      case screens.chooseCategory:
        return <ChooseCategory />;
      case screens.readQuestion:
        return <ReadQuestion />;
      case screens.chooseQuestion:
    return <ChooseQuestion />;
      default:
        return null;
    }
  }
}

function mapStateToProps({ gameState, players, code, isHost }) {
  return { gameState, players, code, isHost };
}

export default connect(mapStateToProps, null)(HonestAnswers);
