/**
 * If a solution exists, finds it and populates board with the solution. 
 * 
 * @param board the contents of each of the board's cells
 * @param size height or width of the board
 * @param charMap the map from character to integer representation
 * @param callback the callback function
 * @return {@code true} if a solution exists
 */
async function solve(board, size, charMap, callback) {
    await callback(board);
    
    let count = 0;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] === "") {
                count++;

                // Try each possible valid character for this cell, recurse, and undo the change
                for (let k = 0; k < size; k++) {
                    if (!inColumn(k + 1, j, board, charMap) &&
                        !inRow(k + 1, i, board, charMap) &&
                        !inSubgrid(k + 1, i, j, board, charMap)) {
                        
                        board[i][j] = Object.keys(charMap)[k];
                        
                        // If this change resulted in a solution for the entire board, stop recursing
                        if (await solve(board, size, charMap, callback)) {
                            return true;
                        }
                        
                        board[i][j] = "";
                    }
                }
                
                // If there are no paths to a solution for the board, backtrack
                return false;
            }
        }
    }
    return true;
}

/**
 * Returns whether or not the given char is in the given column of the board.
 *
 * @param char the character to search for
 * @param col the index of the column to search in
 * @param board the contents of each of the board's cells
 * @param charMap a map from character to integer representations
 * @return {@code true} if char is found in the given column of the board
 */
function inColumn(char, col, board, charMap) {
    for (let i = 0; i < board.length; i++) {
        if (charMap[board[i][col]] === char) {
            return true;
        }
    }
    return false;
}

/**
 * Returns whether or not the given char is in the given row of the board.
 *
 * @param char the character to search for
 * @param row the index of the row to search in
 * @param board the contents of each of the board's cells
 * @param charMap a map from character to integer representations
 * @return {@code true} if char is found in the given row of the board
 */
function inRow(char, row, board, charMap) {
    for (let i = 0; i < board[row].length; i++) {
        if (charMap[board[row][i]] === char) {
            return true;
        }
    }
    return false;
}

/**
 * Returns whether or not the given char is in the "sub-grid" of the board that
 * contains both the given row and column.
 *
 * @param char the character to search for
 * @param row the index of any of the rows of the sub-grid to search in
 * @param col the index of any of the columns of the sub-grid to search in
 * @param board the contents of each of the board's cells
 * @param charMap a map from character to integer representations
 * @return {@code true} if char is found in the sub-grid containing both the
 *         given row and given column
 */
function inSubgrid(char, row, col, board, charMap) {
    let subSize = Math.floor(Math.sqrt(board.length));
    let rowStart = Math.floor(row / subSize) * subSize;
    let colStart = Math.floor(col / subSize) * subSize;
    for (let i = rowStart; i < rowStart + subSize; i++) {
        for (let j = colStart; j < colStart + subSize; j++) {
            if (charMap[board[i][j]] === char) {
                return true;
            }
        }
    }
    return false;
}
