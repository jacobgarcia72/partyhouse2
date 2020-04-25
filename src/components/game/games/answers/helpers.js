import questionBank from './questionBank';
import { setGameState } from '../../../../functions/index';

export const screens = {
  lobby: 'lobby',
  intro: 'intro',
  chooseCategory: 'choose-category',
  chooseQuestion: 'choose-question',
  readQuestion: 'read-question',
  final: 'final'
}

const getRandomElement = (array, exclude) => {
  let randomEl;
  do {
    randomEl = array[Math.floor(Math.random() * array.length)];
  } while (randomEl === exclude);
  return randomEl;
}
const removeElement = (array, el) => array.indexOf(el) > -1 ? array.splice(array.indexOf(el), 1) : null;

export const formatText = (text, round, players) => text.split('Jacob').join(players.find(player => player.index === round.askingIndex).name);

export function setRounds(players) {
  const playerIndicesForAsking = players.map(player => player.index);
  const playerIndicesForAnswering = players.map(player => player.index);
  const rounds = [];
  players.forEach(() => {
    let askingIndex;
    let answeringIndex;
    do {
      askingIndex = getRandomElement(playerIndicesForAsking);
      answeringIndex = getRandomElement(playerIndicesForAnswering);
      if (askingIndex === answeringIndex && playerIndicesForAnswering.length === 1) {
        askingIndex = rounds[0].askingIndex;
        rounds[0].askingIndex = answeringIndex;
      }
    } while (askingIndex === answeringIndex);
    removeElement(playerIndicesForAsking, askingIndex);
    removeElement(playerIndicesForAnswering, answeringIndex);
    rounds.push({askingIndex, answeringIndex});
  });
  return rounds;
}

export function getCategories() {
  let questions = [];
  questionBank.forEach(entry => {
    questions = questions.concat(
      entry.questions.map(q => {
        return {
          text: q,
          category: entry.category
        }
      })
    );
  });
  const question1 = getRandomElement(questions);
  removeElement(questions, question1);
  let question2;
  do {
    question2 = getRandomElement(questions);
    removeElement(questions, question2);
  } while (question1.category === question2.category);
  return [
    question1.category,
    question2.category
  ]
}

export function getQuestions(category) {
  const questions = questionBank.find(entry => entry.category === category).questions.slice();
  if (questions.length === 2) {
    return questions;
  }
  const randomQuestions = [];
  randomQuestions[0] = getRandomElement(questions);
  removeElement(questions, randomQuestions[0]);
  randomQuestions[1] = getRandomElement(questions);
  return randomQuestions;
}

export function handlePlayersGone(playersGone, props) {
  const { gameState, code, players } = props;
  const { rounds } = gameState;
  let { round } = gameState;
  playersGone.forEach(playerIndex => {
    const answeringRound = rounds.find(round => round.answeringIndex === playerIndex);
    if (rounds.indexOf(answeringRound) >= round) {
      removeElement(rounds, answeringRound);
    }
    const askingRound = rounds.find(round => round.askingIndex === playerIndex);
    console.log(askingRound)
    console.log(rounds)
    console.log(players)
    if (rounds.indexOf(askingRound) >= round) {
      askingRound.askingIndex = getRandomElement(players.map(p => p.index), askingRound.answeringIndex);
    }
  });
  if (round >= rounds.length) {
    round = 0;
  }
  console.log({round, rounds});
  setGameState(code, {round, rounds});
}

export function handlePlayersJoined(playersJoined, props) {
  const { gameState, code, players } = props;
  const { rounds, round } = gameState;
  playersJoined.forEach(playerIndex => {
    rounds.push({askingIndex: players[0].index, answeringIndex: playerIndex});
  });
  setGameState(code, {round, rounds});
}
