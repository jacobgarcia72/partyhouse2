import React, {Component} from 'react';
import { connect } from 'react-redux';
import Lobby from '../../other/lobby';
import Intro from './intro';
import Upload from './Upload';
import { screens, Meme, assignCaptionersToMemes, pairMemes, Score, handlePlayersGone, handlePlayersJoined, totalImages } from './helpers';
import { setGameState, clearInput, playVideo, playMusic, isNewInput } from '../../../../functions/index';
import './style.sass';
import Caption from './Caption';
import Vote from './Vote';
import DankestMeme from './DankestMeme';
import Scores from './Scores';
import NotificationService, { PLAYERS_CHANGED } from '../../../../services/notif-service';
import { getGameByUrl } from '../../../../config/games';
import Player from '../../../media/Player';

let ns = new NotificationService();

class MemeGame extends Component {

  interval;
  timerInterval;

  startGame = () => {
    if (this.props.isController) {
      ns.addObserver(PLAYERS_CHANGED, this, this.updatePlayers);
      this.newRound();
    }
  }

  componentDidMount() {
    const { isController, gameState, isDisplay } = this.props;

    if (isDisplay) {
      playMusic('lobby');
      playVideo('intro');
    }

    // restart timer where left off in case host refreshes
    if (isController && gameState.timer) {
      let callback = () => {};
      if (gameState.screen === screens.upload) {
        callback = this.concludeUploadRound;
      } else if (gameState.screen === screens.caption) {
        callback = this.concludeCaptionRound;
      } else if (gameState.screen === screens.vote) {
        callback = this.concludeVotingRound;
      }
      this.startTimer(Number(gameState.timer), callback);
    }
  }

  componentWillUnmount() {
    ns.removeObserver(this, PLAYERS_CHANGED);
    clearInterval(this.interval);
    clearInterval(this.timerInterval);
  }

  resetWaitingForList = () => {
    setGameState(this.props.code, {
      waitingFor: this.props.players.map((p) => {
        const { index, name } = p;
        return { index, name };
      })
    });
  }

  updatePlayers = (update) => {
    const { gameUrl, gameState } = this.props;
    const minPlayers = getGameByUrl(gameUrl).minPlayers;
    const screensThatCanContinueWithLessThanMinimum = [
      screens.vote, screens.dankestMeme, screens.scores
    ]
    if (update.newTotal < minPlayers && !screensThatCanContinueWithLessThanMinimum.includes(gameState.screen)) {
      clearInterval(this.interval);
      clearInterval(this.timerInterval);
      this.nextScreen(screens.lobby);
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
    if (!this.props.isController) return;
    const { input, players, gameState } = this.props;
    if (prevProps.gameState.screen !== gameState.screen) {
      this.handleNewScreen(gameState.screen);
    }
    if ((players.length < prevProps.players.length || isNewInput(prevProps.input, input))) {
      this.updatePlayerInput();
    }
  }

  handleNewScreen = (screen) => {
    const { gameState } = this.props;
    const { settings } = gameState;
    if (screen === screens.intro) {
      playMusic('main');
      playVideo('intro');
      this.startGame();
    } else if (screen === screens.upload && settings && settings.ImageTimer) {
      this.startTimer(Number(settings.ImageSeconds), this.concludeUploadRound);
    } else if (screen === screens.caption && settings && settings.CaptionTimer) {
      this.startTimer(Number(settings.CaptionSeconds), this.concludeCaptionRound);
    } else if (screen === screens.vote && settings && settings.VoteTimer) {
      this.interval = setTimeout(() => {
        this.startTimer(Number(settings.VoteSeconds), this.concludeVotingRound);
      }, 1800); // allow time for animation before starting timer
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
    this.resetWaitingForList();
  }

  handleUploadUpdate = () => {
    const { players, code, input } = this.props;
    let allPlayersIn = true;
    const submittedPlayers = Object.keys(input)
      .map(index => Number(index))
      .filter(index => input[index].length === 2);
    const waitingFor = [];
    for (let i = 0; i < players.length; i++) {
      if (!submittedPlayers.includes(players[i].index)) {
        allPlayersIn = false;
        waitingFor.push({index: players[i].index, name: players[i].name});
      }
    }
    if (allPlayersIn) {
      this.concludeUploadRound();
    }
    setGameState(code, {waitingFor});
  }

  handleCaptionUpdate = () => {
    const { players, code, input, gameState } = this.props;
    let allPlayersIn = true;
    const submittedPlayers = Object.keys(input)
      .map(index => Number(index))
      .filter(index => input[index].length === 2);
    const waitingFor = [];
    for (let i = 0; i < players.length; i++) {
      const { index } = players[i];
      if (!submittedPlayers.includes(index) && gameState.memes.filter(m => m.captioner === index).length) {
        allPlayersIn = false;
        waitingFor.push({index: players[i].index, name: players[i].name});
      }
    }
    if (allPlayersIn) {
      this.concludeCaptionRound();
    }
    setGameState(code, {waitingFor});
  }

  handleVoteUpdate = () => {
    const { players, code, input } = this.props;
    let allPlayersIn = true;
    const submittedPlayers = Object.keys(input).map(index => Number(index));
    const waitingFor = [];
    for (let i = 0; i < players.length; i++) {
      if (!submittedPlayers.includes(players[i].index)) {
        allPlayersIn = false;
        waitingFor.push({index: players[i].index, name: players[i].name});
      }
    }
    if (allPlayersIn) {
      this.concludeVotingRound();
    }
    setGameState(code, {waitingFor});
  }

  concludeUploadRound = () => {
    const { players, code } = this.props;
    let input = this.props.input || {};
    clearInput(code);
    let memes = [];
    players.forEach((player, i) => {
      const images = input[player.index] || [];
      while (images.length < 2) {
        images.push(Math.floor(Math.random() * totalImages));
      }
      images.forEach(image => {
        memes.push(new Meme(memes.length, player, image));
      });
    });
    memes = assignCaptionersToMemes(memes, players);
    clearInterval(this.timerInterval);
    setGameState(code, { memes, waitingFor: [], timer: null });
    this.nextScreen(screens.caption);
  }

  concludeCaptionRound = () => {
    const { players, code, gameState } = this.props;
    const input = this.props.input || {};
    clearInput(code);
    const memes = gameState.memes.filter(m => players.map(p => p.index).includes(m.captioner));
    players.forEach((player) => {
      const playerMemes = input[player.index] || [];
      playerMemes.forEach(meme => {
        const memeToAddCaptionTo = memes.find(m => m.index === meme.index);
        if (!memeToAddCaptionTo) return;
        memeToAddCaptionTo.caption = meme.caption;
      });
    });
    const pairs = pairMemes(memes);
    clearInterval(this.timerInterval);
    setGameState(code, { memes, pairs, round: 0, showStats: false, bonusRound: false, timer: null });
    this.nextScreen(screens.vote);
  }

  concludeVotingRound = () => {
    const { players, code, gameState } = this.props;
    const input = this.props.input || {};
    clearInput(code);
    const { memes, pairs, settings } = gameState;
    let { round, bonusRound } = gameState;
    bonusRound = bonusRound || false;
    players.forEach((player) => {
      const key = bonusRound ? 'bonusVotes' : 'votes';
      const vote = input[player.index];
      if (vote === undefined) {
        return;
      }
      memes.find(m => m.index === vote)[key] += 1;
    });
    if (bonusRound) {
      const dankestMemeIndex = this.getDankestMemeIndex(memes, pairs[pairs.length - 1]);
      this.tallyScores(dankestMemeIndex);
      clearInterval(this.timerInterval);
      setGameState(code, { dankestMemeIndex, screen: screens.dankestMeme, timer: null });
    } else {
      clearInterval(this.timerInterval);
      setGameState(code, {memes, showStats: true, timer: null});
      round += 1;
      if (round >= pairs.length) {
        this.addBonusRoundMemes();
        bonusRound = true;
      }
      this.interval = setTimeout(() => {
        setGameState(code, { round, showStats: false, bonusRound });
        if (bonusRound) {
          this.interval = setTimeout(() => {
            this.startTimer(Number(settings.VoteSeconds), this.concludeVotingRound);
          }, 1800); // allow time for animation before starting timer
        } else {
          this.startTimer(Number(settings.VoteSeconds), this.concludeVotingRound);
        }
      }, 3500);
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
      const player = players.find(p => p.index === pIndex);
      if (player) {
        const score = scores.find(s => s.playerIndex === pIndex) || new Score(player);
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

  startTimer = (seconds, callback) => {
    setGameState(this.props.code, {timer: seconds});
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      seconds--;
      setGameState(this.props.code, {timer: seconds});
      if (seconds === 0) {
        clearInterval(this.timerInterval);
        callback();
      }
    }, 1000);
  }

  nextScreen = (screen) => {
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
    return (
      <div className={`DankU ${this.props.isDisplay ? 'display' : 'device'}`}>
        {this.props.isDisplay && <Player />}
        {this.renderContent()}
      </div>
    )
  }
}

function mapStateToProps({ gameState, players, code, isController, input, isDisplay }) {
  return { gameState, players, code, isController, input, isDisplay };
}

export default connect(mapStateToProps, null)(MemeGame);
