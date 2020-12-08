// eslint-disable-next-line no-undef
importScripts("/solve3.js");

// register message subscriber for web worker
// This allows the solver algorithm to run in a separate thread, so it won't freeze the UI thread
onmessage = function (e) {
    const {board, charMap, visualize, delay} = e.data;

    // this is the callback function used to send updates for visualization to the UI
    async function callback(board) {
        if (visualize === true) {
            postMessage({type: "update", board: board})
            await new Promise(r => setTimeout(r, delay === undefined ? 20 : delay));
        }
    }

    // eslint-disable-next-line no-undef
    solve(board, board.length, charMap, callback).then(success => {
        let response = {type: "solution", board: null};
        if (success) {
            response.board = board;
            console.log("Solved!");
        } else {
            console.log("Not solved!");
        }

        postMessage(response);
    });
}
