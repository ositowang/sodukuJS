import { grid, adjustLayout } from './layout/grid';
import popUpNumbers from './layout/popUp';

const gridContainer = document.getElementById('container');
const popUpElem = document.getElementById('popUp');
const startGame = document.querySelector('.start-button');
let sodukuBoard;

const popUp = popUpNumbers(popUpElem);
const restartBtn = document.getElementById('restart');
const checkBtn = document.getElementById('check');
const resetBtn = document.getElementById('reset');
const clearBtn = document.getElementById('clear');

function startPlay(e, restart = false) {
  if (!e.isTrusted) {
    alert("Don't cheat dude!");
    return;
  }
  if (restart) gridContainer.innerHTML = null;
  startGame.classList.add('hidden');
  sodukuBoard = grid(gridContainer);
  sodukuBoard.build();
  adjustLayout();
  sodukuBoard.bindPopUp(popUp);
  popUp.bindClicks();
}

startGame.addEventListener('click', startPlay);

//bind events to the control btn
restartBtn.addEventListener('click', (e) => startPlay(e, true));
checkBtn.addEventListener('click', (e) => {
  if (sodukuBoard.check()) {
    alert('You are so great');
    sodukuBoard.startPlay(e, true);
  }
  sodukuBoard.check();
});
resetBtn.addEventListener('click', () => {
  sodukuBoard.reset();
});
clearBtn.addEventListener('click', () => sodukuBoard.clear());
