'use strict';
const { Worker } = require('worker_threads');

// Example Sudoku based on the one on Wikipedia’s 'Sudoku' page:
const sudoku = new Uint8Array([
  5, 3, 0, 0, 7, 0, 0, 0, 0,
  6, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 9, 8, 0, 0, 0, 0, 6, 0,
  8, 0, 0, 0, 6, 0, 0, 0, 3,
  4, 0, 0, 8, 0, 3, 0, 0, 1,
  7, 0, 0, 0, 2, 0, 0, 0, 6,
  0, 6, 0, 0, 0, 0, 2, 8, 0,
  0, 0, 0, 4, 1, 9, 0, 0, 5,
  0, 0, 0, 0, 8, 0, 0, 7, 9,
]);

const worker = new Worker('./worker.js');
worker.postMessage(sudoku);
worker.once('message', (solution) => {
  console.log(solution);
  // Let the Node.js main thread exit, even though the Worker is still running:
  worker.unref();
});
