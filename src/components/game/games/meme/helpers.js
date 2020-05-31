export const screens = {
  lobby: 'lobby',
  intro: 'intro',
  upload: 'upload',
  caption: 'caption',
  voteIntro: 'vote-intro',
  vote: 'vote',
  final: 'final'
}

export const totalImages = 106;

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
