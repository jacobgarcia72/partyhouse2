import storyStarts from './prompts';
import { maleNames, femaleNames } from './names';

export const screens = {
  intro: 'intro',
  read: 'read',
  next: 'next',
  write: 'write',
  winner: 'winner',
  final: 'final'
};

export const getStoryStart = () => {

  const makeMale = text=> {
    const rnd = Math.floor(Math.random() * maleNames.length);
    const name = maleNames[rnd];
    return text.split('Jacob').join(name);
  }

  const makeFemale = text=> {
    const rnd = Math.floor(Math.random() * femaleNames.length);
    const name = femaleNames[rnd];
    return text.split('Jacob').join(name).split(' his ').join(' her ').split(' he ').join(' she ').split(' man ').join(' woman ').split(' boy ').join(' girl ').split(' prince ').join(' princess ').split(' father ').join(' mother ');
  }

  let rnd = Math.floor(Math.random() * storyStarts.length);
  let storyStart = storyStarts[rnd];
  rnd = Math.floor(Math.random() * 2);
  rnd ? storyStart = makeMale(storyStart) : storyStart = makeFemale(storyStart);

  return storyStart;
}

export function handlePlayersGone(playersGone, props) {

}

export function handlePlayersJoined(playersJoined, props) {

}
