async function solve(board, size, charMap, callback) {
    // Precompute sets of possible characters in each cell
    let validChars = [];
    for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j < size; j++) {
            let set = new Set();
            if (board[i][j] === "") {
                for (let k = 1; k <= size; k++) {
                    set.add(k);
                }
                
                // Chars already used in the same row or column are invalid
                for (let k = 0; k < size; k++) {
                    set.delete(charMap[board[i][k]]);
                    set.delete(charMap[board[k][j]]);
                }
                
                // Chars already used in the same sub-grid are invalid
                let subSize = Math.floor(Math.sqrt(size));
                let rowStart = Math.floor(i / subSize) * subSize;
                let colStart = Math.floor(j / subSize) * subSize;
                for (let row = rowStart; row < rowStart + subSize; row++) {
                    for (let col = colStart; col < colStart + subSize; col++) {
                        set.delete(charMap[board[row][col]]);
                    }
                }
            }
            row.push(set);
        }
        validChars.push(row);
    }
    
    return await search(board, size, charMap, validChars, callback);
}

// Depth-first search the solution space
async function search(board, size, charMap, validChars, callback) {
    await callback(board);
    
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] === "") {
                
                // Try each possible valid character for this cell, recurse, and undo the change
                for (let char of validChars[i][j]) {
                    board[i][j] = Object.keys(charMap)[char - 1];
                    let validCharsCopy = removeValidChars(validChars, i, j, char);
                    let result = await search(board, size, charMap, validCharsCopy, callback);

                    // If this change resulted in a solution for the entire board, stop recursing
                    if (result === true) {
                        return result;
                    }
                    board[i][j] = "";
                }
                
                // If there are no paths to a solution for the board, backtrack
                return false;
            }
        }
    }
    return true;
}

// Update the sets of valid characters for all cells in the same row, column or subgrid as cell (m, n)
function removeValidChars(validChars, m, n, removeChar) {
    let copy = [];
    for (let i = 0; i < validChars.length; i++) {
        let row = [];
        for (let j = 0; j < validChars[i].length; j++) {
            let set = new Set();
            for (let char of validChars[i][j]) {
                if ((i !== m && j !== n && !sameSubgrid(i, j, m, n, validChars.length)) ||
                    char !== removeChar) {
                    set.add(char);
                }
            }
            row.push(set);
        }
        copy.push(row);
    }
    return copy;
}

// Returns whether or not cell (row1, col1) is in the sub-grid as (row2, col2)
function sameSubgrid(row1, col1, row2, col2, size) {
    let subSize = Math.floor(Math.sqrt(size));
    return Math.floor(row1 / subSize) === Math.floor(row2 / subSize) &&
           Math.floor(col1 / subSize) === Math.floor(col2 / subSize);
}