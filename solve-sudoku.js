'use strict';
// Helpers for dealing with a Sudoku field represented as 81 consecutive fields
function indexToXY(index) {
  const x = index % 9;
  const y = (index - x) / 9;
  return [ x, y ];
}

function xyToIndex(x, y) {
  return x + y * 9;
}

function solveSudoku(sudoku) {
  // Find first unknown entry in the array.
  const unknownIndex = sudoku.indexOf(0);
  if (unknownIndex === -1)
    return sudoku;  // Already solved.
  const [x, y] = indexToXY(unknownIndex);

  const forbiddenValues = new Uint8Array(10);
  // Do not use values already present in this row
  for (let y2 = 0; y2 < 9; y2++)
    forbiddenValues[sudoku[xyToIndex(x, y2)]] = 1;
  // Do not use values already present in this column
  for (let x2 = 0; x2 < 9; x2++)
    forbiddenValues[sudoku[xyToIndex(x2, y)]] = 1;
  // Do not use values already present in this sub-square
  for (let x2 = x - x % 3; x2 < x - x % 3 + 3; x2++)
    for (let y2 = y - y % 3; y2 < y - y % 3 + 3; y2++)
      forbiddenValues[sudoku[xyToIndex(x2, y2)]] = 1;

  for (let value = 1; value <= 9; value++) {
    // If value is known to be forbidden, don't try it.
    if (forbiddenValues[value]) continue;
    sudoku[unknownIndex] = value;
    if (solveSudoku(sudoku)) return sudoku;
  }
  sudoku[unknownIndex] = 0;  // Reset to original state.
  return null;  // There is no solution.
}

exports.solveSudoku = solveSudoku;
