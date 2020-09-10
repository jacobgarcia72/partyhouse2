import React, {Component} from 'react';
import Lobby from '../../other/lobby';
import { screens, handlePlayersGone, handlePlayersJoined, getStoryStart, getPrompt, getWriters, findWinner } from './helpers';
import { setGameState, clearInput } from '../../../../functions/index';
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

  interval;

  componentWillUnmount() {
    ns.removeObserver(this, PLAYERS_CHANGED);
  }

  componentDidUpdate(prevProps) {
    const { isHost, input, players } = this.props;
    if ((players.length < prevProps.players.length || input !== prevProps.input) && isHost && input) {
      this.updatePlayerInput();
    }
  }

  updatePlayerInput = () => {
    const { screen } = this.props.gameState;
    switch (screen) {
      case screens.write:
        this.handleText();
        break;
      case screens.vote:
        this.handleVote();
        break;
      default:
    }
  }
  
  startGame = () => {
    const { code } = this.props;
    const firstLine = `Once upon a time, there was ${getStoryStart()}.`;
    setGameState(code, {
      screen: screens.read,
      turn: 0,
      story: [firstLine],
      prompt: getPrompt(0),
      timesAsWriter: { }
    });
    this.setNextWriters();
    this.interval = setTimeout(() => {
      this.nextScreen(screens.next);
    }, 4000);
  }

  setNextWriters = () => {
    const { players, code } = this.props;
    const timesAsWriter = this.props.timesAsWriter || { };
    const writers = getWriters(players, timesAsWriter);
    writers.forEach(writer => {
      timesAsWriter[writer.index] = timesAsWriter[writer.index] || 0;
      timesAsWriter[writer.index] += 1;
    });
    setGameState(code, { writers, timesAsWriter });
  }

  updatePlayers = update => {
    const minPlayers = getGameByUrl(this.props.gameUrl).minPlayers;
    if (update.newTotal < minPlayers) {
      this.nextScreen(screens.lobby);
      return;
    }
    if (update.playersGone.length) {
      handlePlayersGone(update.playersGone, this.props);
    }
    if (update.playersJoined.length) {
      handlePlayersJoined(update.playersJoined, this.props);
    }
  }

  handleText = () => {
    const { code, input, gameState } = this.props;
    let allPlayersIn = true;
    const submittedPlayers = Object.keys(input).filter(index => input[index].submitted).map(index => Number(index));
    const submittedCaptions = gameState.submittedCaptions || { };
    for (let i = 0; i < gameState.writers.length; i++) {
      const { index } = gameState.writers[i];
      submittedCaptions[index] = input[index] ? input[index].text : submittedCaptions[index] || ' ';
      if (allPlayersIn && !submittedPlayers.includes(index)) {
        allPlayersIn = false;
      }
    }
    setGameState(code, { submittedCaptions });
    if (allPlayersIn) {
      clearInput(code);
      this.nextScreen(screens.vote);
    }
  }

  handleVote = () => {
    const { code, input, players } = this.props;
    let allPlayersIn = true;
    const submittedPlayers = Object.keys(input).map(index => Number(index));
    for (let i = 0; i < players.length; i++) {
      const { index } = players[i];
      if (!submittedPlayers.includes(index)) {
        allPlayersIn = false;
        break;
      }
    }
    if (allPlayersIn) {
      clearInput(code);
      const winnerIndex = findWinner(input);
      const { submittedCaptions, story, turn, prompt, writers } = this.props.gameState;
      story[turn + 1] = `${prompt}, ${submittedCaptions[winnerIndex]}`;
      const winner = writers.find(w => w.index === winnerIndex) || {};
      console.log(winnerIndex)
      console.log(winner)
      console.log(writers)
      setGameState(code, { story, winner: winner.name, screen: screens.winner });
    }
  }

  nextScreen = screen => {
    clearInterval(this.interval);
    if (screen === screens.next) {
      this.interval = setTimeout(() => {
        this.nextScreen(screens.write);
      }, 4000);
    }
    setGameState(this.props.code, {screen});
  }

  renderContent = () => {
    switch (this.props.gameState.screen) {
      case screens.lobby:
        return <Lobby onContinue={() => {
          this.nextScreen(screens.intro);
          ns.addObserver(PLAYERS_CHANGED, this, this.updatePlayers);
        }}/>;
      case screens.intro:
        return <Intro nextScreen={this.startGame}/>;
      case screens.read:
        return <Read />;
      case screens.next:
        return <div><Read /><Next /></div>;
      case screens.write:
      case screens.vote:
        return <div><Read /><Write /></div>;
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

function mapStateToProps({ gameState, players, code, isHost, input }) {
  return { gameState, players, code, isHost, input };
}

export default connect(mapStateToProps, null)(StoryTime);
