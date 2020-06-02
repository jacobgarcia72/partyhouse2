import React from 'react';

export const totalImages = 106;

export const screens = {
  lobby: 'lobby',
  intro: 'intro',
  upload: 'upload',
  caption: 'caption',
  voteIntro: 'vote-intro',
  vote: 'vote',
  final: 'final'
}

export class Meme {
  constructor(index, uploader, image) {
    this.index = index;
    this.uploader = uploader;
    this.image = image;
    this.caption = null;
    this.captioner = null;
    this.votes = 0;
    this.bonusVotes = 0;
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
    mapPlayerIndexToNumberOfPairs[player.index]=0; // goal is to pair each player to 2 memes
  });

  let playersAvailable = players.map(player=>player.index);

  // select a player to caption the meme, not the same as the uploader!
  const selectCaptioner = (uploader) => {
    let captioner; // player index to be returned by function
    
    if (playersAvailable.length === 1) {
      let lastPlayer = playersAvailable[0];
      if (lastPlayer===uploader) {
        
        //swap with a random meme that's already been assigned
        let meme;
        while(true) {
          const rndX = Math.floor(Math.random()*(memes.length-1));
          meme = memes[rndX];
          if (meme.captioner && meme.captioner !== uploader && meme.uploader !== uploader) break;
        }
        captioner = meme.captioner;
        meme.captioner = uploader;
        
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
  });

  return memes;
}

// returns array of paired indices. e.g. [[1,4],[3,5]...]
export const pairMemes = memes => {
  let pairs = [];
  let remainingIndices = memes.map((meme,i)=>i);

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
      if (memes[index1].captioner === memes[index2].captioner) {
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
