export function solve(board, size, charMap) {
    //console.log("BOARD " + board);
    //console.log("3, 0 " + getValidChars(3, 0));
    var count = 0;
    var solved = true;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] === "") {
                count++;
                solved = false;

                // Try each possible valid character for this cell, recurse, and undo the change
                var isValidChar = getValidChars(i, j, board, size, charMap);
                for (let k = 0; k < isValidChar.length; k++) {
                    if (isValidChar[k]) {
                        board[i][j] = getKeyByValue(charMap, k + 1);
                        //console.log("key " + board[i][j]);
                        var result = solve(board, size, charMap);

                        // If this change resulted in a solution for the entire board, stop recursing
                        if (result === true) {
                            return result;
                        }
                        board[i][j] = "";
                    }
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
    //console.log("before " + isValid);

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

function getKeyByValue(map, value) {
    return Object.keys(map).find(key => map[key] === value);
}