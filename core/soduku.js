import { generateSoduku } from './sodukuGenerator';

function sodukuFactory() {
  let solutionMatrix = generateSoduku().generate();
  let puzzleMatrix;

  function produce(difficulty = 5) {
    puzzleMatrix = solutionMatrix.map((row) => {
      return row.map((cell) => {
        return Math.random() * 9 < difficulty ? 0 : cell;
      });
    });
    return puzzleMatrix;
  }

  return {
    produce,
  };
}

export { sodukuFactory };
