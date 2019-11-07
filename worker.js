'use strict';
const { parentPort } = require('worker_threads');
const { solveSudoku } = require('./solve-sudoku.js');

// parentPort is the Worker’s way of communicating with the parent, similar to
// window.onmessage in Web Workers.
parentPort.on('message', (sudokuData) => {
  const solution = solveSudoku(sudokuData);
  parentPort.postMessage(solution);
});
