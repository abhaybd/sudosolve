function solve(board, size, charMap) {
    let candidates = [];
    let solved = true;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] === "") {
                solved = false;
                candidates.push([i, j, getCandidates(board, size, charMap, i, j)]);
            }
        }
    }

    if (candidates.length !== 0) {
        let toSearch = candidates[0];
        for (let c of candidates) {
            if (c[2].size < toSearch[2].size) {
                toSearch = c;
            }
        }

        let row = toSearch[0];
        let col = toSearch[1];
        let options = toSearch[2];
        if (options.size === 0) {
            return false;
        }
        for (let ch of options) {
            board[row][col] = ch;
            let result = solve(board, size, charMap);
            if (result === true) {
                return true;
            } else {
                board[row][col] = "";
            }
        }
        return false;
    }

    return solved;
}

function getCandidates(board, size, charMap, row, col) {
    if (board[row][col] !== "") {
        return new Set();
    }

    const candidates = new Set();
    Object.keys(charMap).forEach(ch => candidates.add(ch));
    candidates.delete("");

    for (let i = 0; i < size; i++) {
        candidates.delete(board[row][i]);
        candidates.delete(board[i][col]);
    }

    let subGridSize = Math.round(Math.sqrt(size));
    let rowStart = subGridSize * Math.floor(row / subGridSize);
    let colStart = subGridSize * Math.floor(col / subGridSize);
    for (let r = rowStart; r < rowStart + subGridSize; r++) {
        for (let c = colStart; c < colStart + subGridSize; c++) {
            candidates.delete(board[r][c]);
        }
    }

    return candidates;
}
