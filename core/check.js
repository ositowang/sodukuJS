import { makeMatrix } from './utils';
import { getBoxCells, convertToMatrixIndex } from './sodukuGenerator';

//check if the result is valid
function checkArray(array) {
  const length = array.length;
  let marks = Array(9).fill(true);
  for (let i = 0; i < length; i++) {
    if (!marks[i]) continue;
    const value = array[i];
    if (!value) {
      marks[i] = false;
      continue;
    }
    for (let j = i + 1; j < length; j++) {
      if (value === array[j]) {
        marks[i] = marks[j] = false;
      }
    }
  }
  return marks;
}

function checker(matrix) {
  let matrixMarks = makeMatrix(true);
  let success;

  function check() {
    checkRows();
    checkCols();
    checkBoxes();
    success = matrixMarks.every((row) => row.every((mark) => mark));
    return success;
  }

  function checkRows() {
    for (let i = 0; i < 9; i++) {
      const row = matrix[i];
      const marks = checkArray(row);
      for (let j = 0; j < 9; j++) {
        if (!marks[j]) {
          matrixMarks[i][j] = false;
        }
      }
    }
  }

  function checkCols() {
    for (let colIndex = 0; colIndex < 9; colIndex++) {
      const cols = [];
      for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
        cols[rowIndex] = matrix[rowIndex][colIndex];
      }

      const marks = checkArray(cols);
      for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
        if (!marks[rowIndex]) {
          matrixMarks[rowIndex][colIndex] = false;
        }
      }
    }
  }

  function checkBoxes() {
    for (let boxIndex = 0; boxIndex < 9; boxIndex++) {
      const box = getBoxCells(matrix, boxIndex);
      const marks = checkArray(box);
      for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
        if (!marks[cellIndex]) {
          const { rowIndex, colIndex } = convertToMatrixIndex(
            boxIndex,
            cellIndex,
          );
          matrixMarks[rowIndex][colIndex] = false;
        }
      }
    }
  }
  return {
    check,
    matrixMarks,
  };
}

export { checker, checkArray };
