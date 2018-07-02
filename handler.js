const { fourbyfourAI, winningCombinations, currentTurn } = require('./fourbyfour');
const { winningCombo } = require('./game');
const { indexToCoordinates, coordinatesToIndex } = require('./convertor');
const request = require('request-promise-native');

const randomIntegerInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

module.exports.tictactoe = (event, context, callback) => {
  const { board, coordinate, isAlexa = false } = JSON.parse(event.body);
  if (coordinate) board[coordinatesToIndex(coordinate)] = currentTurn(board);

  let boardWithAnswer;
  let newTurnCoordinate;
  let isFault;
  const factor = isAlexa ? 1 : 5;
  if (Math.random() < (0.1 * factor)) {
    const emptyFieldIndexes = board.map((e, i) => e === '' ? i : null).filter(e => e);
    
    if (emptyFieldIndexes.length != 0) {
      const faultIndex = randomIntegerInRange(1, emptyFieldIndexes.length) - 1;
      newTurnCoordinate = indexToCoordinates(emptyFieldIndexes[faultIndex]);
      boardWithAnswer = [...board];
      boardWithAnswer[emptyFieldIndexes[faultIndex]] = currentTurn(boardWithAnswer);
    } 
    isFault = true;
  } else {
    boardWithAnswer = fourbyfourAI(board);
    newTurnCoordinate = indexToCoordinates(board.findIndex((e, i) => e !== boardWithAnswer[i]));
    isFault = false;
  }

  const winStatus = winningCombo(boardWithAnswer, winningCombinations, ['X', 'O']);

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      board: boardWithAnswer,
      newTurnCoordinate,
      winStatus,
      isFault,
    }),
  };

  const options = {
    method: 'POST',
    url: 'https://ps.pndsn.com/publish/pub-c-048b1453-853a-4840-8cdf-13acbba2638a/sub-c-c9df3d40-7e16-11e8-aeff-b67b4c79ce4d/0/ch1/0',
    headers: { 'Content-Type': 'application/json' },
    body: { board: boardWithAnswer },
    json: true
  };

  request(options).then((resp) => {
    console.log(resp);
    callback(null, response)}
  );
};
