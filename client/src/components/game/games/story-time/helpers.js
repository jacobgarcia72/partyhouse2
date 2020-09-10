import storyStarts from './prompts';
import { maleNames, femaleNames } from './names';
import { shuffle } from '../../../../functions';

export const screens = {
  intro: 'intro',
  lobby: 'lobby',
  read: 'read',
  next: 'next',
  write: 'write',
  vote: 'vote',
  winner: 'winner',
  final: 'final'
};

export const getStoryStart = () => {

  const makeMale = text => {
    const rnd = Math.floor(Math.random() * maleNames.length);
    const name = maleNames[rnd];
    return text.split('Jacob').join(name);
  }

  const makeFemale = text => {
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

export const getPrompt = turn => {
  return [
    'And every day',
    'Until one day',
    'Because of that',
    'Unfortunately',
    'And because of that',
    'Until finally',
    'And ever since that day',
    'And the moral of the story is'
  ][turn];
}

export const getWriters = (players, timesAsWriter) => {
  let numOfWriters;
  if (players.length < 6) {
    numOfWriters = 2;
  } else if (players.length < 11) {
    numOfWriters = 3;
  } else {
    numOfWriters = 4;
  }
  return shuffle(players).sort((a, b) => timesAsWriter[a.index] || 0 - timesAsWriter[b.index] || 0).slice(0, numOfWriters);
}

export function handlePlayersGone(playersGone, props) {

}

export function handlePlayersJoined(playersJoined, props) {

}
