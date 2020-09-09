import React, {Component} from 'react';
import Lobby from '../../other/lobby';
import { screens, handlePlayersGone, handlePlayersJoined } from './helpers';
import { setGameState } from '../../../../functions/index';
import { connect } from 'react-redux';
import Intro from './intro';

import NotificationService, { PLAYERS_CHANGED } from '../../../../services/notif-service';
import { getGameByUrl } from '../../../../config/games';
import './style.sass';
import Read from './Read';
import Next from './Next';
import Write from './Write';
import Winner from './Winner';
import Final from './Final';

let ns = new NotificationService();

class StoryTime extends Component {

  componentWillUnmount() {
    ns.removeObserver(this, PLAYERS_CHANGED);
  }
  
  startGame = () => {
    setGameState(this.props.code, {
      screen: screens.intro,
      round: 0
    });
    ns.addObserver(PLAYERS_CHANGED, this, this.updatePlayers);
  }

  updatePlayers = update => {
    const minPlayers = getGameByUrl(this.props.gameUrl).minPlayers;
    if (update.newTotal < minPlayers) {
      setGameState(this.props.code, null)
      this.props.history.push('/');
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
    setGameState(this.props.code, {screen});
  }

  renderContent() {
    switch (this.props.gameState.screen) {
      case screens.lobby:
        return <Lobby onContinue={this.startGame}/>;
      case screens.intro:
        return <Intro nextScreen={() => this.nextScreen(null)}/>;
      case screens.read:
        return <Read />;
      case screens.next:
        return <Next />;
      case screens.write:
        return <Write />;
      case screens.winner:
        return <Winner />;
      case screens.final:
        return <Final />;
      default:
        return null;
    }
  }

  render() {
    return <div className="StoryTime">{this.renderContent()}</div>
  }
}

function mapStateToProps({ gameState, players, code, isHost }) {
  return { gameState, players, code, isHost };
}

export default connect(mapStateToProps, null)(StoryTime);
