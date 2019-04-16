import { makeMatrix, shuffle } from './utils';

/**
 * Function for generating the soduku with number filled
 *
 */
function generateSoduku() {
  let matrix;
  let randomColumnIndex;

  /**
   * Entry point for generating the soduku
   *
   */

  function generate() {
    while (!generateSodu()) {
      console.log('try again');
    }
    return matrix;
  }

  function generateSodu() {
    matrix = makeMatrix();
    randomColumnIndex = makeMatrix()
      .map((row) => row.map((v, i) => i))
      .map((row) => shuffle(row));
    for (let n = 1; n <= 9; n++) {
      if (!fillNumber(n)) {
        return false;
      }
    }
    return true;
  }

  /**
   * fill the empty soduku with correct number, we fill the number for each row
   * with a certain number till the final row.
   *
   * @param {Number} n number to be filled
   */
  function fillNumber(n) {
    return fillRow(n, 0);
  }

  /**
   * Fill the number in a correct place in a row without repeating(in a row ,in
   * a column and in a box)
   *
   * @param {Number} n number to fit in
   * @param {Number} rowIndex the index of the row to be filled
   */
  function fillRow(n, rowIndex) {
    // base case, we fill all the box successfully
    if (rowIndex > 8) {
      return true;
    }

    const row = matrix[rowIndex];
    const columns = randomColumnIndex[rowIndex];
    for (let i = 0; i < 9; i++) {
      const colIndex = columns[i];
      // if this column already has a number filled
      if (row[colIndex]) {
        continue;
      }
      /**
       * check if we could fill n in this cell, we could fill the number in if
       * there is no same number in this row,in this column and in this box
       */
      if (!fillable(matrix, n, rowIndex, colIndex)) {
        continue;
      }
      //we could fill n in
      row[colIndex] = n;
      // if we could not fill n in the next row, we need take one step back
      if (!fillRow(n, rowIndex + 1)) {
        //reset the
        row[colIndex] = 0;
        continue;
      }
      return true;
    }
    return false;
  }

  function fillable(matrix, num, rowIndex, colIndex) {
    const row = matrix[rowIndex];
    const column = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((v) => matrix[v][colIndex]);
    const { boxIndex } = convertToBoxIndex(rowIndex, colIndex);
    const boxNumbers = getBoxCells(matrix, boxIndex);
    for (let i = 0; i < 9; i++) {
      if (row[i] === num || column[i] === num || boxNumbers[i] === num) {
        return false;
      }
    }
    return true;
  }

  return {
    matrix,
    generate,
  };
}

function convertToBoxIndex(rowIndex, colIndex) {
  return {
    boxIndex: Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3),
    cellIndex: (rowIndex % 3) * 3 + (colIndex % 3),
  };
}

function convertToMatrixIndex(boxIndex, cellIndex) {
  return {
    rowIndex: Math.floor(boxIndex / 3) * 3 + Math.floor(cellIndex / 3),
    colIndex: (boxIndex % 3) * 3 + (cellIndex % 3),
  };
}

function getBoxCells(matrix, boxIndex) {
  const boxStartRow = Math.floor(boxIndex / 3) * 3;
  const boxStartCol = (boxIndex % 3) * 3;
  let result = [];
  for (let i = 0; i < 9; i++) {
    let rowIndex = boxStartRow + Math.floor(i / 3);
    let colIndex = boxStartCol + (i % 3);
    result.push(matrix[rowIndex][colIndex]);
  }
  return result;
}

export { generateSoduku, getBoxCells, convertToMatrixIndex };
