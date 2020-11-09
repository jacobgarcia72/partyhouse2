import React, {Component} from 'react';
import Lobby from '../../other/lobby';
import { screens } from './helpers';
import { setGameState } from '../../../../functions/index';
import { connect } from 'react-redux';

import NotificationService, { PLAYERS_CHANGED } from '../../../../services/notif-service';
import { getGameByUrl } from '../../../../config/games';
import './style.sass';

let ns = new NotificationService();

class Speakeasy extends Component {

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
      this.nextScreen(screens.lobby);
      return;
    }
    if (update.playersGone.length) {
      // handlePlayersGone(update.playersGone, this.props);
    }
    if (update.playersJoined.length) {
      // handlePlayersJoined(update.playersJoined, this.props);
    }
  }

  nextScreen = screen => {
    setGameState(this.props.code, {screen});
  }

  renderContent() {
    switch (this.props.gameState.screen) {
      case screens.lobby:
        return <Lobby onContinue={this.startGame}/>;
      default:
        return null;
    }
  }

  render() {
    return <div className="Speakeasy">{this.renderContent()}</div>
  }
}

function mapStateToProps({ gameState, players, code, isHost }) {
  return { gameState, players, code, isHost };
}

export default connect(mapStateToProps, null)(Speakeasy);
