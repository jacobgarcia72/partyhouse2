import React, {Component} from 'react';
import { connect } from 'react-redux';
import Lobby from '../../other/lobby';
import Intro from './intro';
import Upload from './upload';
import { screens, Meme, assignCaptionersToMemes } from './helpers';
import { setGameState, clearInput } from '../../../../functions/index';
import './style.sass';
import Caption from './Caption';

class MemeGame extends Component {

  componentDidUpdate() {
    const { isHost, gameState, input } = this.props;
    const { screen } = gameState;
    if (!isHost || !input) return;
    switch (screen) {
      case screens.upload:
        this.handleUploadUpdate();
        break;
      case screens.caption:
        this.handleCaptionUpdate();
        break;
      default:
    }
  }

  handleUploadUpdate = () => {
    const { players, code, input } = this.props;
    let allPlayersIn = true;
    const submittedPlayers = Object.keys(input).map(index => Number(index));
    for (let i = 0; i < players.length; i++) {
      if (!submittedPlayers.includes(players[i].index)) {
        allPlayersIn = false;
        break;
      }
    }
    if (allPlayersIn) {
      clearInput(code);
      let memes = [];
      players.forEach((player, i) => {
        input[player.index].forEach(image => {
          memes.push(new Meme(memes.length, player.index, image));
        });
      });
      memes = assignCaptionersToMemes(memes, players);
      setGameState(code, {screen: screens.caption, memes});
    }
  }

  handleCaptionUpdate = () => {
    const { players, code, input, gameState } = this.props;
    let allPlayersIn = true;
    const submittedPlayers = Object.keys(input).map(index => Number(index));
    for (let i = 0; i < players.length; i++) {
      if (!submittedPlayers.includes(players[i].index)) {
        allPlayersIn = false;
        break;
      }
    }
    if (allPlayersIn) {
      clearInput(code);
      const {memes} = gameState;
      players.forEach((player, i) => {
        input[player.index].forEach(meme => {
          memes[meme.index].caption = meme.caption;
        });
      });
      setGameState(code, {screen: screens.vote, memes});
    }
  }

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
      case screens.caption:
        return <Caption />;
      default:
        return null;
    }
  }

  render() {
    return <div className="DankU">{this.renderContent()}</div>
  }
}

function mapStateToProps({ gameState, players, code, isHost, input }) {
  return { gameState, players, code, isHost, input };
}

export default connect(mapStateToProps, null)(MemeGame);
