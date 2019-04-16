//create a matrix representing the soduku

function makeMatrix(v = 0) {
  return Array.from({ length: 9 }, () => Array(9).fill(v));
}

/**
 * Fisher Yates shuffle algorithm
 * The Fisher-Yates algorithm works by picking one random element for each
 * original array element
 * @param {array} array
 * @returns {array} shuffled array
 */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export { makeMatrix, shuffle };
