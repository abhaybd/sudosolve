async function solve(board, size, charMap, callback) {
    await callback(board);

    let candidates = [];
    // init to true. If we don't find any empty squares, the board is already solved.
    let solved = true;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] === "") {
                solved = false; // We found an empty square, so this board is not solved yet
                // save the candidates for this square
                candidates.push([i, j, getCandidates(board, size, charMap, i, j)]);
            }
        }
    }

    // if we have at least one empty square, we still have solving to do
    if (candidates.length !== 0) {
        // Find the square with the least number of candidates
        let toSearch = candidates[0];
        for (let c of candidates) {
            if (c[2].size < toSearch[2].size) {
                toSearch = c;
            }
        }

        let row = toSearch[0];
        let col = toSearch[1];
        let options = toSearch[2];
        // If this square has no candidates, this board is invalid, so return false immediately
        if (options.size === 0) {
            return false;
        }
        // Iterate through all possible options for this square, recursing to find the solution
        for (let ch of options) {
            // set the square to the current value
            board[row][col] = ch;
            // Recursively solve the board
            let result = await solve(board, size, charMap, callback);
            if (result === true) {
                // We've found a solution, so don't continue searching.
                return true;
            } else {
                // unset the square and continue searching
                board[row][col] = "";
            }
        }
        // None of the options yielded a solution, so return false
        return false;
    }

    return solved;
}

/**
 * Get the candidates for a particular square in a sudoko board.
 *
 * @param board The sudoku board object. A square 2d array of size `size`.
 * @param size The size of the sudoku board.
 * @param charMap A JS object where the keys are valid sudoku characters
 * (including the empty string) and the values are the "index" of those characters, used for
 * relative ordering. The value for "" is 0.
 * @param row The row of the square for which to find the candidates.
 * @param col The column of the square for which to find the candidates.
 * @returns {Set<any>} A set of all possible candidates.
 * This set will be a subset of the keyset of `charMap`.
 */
function getCandidates(board, size, charMap, row, col) {
    // if the square is already filled, there are no possible candidates
    if (board[row][col] !== "") {
        return new Set();
    }

    // Initialize the candidates set with all possible options
    const candidates = new Set();
    Object.keys(charMap).forEach(ch => candidates.add(ch));
    candidates.delete(""); // the empty string is not an option, so remove it

    // Search through all squares in the same row and column as this square, and delete all
    // characters that appear this prevents duplicate values in the same row and column
    for (let i = 0; i < size; i++) {
        candidates.delete(board[row][i]);
        candidates.delete(board[i][col]);
    }

    // search through this square's subgrid and delete all characters that appear
    // this prevents duplicate values in the same subgrid
    let subGridSize = Math.round(Math.sqrt(size));
    // row and col of the upper left corner of the subgrid
    let rowStart = subGridSize * Math.floor(row / subGridSize);
    let colStart = subGridSize * Math.floor(col / subGridSize);
    for (let r = rowStart; r < rowStart + subGridSize; r++) {
        for (let c = colStart; c < colStart + subGridSize; c++) {
            candidates.delete(board[r][c]);
        }
    }

    return candidates;
}
