import storyStarts from './prompts';
import { maleNames, femaleNames } from './names';
import { shuffle, setGameState } from '../../../../functions';

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

export const numberOfBackgroundImages = {
  stories: 7,
  morals: 7
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

export const getWriters = (players, timesAsWriter, onlyFindOne = false, excludeList = null) => {
  let numOfWriters;
  if (onlyFindOne) {
    numOfWriters = 1;
  } else if (players.length < 6) {
    numOfWriters = 2;
  } else if (players.length < 11) {
    numOfWriters = 3;
  } else {
    numOfWriters = 4;
  }
  let availablePlayers = players.slice();
  if (excludeList) {
    availablePlayers = availablePlayers.filter(p => !excludeList.includes(p.index));
  }
  const writers = shuffle(availablePlayers)
    .sort((a, b) => (timesAsWriter[a.index] || 0) - (timesAsWriter[b.index] || 0))
    .slice(0, numOfWriters);
  return onlyFindOne ? writers[0] : writers;
}

export const findWinner = (votes) => {
  const tallies = { };
  let maxVotes = 0;
  votes.forEach(vote => {
    tallies[vote] = tallies[vote] || 0;
    tallies[vote] += 1;
    if (tallies[vote] > maxVotes) {
      maxVotes = tallies[vote];
    }
  });
  const winners = Object.keys(tallies).filter(index => tallies[index] === maxVotes).map(i => Number(i));
  if (winners.length === 1) {
    return winners[0];
  } else {
    return winners[Math.floor(Math.random() * winners.length)];
  }
}

export function handlePlayersGone(playersGone, props) {
  const { screen, writers, timesAsWriter } = props.gameState;
  if ((screen === screens.next || screen === screens.write) && writers) {
    playersGone.forEach(index => {
      const writer = writers.find(w => w.index === index);
      if (writer) {
        const i = writers.indexOf(writer);
        writers[i] = getWriters(props.players, timesAsWriter, true, playersGone);
        const newWriterIndex = writers[i].index;
        timesAsWriter[newWriterIndex] = timesAsWriter[newWriterIndex] || 0;
        timesAsWriter[newWriterIndex]++;
      }
    });
    setGameState(props.code, {writers, timesAsWriter});
  }
}

