const { fourbyfourAI, winningCombinations, currentTurn } = require('./fourbyfour');
const { winningCombo } = require('./game');
const { indexToCoordinates, coordinatesToIndex } = require('./convertor');

const randomIntegerInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

module.exports.tictactoe = (event, context, callback) => {
  const { board, coordinate } = JSON.parse(event.body);
  if (coordinate) board[coordinatesToIndex(coordinate)] = currentTurn(board);

  let boardWithAnswer;
  let newTurnCoordinate;
  let isFault;
  if (Math.random() < 0.5) {
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

  callback(null, response);
};
