export const screens = {
  lobby: 'lobby',
  intro: 'intro',
  chooseCategory: 'choose-category',
  choosQuestions: 'choose-question',
  readQuestion: 'read-question',
  final: 'final'
}

const getRandomElement = array => array[Math.floor(Math.random() * array.length)];
const removeElement = (array, el) => array.indexOf(el) > -1 ? array.splice(array.indexOf(el), 1) : null;

export function setRounds(players) {
  console.log(players)
  const playerIndicesForAsking = players.map(player => player.index);
  const playerIndicesForAnswering = players.map(player => player.index);
  const rounds = [];
  players.forEach(() => {
    let askingIndex;
    let answeringIndex;
    do {
      askingIndex = getRandomElement(playerIndicesForAsking);
      answeringIndex = getRandomElement(playerIndicesForAnswering);
      console.log(askingIndex)
      console.log(answeringIndex)
      console.log(playerIndicesForAsking)
      console.log(playerIndicesForAnswering)
      if (askingIndex === answeringIndex && playerIndicesForAnswering.length === 1) {
        askingIndex = rounds[0].askingIndex;
        rounds[0].askingIndex = answeringIndex;
      }
    } while (askingIndex === answeringIndex);
    removeElement(playerIndicesForAsking, askingIndex);
    removeElement(playerIndicesForAnswering, answeringIndex);
    rounds.push({askingIndex, answeringIndex});
  });
  console.log(rounds);
}