import React, {Component} from 'react';
import Lobby from '../../other/lobby';
import { screens, setRounds, handlePlayersGone, handlePlayersJoined } from './helpers';
import { setGameState } from '../../../../functions/index';
import { connect } from 'react-redux';
import Intro from './intro';
import ChooseCategory from './chooseCategory';
import ChooseQuestion from './chooseQuestion';
import ReadQuestion from './readQuestion';

import NotificationService, { PLAYERS_CHANGED } from '../../../../services/notif-service';
import { getGameByUrl } from '../../../../config/games';
let ns = new NotificationService();

class HonestAnswers extends Component {

  componentWillUnmount() {
    ns.removeObserver(this, PLAYERS_CHANGED);
  }
  
  startGame = () => {
    setGameState(this.props.code, {
      screen: screens.intro,
      round: 0,
      rounds: setRounds(this.props.players)
    });
    ns.addObserver(PLAYERS_CHANGED, this, this.updatePlayers);
  }

  updatePlayers = update => {
    const minPlayers = getGameByUrl(this.props.gameUrl).minPlayers;
    const { code } = this.props;
    console.log(update);
    if (update.newTotal < minPlayers) {
      setGameState(code, null);
      return;
    }
    if (update.playersGone.length) {
      handlePlayersGone(update.playersGone, this.props);
    }
    if (update.playersJoined.length) {
      handlePlayersJoined(update.playersJoined, this.props);
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
        return <Lobby onContinue={this.startGame}/>;
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
