async function solve(board, size, charMap, callback) {
    await callback(board);

    const candidateBoard = getCandidatesBoard(board, size, charMap);
    let candidates = [];
    // init to true. If we don't find any empty squares, the board is already solved.
    let solved = true;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] === "") {
                solved = false; // We found an empty square, so this board is not solved yet
                // save the candidates for this square
                candidates.push([i, j, candidateBoard[i][j]]);
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

function getCandidatesBoard(board, size, charMap) {
    const defCandidates = new Set();
    Object.keys(charMap).forEach(ch => defCandidates.add(ch));
    defCandidates.delete(""); // the empty string is not an option, so remove it

    const candidateBoard = [];
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            row.push(board[i][j] === "" ? new Set(defCandidates) : new Set());
        }
        candidateBoard.push(row);
    }

    // iterate over row
    for (let row = 0; row < size; row++) {
        let set = new Set();
        for (let col = 0; col < size; col++) {
            set.add(board[row][col]);
        }
        for (let col = 0; col < size; col++) {
            if (candidateBoard[row][col].size > 0) {
                [...set].forEach(ch => candidateBoard[row][col].delete(ch));
            }
        }
    }

    // iterate over col
    for (let col = 0; col < size; col++) {
        let set = new Set();
        for (let row = 0; row < size; row++) {
            set.add(board[row][col]);
        }
        for (let row = 0; row < size; row++) {
            if (candidateBoard[row][col].size > 0) {
                [...set].forEach(ch => candidateBoard[row][col].delete(ch));
            }
        }
    }

    // iterate over subgrids
    const subGridSize = Math.round(Math.sqrt(size));
    for (let i = 0; i < size; i++) {
        const rowStart = (i % subGridSize) * subGridSize;
        const colStart = Math.floor(i / subGridSize) * subGridSize;
        let set = new Set();
        for (let row = rowStart; row < rowStart + subGridSize; row++) {
            for (let col = colStart; col < colStart + subGridSize; col++) {
                set.add(board[row][col]);
            }
        }
        for (let row = rowStart; row < rowStart + subGridSize; row++) {
            for (let col = colStart; col < colStart + subGridSize; col++) {
                if (candidateBoard[row][col].size > 0) {
                    [...set].forEach(ch => candidateBoard[row][col].delete(ch));
                }
            }
        }
    }

    return candidateBoard;
}
