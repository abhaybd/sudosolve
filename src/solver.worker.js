// eslint-disable-next-line no-undef
importScripts("/solve.js");

onmessage = function (e) {
    const {board, charMap} = e.data;
    console.log(charMap);
    // eslint-disable-next-line no-undef
    if (solve(board, board.length, charMap, Object.keys(charMap))) {
        postMessage(board);
        console.log("Solved!");
    } else {
        console.log("Not solved!");
        postMessage(null);
    }
}
