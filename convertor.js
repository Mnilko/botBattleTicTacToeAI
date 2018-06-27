const coordinates = {
  a: [0, 4, 8, 12],
  b: [1, 5, 9, 13],
  c: [2, 6, 10, 14],
  d: [3, 7, 11, 15],
};

const phoneticToLetter = {
  alpha: "a",
  bravo: "b",
  charlie: "c",
  delta: "d",
};

const letterToPhonetic = {
  a: "alpha",
  b: "bravo",
  c: "charlie",
  d: "delta",
};

module.exports = {
  indexToCoordinates(i) {
    for (const col in coordinates) {
      const row = coordinates[col].indexOf(i);
      if (row > -1) {
        return `${letterToPhonetic[col]} ${row+1}`;
      }
    }
  },
  coordinatesToIndex(c) {
    const firstC = c[0] || phoneticToLetter[c[0]];
    const secondC = c[1]-1;
    console.log('incoming coordinate:', c, ', first c:', firstC, ', second c:', secondC);
    return coordinates[firstC][secondC];
  },
};
