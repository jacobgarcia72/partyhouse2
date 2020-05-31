import React, {Component} from 'react';
import { connect } from 'react-redux';
import Lobby from '../../other/lobby';
import Intro from './intro';
import Upload from './upload';
import { screens } from './helpers';
import { setGameState } from '../../../../functions/index';
import './style.sass';

class MemeGame extends Component {

  nextScreen = screen => {
    let { round } = this.props.gameState;
    if (screen === screens.intro) {
      round = 0;
    }
    setGameState(this.props.code, { screen, round });
  }

  renderContent() {
    switch (this.props.gameState.screen) {
      case screens.lobby:
        return <Lobby onContinue={() => this.nextScreen(screens.intro)}/>;
      case screens.intro:
        return <Intro nextScreen={() => this.nextScreen(screens.upload)}/>;
      case screens.upload:
        return <Upload />;
      default:
        return null;
    }
  }

  render() {
    return <div className="DankU">{this.renderContent()}</div>
  }
}

function mapStateToProps({ gameState, players, code, isHost }) {
  return { gameState, players, code, isHost };
}

export default connect(mapStateToProps, null)(MemeGame);
