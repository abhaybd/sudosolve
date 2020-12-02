// eslint-disable-next-line no-undef
importScripts("/solve3.js");

// register message subscriber for web worker
// This allows the solver algorithm to run in a separate thread, so it won't freeze the UI thread
onmessage = function (e) {
    const {board, charMap} = e.data;
    // eslint-disable-next-line no-undef
    if (solve(board, board.length, charMap, Object.keys(charMap))) {
        postMessage(board);
        console.log("Solved!");
    } else {
        console.log("Not solved!");
        postMessage(null);
    }
}
