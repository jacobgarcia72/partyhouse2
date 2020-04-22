import questionBank from './questionBank';

export const screens = {
  lobby: 'lobby',
  intro: 'intro',
  chooseCategory: 'choose-category',
  chooseQuestion: 'choose-question',
  readQuestion: 'read-question',
  final: 'final'
}

const getRandomElement = array => array[Math.floor(Math.random() * array.length)];
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
