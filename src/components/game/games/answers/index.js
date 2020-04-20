import React, {Component} from 'react';
import Lobby from '../../other/lobby';
import { screens, setRounds } from './helpers';
import { setGameState } from '../../../../functions/index';
import { connect } from 'react-redux';

class HonestAnswers extends Component {

  constructor(props) {
    super(props);
    this.state = {
      screen: screens.lobby,
      round: -1,
      rounds: []
    }
  }

  nextScreen = screen => {
    console.log(screen);
    let round = this.state.round;
    if (screen === screens.intro) {
      round = 0;
      setRounds(this.props.players);
    }
    setGameState(this.props.room.code, {screen, round});
  }

  render() {
    switch (this.props.room.gameState.screen) {
      case screens.lobby:
        return <Lobby onContinue={() => this.nextScreen(screens.intro)}/>;
      case screens.intro:
        return <p>Hello World</p>;
      case screens.chooseCategory:
        return <p>Choose Category</p>;
      default:
        return null;
    }
  }
}

function mapStateToProps({ room, players }) {
  return { room, players };
}

export default connect(mapStateToProps, null)(HonestAnswers);
