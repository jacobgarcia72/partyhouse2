import React, {Component} from 'react';
import { connect } from 'react-redux';
import Lobby from '../../other/lobby';
import Intro from './intro';
import Upload from './upload';
import { screens, Meme, assignCaptionersToMemes, pairMemes, Score, handlePlayersGone, handlePlayersJoined } from './helpers';
import { setGameState, clearInput } from '../../../../functions/index';
import './style.sass';
import Caption from './Caption';
import Vote from './Vote';
import DankestMeme from './DankestMeme';
import Scores from './Scores';
import NotificationService, { PLAYERS_CHANGED } from '../../../../services/notif-service';
import { getGameByUrl } from '../../../../config/games';

let ns = new NotificationService();

class MemeGame extends Component {

  startGame = () => {
    if (this.props.isHost) {
      ns.addObserver(PLAYERS_CHANGED, this, this.updatePlayers);
      this.newRound();
    }
  }

  componentWillUnmount() {
    ns.removeObserver(this, PLAYERS_CHANGED);
  }

  updatePlayers = update => {
    const { gameUrl, gameState, code } = this.props;
    const minPlayers = getGameByUrl(gameUrl).minPlayers;
    const screensThatCanContinueWithLessThanMinimum = [
      screens.vote, screens.dankestMeme, screens.scores
    ]
    if (update.newTotal < minPlayers && !screensThatCanContinueWithLessThanMinimum.includes(gameState.screen)) {
      setGameState(code, null)
      this.props.history.push('/');
      return;
    }
    if (update.playersGone.length) {
      handlePlayersGone(update.playersGone, this.props);
      if (this.props.input) {
        this.updatePlayerInput();
      }
    }
    if (update.playersJoined.length) {
      handlePlayersJoined(update.playersJoined, update.newPlayers, this.props);
    }
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
      case screens.upload:
        this.handleUploadUpdate();
        break;
      case screens.caption:
        this.handleCaptionUpdate();
        break;
      case screens.vote:
        this.handleVoteUpdate();
        break;
      default:
    }
  }

  newRound = (isReplay = false) => {
    setGameState(this.props.code, {
      screen: isReplay ? screens.upload : screens.intro,
      round: 0,
      memes: [],
      unusedMemes: [],
      pairs: [],
      showStats: false,
      dankestMemeIndex: null,
      bonusRound: false
    });
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
          memes.push(new Meme(memes.length, player, image));
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
      const { index } = players[i];
      if (!submittedPlayers.includes(index) && gameState.memes.filter(m => m.captioner === index).length) {
        allPlayersIn = false;
        break;
      }
    }
    if (allPlayersIn) {
      clearInput(code);
      const memes = gameState.memes.filter(m => submittedPlayers.includes(m.captioner));
      players.filter(p => submittedPlayers.includes(p.index)).forEach((player) => {
        input[player.index].forEach(meme => {
          memes.find(m => m.index === meme.index).caption = meme.caption;
        });
      });
      const pairs = pairMemes(memes);
      setGameState(code, {screen: screens.vote, memes, pairs, round: 0, showStats: false, bonusRound: false});
    }
  }

  handleVoteUpdate = () => {
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
      const { memes, pairs } = gameState;
      let { round, bonusRound } = gameState;
      bonusRound = bonusRound || false;
      players.forEach((player) => {
        const key = bonusRound ? 'bonusVotes' : 'votes';
        const vote = input[player.index];
        memes.find(m => m.index === vote)[key] += 1;
      });
      if (bonusRound) {
        const dankestMemeIndex = this.getDankestMemeIndex(memes, pairs[pairs.length - 1]);
        this.tallyScores(dankestMemeIndex);
        setGameState(code, { dankestMemeIndex, screen: screens.dankestMeme });
      } else {
        setGameState(code, {memes, showStats: true});
        round += 1;
        if (round >= pairs.length) {
          this.addBonusRoundMemes();
          bonusRound = true;
        }
        setTimeout(() => {
          setGameState(code, { round, showStats: false, bonusRound });
        }, 3500);
      }
    }
  }

  getDankestMemeIndex = (memes, pair) => {
    const i = memes.find(m => m.index === pair[0]);
    const j = memes.find(m => m.index === pair[1]);
    let dankestMeme;
      // first look at only votes from bonus round
    if (i.bonusVotes > j.bonusVotes) {
      dankestMeme = i.index;
    } else if (j.bonusVotes > i.bonusVotes) {
      dankestMeme = j.index;
      // if it's a tie, include votes from earlier
    } else if (i.bonusVotes + i.votes > j.bonusVotes + j.votes) {
      dankestMeme = i.index;
    } else if (j.bonusVotes + j.votes > i.bonusVotes + i.votes) {
      dankestMeme = j.index;
      // if it's still a tie, select at random
    } else {
      const rndX = Math.floor(Math.random() * 2);
      dankestMeme = pair[rndX];
    }
    return dankestMeme;
  }

  addBonusRoundMemes = ()=> {
    const { code } = this.props;
    const pairs = this.props.gameState.pairs.slice();
    const sortedMemes = this.props.gameState.memes.slice().sort((a, b)=> b.votes - a.votes);
    const bonusPair = [];
    for (let i = 0; i < 2; i++) {
      bonusPair.push(sortedMemes[i].index);
    }
    pairs.push(bonusPair);
    setGameState(code, { pairs });
  }

  tallyScores = (dankestMemeIndex) => {
    const { players, gameState, code } = this.props;
    const { pairs, memes } = gameState;
    let { scores } = gameState;
    if (!scores) {
      scores = players.map(p => new Score(p));
    }
    const addPoints = (memeIndex, pointsToAdd) => ['uploader', 'captioner'].forEach(role => {
      const pIndex = memes.find(m => m.index === memeIndex)[role];
      if (players[pIndex]) {
        const score = scores.find(s => s.playerIndex === pIndex) || new Score(players[pIndex]);
        score.points += pointsToAdd;
      }
    });
    // dont't include last pair, bc this is bonus round pair which is scored separately.
    pairs.slice(0, pairs.length - 1).forEach(pair => {
      const votesReceived = memes.find(m => m.index === pair[0]).votes + memes.find(m => m.index === pair[1]).votes;
      const points = [0,0];
      pair.forEach((memeIndex, i)=> {
        if (votesReceived) {
          points[i] = Math.round((memes.find(m => m.index === memeIndex).votes / votesReceived) * 1000);
        }
        addPoints(memeIndex, points[i]);
      });
    });
    addPoints(dankestMemeIndex, 500);
    scores = scores.sort((a, b) => b.points - a.points);
    setGameState(code, { scores });
  }

  nextScreen = screen => {
    if (screen === screens.intro) {
      this.startGame();
    }
    setGameState(this.props.code, { screen });
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
      case screens.vote:
        return <Vote />;
      case screens.dankestMeme:
        return <DankestMeme nextScreen={() => this.nextScreen(screens.scores)}/>;
      case screens.scores:
        return <Scores continueGame={() => this.newRound(true)} />;
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
