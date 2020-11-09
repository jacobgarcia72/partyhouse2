import React from 'react';
import { setGameState } from '../../../../functions';

export const totalImages = 124;

export const screens = {
  lobby: 'lobby',
  intro: 'intro',
  upload: 'upload',
  caption: 'caption',
  vote: 'vote',
  dankestMeme: 'dankest-meme',
  scores: 'scores'
}

export class Meme {
  constructor(index, uploadingPlayer, image) {
    this.index = index;
    this.uploader = uploadingPlayer.index;
    this.uploaderName = uploadingPlayer.name;
    this.image = image;
    this.caption = null;
    this.captioner = null;
    this.captionerName = null;
    this.votes = 0;
    this.bonusVotes = 0;
  }
}

export class Score {
  constructor(player) {
    this.playerIndex = player.index;
    this.playerName = player.name;
    this.points = 0;
  }
}

export const renderMeme = (meme, i, specialClass) => (
  <div className={`meme${specialClass ? ` ${specialClass}` : ''}`} id={'meme-' + i} key={i}>
    <div className="caption">{meme.caption}</div>
    <img alt="meme" src={Number.isInteger(meme.image) ? `/assets/img/meme/templates/${meme.image}.jpg` : meme.image} />
  </div>
)

export const assignCaptionersToMemes = (memes, players) => {

  let mapPlayerIndexToNumberOfPairs = {};

  players.forEach(player=>{
    mapPlayerIndexToNumberOfPairs[player.index] = 0; // goal is to pair each player to 2 memes
  });

  let playersAvailable = players.map(player => player.index);

  // select a player to caption the meme, not the same as the uploader!
  const selectCaptioner = (uploader) => {
    let captioner; // player index to be returned by function
    
    if (playersAvailable.length === 1) {
      let lastPlayer = playersAvailable[0];
      if (lastPlayer===uploader) {
        
        //swap with a random meme that's already been assigned
        let replacementMeme;
        while(true) {
          const rndX = Math.floor(Math.random()*(memes.length-1));
          replacementMeme = memes[rndX];
          if (replacementMeme.captioner && replacementMeme.captioner !== uploader && replacementMeme.uploader !== uploader) break;
        }
        captioner = replacementMeme.captioner;
        replacementMeme.captioner = uploader;
        replacementMeme.captionerName = players.find(p => p.index === uploader).name;
      } else {
        captioner = lastPlayer;
      }
    } else {
      const options = playersAvailable.filter(index => index !== uploader);
      const rndX = Math.floor(Math.random()*options.length);
      captioner = options[rndX];
    }
    
    mapPlayerIndexToNumberOfPairs[captioner]++;
    if (mapPlayerIndexToNumberOfPairs[captioner]===2) {
      playersAvailable = playersAvailable.filter(index=>index!==captioner);
    }
    
    return captioner;
  }
  memes.forEach(meme=>{
    meme.captioner = selectCaptioner(meme.uploader);
    meme.captionerName = players.find(p => p.index === meme.captioner).name;
  });

  return memes;
}

// returns array of paired indices. e.g. [[1,4],[3,5]...]
export const pairMemes = memes => {
  let pairs = [];
  let remainingIndices = memes.map(meme => meme.index);

  const getRndX = ()=> Math.floor(Math.random()*remainingIndices.length);

  while (remainingIndices.length) {
    let pair = [];
    let rndX = getRndX();
    const index1 = remainingIndices[rndX];
    pair.push(index1);
    remainingIndices.splice(rndX, 1);
    while(true) {
      rndX = getRndX();
      const index2 = remainingIndices[rndX];
      //don't let them have the same captioner
      if (memes.find(m => m.index === index1).captioner === memes.find(m => m.index === index2).captioner) {
        if (remainingIndices.length > 1) {
          continue; 
        } else {
          //swap with the first one, which we already know won't be the same captioner bc each player only writes 2 captions
          pair.push(pairs[0][0]);
          pairs[0][0] = index2;
          remainingIndices = [];
          break;
        }
      } else {
        pair.push(index2);
        remainingIndices.splice(rndX, 1);
        break;
      }
    }
    pairs.push(pair);
  }
  return pairs;
}

export function handlePlayersGone(playersGone, props) {
  const { screen, memes } = props.gameState;
  const unusedMemes = props.gameState.unusedMemes || [];
  if (screen === screens.caption) {
    playersGone.forEach(playerIndex => {
      const playerWithNoMemes = props.players.find(p => !memes.filter(m => m.captioner === p.index).length);
      for (let i = 0; i < memes.length; i++) {
        const meme = memes[i];
        if (meme.captioner === playerIndex) {
          if (playerWithNoMemes) {
            meme.captioner = playerWithNoMemes.index;
            meme.captionerName = playerWithNoMemes.name;
          } else {
            unusedMemes.push(meme);
            memes.splice(i, 1);
            i--;
          }
        }
      }
    });
    setGameState(props.code, {unusedMemes, memes});
  }
}

export function handlePlayersJoined(playersJoined, newPlayers, props) {
  const { screen, memes } = props.gameState;
  const unusedMemes = props.gameState.unusedMemes || [];
  if (screen === screens.caption) {
    playersJoined.forEach(playerIndex => {
      if (unusedMemes.length) {
        for (let i = 0; i < 2 && unusedMemes.length; i++) {
          const meme = unusedMemes.shift();
          meme.captioner = playerIndex;
          meme.captionerName = newPlayers.find(p => p.index === playerIndex).name;
          memes.push(meme);
        }
      }
    });
    setGameState(props.code, {unusedMemes, memes});
  }
}
