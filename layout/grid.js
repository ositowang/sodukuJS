import { sodukuFactory } from '../core/soduku';
import { checker } from '../core/check';

/**
 * Function to create the soduku grid
 *
 * @param {*} container container for the soduku
 * @return {object}
 */
const grid = function(container) {
  function build() {
    const matrix = sodukuFactory().produce();
    const rowClass = ['row-top', 'row-middle', 'row-bottom'];
    const colClass = ['col-top', 'col-middle', 'col-right'];
    const cells = matrix.map((row, rowIndex) => {
      const rowContainer = document.createElement('div');
      rowContainer.classList.add('row');
      rowContainer.classList.add(rowClass[rowIndex % 3]);
      row.forEach((cell, cellIndex) => {
        const cellSpan = document.createElement('span');
        cellSpan.classList.add(colClass[cellIndex % 3]);
        cell ? cellSpan.classList.add('hint') : cellSpan.classList.add('empty');
        cellSpan.innerHTML = cell;
        rowContainer.appendChild(cellSpan);
      });
      return rowContainer;
    });
    cells.map((row) => {
      container.appendChild(row);
    });
  }

  function clear() {
    container
      .querySelectorAll('span.error')
      .forEach((cell) => cell.classList.remove('error'));
  }
  function handleShowPop(e, popUp) {
    const cell = e.target;
    if (cell.classList.contains('hint')) {
      return;
    }
    cell.classList.add('active');
    popUp.show(cell);
  }

  function bindPopUp(popUp) {
    container.addEventListener('click', (e) => handleShowPop(e, popUp));
  }

  function reset() {
    let resetSpans = container.querySelectorAll('span:not(.hint)');
    resetSpans.forEach((span) => {
      span.classList.remove('error', 'mark-unsure', 'mark-good');
      span.textContent = 0;
      span.classList.add('empty');
    });
  }

  function check() {
    let nodeList = [...container.children].map((row) => [...row.children]);
    let data = nodeList.map(
      (row) => row.map((cell) => parseInt(cell.textContent)) || 0,
    );
    const check = checker(data);
    if (check.check()) {
      return true;
    }
    const checkMatrix = check.matrixMarks;
    //mark the wrong cell
    nodeList.forEach((row, rowIndex) =>
      row.forEach((cell, colIndex) => {
        if (
          cell.classList.contains('hint') ||
          checkMatrix[rowIndex][colIndex]
        ) {
          cell.classList.remove('error');
        } else {
          cell.classList.add('error');
        }
      }),
    );
  }

  return {
    reset,
    check,
    build,
    bindPopUp,
    clear,
  };
};

/**
 * adjust the grid layout based on the actual screen
 *
 */
const adjustLayout = () => {
  const container = document.querySelector('#container');
  const width = container.querySelector('span').offsetWidth;
  const allSpans = container.querySelectorAll('span');
  allSpans.forEach((span) => {
    span.style.height = width + 'px';
    span.style.lineHeight = width + 'px';
  });
};
export { grid, adjustLayout };
