export function solve(board, size, charMap, invertedCharMap) {
    var count = 0;
    var solved = true;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] === "") {
                count++;
                solved = false;

                // Try each possible valid character for this cell, recurse, and undo the change
                var isValidChar = getValidChars(i, j, board, size, charMap);
                var validCount = 0;
                for (let k = 0; k < isValidChar.length; k++) {
                    if (isValidChar[k]) {
                        board[i][j] = invertedCharMap[k];
                        var result = solve(board, size, charMap, invertedCharMap);

                        // If this change resulted in a solution for the entire board, stop recursing
                        if (result === true) {
                            return result;
                        }
                        board[i][j] = "";
                        validCount++;
                    }
                }
                
                // If there are no valid solutions for this cell, backtrack
                if (validCount === 0) {
                    return false;
                }
            }
        }
    }
    return solved;
}

function getValidChars(row, col, board, size, charMap) {
    var isValid = [];
    for (let i = 0; i < size; i++) {
        isValid.push(true);
    }

    // All used numbers in this row and this column are invalid
    for (let i = 0; i < size; i++) {
        if (board[row][i] !== "") {
            isValid[charMap[board[row][i]] - 1] = false;
        }
        if (board[i][col] !== "") {
            isValid[charMap[board[i][col]] - 1] = false;
        }
    }

    // All used numbers in this sub-grid are invalid
    var subSize = Math.floor(Math.sqrt(size));
    var rowStart = Math.floor(row / subSize) * subSize;
    var colStart = Math.floor(col / subSize) * subSize;
    for (let i = rowStart; i < rowStart + subSize; i++) {
        for (let j = colStart; j < colStart + subSize; j++) {
            if (board[i][j] !== "") {
                isValid[charMap[board[i][j]] - 1] = false;
            }
        }
    }

    return isValid;
}