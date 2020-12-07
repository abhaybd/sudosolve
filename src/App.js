import './App.css';
import React, {useState} from "react";
import Worker from "./solver.worker.js";
import closeSvg from "./x-square-fill.svg";

// This is the web worker for solving the board
const worker = Worker();

// these are the min and max square roots of the min and max sizes
const minSize = 2;
const maxSize = 5;

// populate the options list
const options = [];
for (let i = minSize; i <= maxSize; i++) {
    options.push(i * i);
}

/**
 * Represents an individual cell in the sudoku board.
 *
 * @param props The options for this element. row is the row. col is the column. value is the string content of the cell.
 * size is the size of the board. cellChanged is a callback function that accepts (row, col, value).
 * disabled may optionally be defined. If it's defined, this cell will be disabled.
 * @returns {JSX.Element} The element for display.
 * @constructor
 */
function Cell(props) {
    let row = props.row;
    let col = props.col;
    let value = props.value;

    let classes = [];
    const sqrSize = Math.sqrt(props.size);
    // if the cell is on the horizontal border between sub-grids, mark it as such
    if (row !== 0 && row % sqrSize === 0) {
        classes.push("border-row");
    }
    // if the cell is on the vertical border between sub-grids, mark it as such
    if (col !== 0 && col % sqrSize === 0) {
        classes.push("border-col");
    }

    // If this cell has some content in it, mark it as filled
    if (value && value !== "") {
        classes.push("filled");
    }

    const className = classes.join(" ");

    return <input type="text"
                  className={className}
                  key={row.toString() + "," + col.toString()}
                  onChange={e => props.cellChanged(row, col, e.target.value)}
                  value={value}
                  disabled={props.disabled}/>;
}

/**
 * Create a deep copy of this sudoku board.
 *
 * @param board The board to copy.
 * @returns {[]} A deep copy of the supplied board.
 */
function copyBoard(board) {
    const newBoard = [];
    for (let row of board) {
        const newRow = [];
        for (let cell of row) {
            newRow.push(cell);
        }
        newBoard.push(newRow);
    }
    return newBoard;
}

/**
 * Creates the content element for the webpage.
 *
 * @returns {JSX.Element} The element for display.
 * @constructor
 */
function Content() {
    /**
     * Create a new empty board of the specified size.
     *
     * @param size The size of the new board.
     * @returns {[]} The newly created board.
     */
    function createNewBoard(size) {
        const board = [];
        for (let i = 0; i < size; i++) {
            const row = [];
            for (let j = 0; j < size; j++) {
                row.push("");
            }
            board.push(row);
        }
        return board;
    }

    // create the initial states of the component.
    const [size, setSize] = useState(9);
    const [board, setBoard] = useState(createNewBoard(size));
    const [calculating, setCalculating] = useState(false);
    const [visualize, setVisualize] = useState(false);

    const charMap = {"": 0};
    for (let i = 1; i <= size; i++) {
        if (i < 10) {
            charMap[i] = i;
        } else {
            // subtract 10 is necessary because 10=>A, 11=>B, etc.
            charMap[String.fromCharCode("A".charCodeAt(0) - 10 + i)] = i;
        }
    }

    function solveBoard(board, callback, disableInput = true, visualize = false) {
        worker.onmessage = function (event) {
            if (event.data.type === "solution" && disableInput === true) {
                setCalculating(false);
            }
            callback(event.data);
        }

        if (disableInput) {
            setCalculating(true);
        }
        const copy = copyBoard(board);
        worker.postMessage({board: copy, charMap: charMap, visualize: visualize});
    }

    /**
     * Creates a random board that is guaranteed to be solvable. Automatically renders the board after creation.
     * Runs asynchronously.
     */
    function createRandomBoard() {
        let board = createNewBoard(size);
        let acceptableVals = [...Object.keys(charMap)].filter(c => c !== '');
        for (let i = 0; i < size; i++) {
            let a = getRandomInt(acceptableVals.length);
            board[0][i] = acceptableVals[a];
            acceptableVals.splice(a, 1);
        }

        solveBoard(board, function (response) {
            if (response.type === "solution" && response.board !== null) {
                let copy = response.board;
                for (let i = 0; i < size; i++) {
                    for (let j = 0; j < size; j++) {
                        if (getRandomInt(10) <= 7) {
                            copy[i][j] = "";
                        }
                    }
                }
                setBoard(copy);
            }
        });
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    /**
     * Solve the current board asynchronously, and populate the board with the solution when done.
     */
    function calculate() {
        solveBoard(board, function (response) {
            if (response.type === "solution") {
                if (response.board) {
                    setBoard(response.board);
                } else {
                    alert("This board is unsolvable!");
                }
            } else if (response.type === "update") {
                setBoard(response.board);
            }
        }, true, visualize);
    }

    /**
     * Clear all cells in this board.
     */
    function clear() {
        setBoard(createNewBoard(size));
    }

    /**
     * Call when the size of the board has changed. This will resize the displayed board.
     *
     * @param event The click event of the dropdown
     */
    function sizeChange(event) {
        setSize(event.target.value);
        setBoard(createNewBoard(event.target.value));
    }

    /**
     * Call when the contents of a cell has changed. The contents of the cell may not be the same as value,
     * depending on the formatting rules.
     *
     * @param row The row of the cell.
     * @param col The column of the cell.
     * @param value The new value to be put into the cell.
     */
    function cellChanged(row, col, value) {
        value = value.toString().toUpperCase();
        if (value in charMap) {
            let index = charMap[value];
            if (value === "" || (index > 0 && index <= size)) {
                const newBoard = copyBoard(board);
                newBoard[row][col] = value.toString();
                setBoard(newBoard);
            }
        }
    }

    const disabled = calculating === true ? true : undefined;

    return (
        <div id="content">
            <div id="controls">
                <div>
                    <select value={size} onChange={sizeChange} disabled={disabled}>
                        {options.map(size => <option key={size} value={size}>{size}x{size}</option>)}
                    </select>
                </div>
                <div>
                    Visualize Algorithm:
                    <input type="checkbox" onChange={e => setVisualize(e.target.checked)} checked={visualize}
                           disabled={disabled}/>
                </div>
            </div>
            <div id="board">
                {board.map((row, i) => <div className="row" key={i}>{row.map((val, j) => <Cell key={i * size + j}
                                                                                               row={i}
                                                                                               col={j} value={val}
                                                                                               size={size}
                                                                                               cellChanged={cellChanged}
                                                                                               disabled={calculating}/>)}</div>)}
            </div>
            <div id="buttons">
                <button onClick={calculate} disabled={disabled}>Solve!</button>
                <button onClick={createRandomBoard} disabled={disabled}>Generate random board</button>
                <button onClick={clear} disabled={disabled}>Clear board</button>
            </div>
            {calculating ? <div id="loading">Loading...</div> : null}
        </div>
    );
}

function App() {
    const [showInstructions, setShowInstructions] = useState(false);

    let instructionsPanel = null;
    // show the instructions modal if we're supposed to
    if (showInstructions === true) {
        instructionsPanel = (
            <div id="instructions-panel" className="panel fade-in">
                <div id="instructions">
                    <img src={closeSvg} id="close-button" onClick={() => setShowInstructions(false)}/>
                    <h2>
                        Instructions
                    </h2>
                    <ol>
                        <li>
                            Input your sudoku board 1-9 and A-P representing 10-25 (A: 10, B: 11, C: 12 . . . P: 25)
                        </li>
                        <li>
                            You can optionally click the visualize algorithm button which will show you the board as it
                            is being solved
                            <p className="note">
                                Note: this will significantly slow down the rate at which the board is solved
                            </p>
                        </li>
                        <li>Click solve and the program will present a finished board</li>
                        <li>Clear the Board and start again</li>
                        <p>If you don't want to type in your own puzzle, clicking the "Generate random board" button
                            will present you with a puzzle that is guaranteed to be solvable</p>
                    </ol>
                </div>
            </div>
        );
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>
                    SudoSolve®
                </h1>
                <button id="instructions-button" onClick={() => setShowInstructions(!showInstructions)}>
                    {showInstructions === true ? "Hide instructions" : "Show instructions"}
                </button>
                {instructionsPanel}
                <div className="panel">
                    <Content/>
                </div>
            </header>
            <div id="footer">
                Made by <a href="https://www.github.com/abhaybd">Abhay Deshpande</a>
                , <a href="https://github.com/abx393">Abhinav Bandari</a>
                , and <a href="https://github.com/Karkeys360">Karthikeya Vemuri</a>
            </div>
        </div>
    );
}

export default App;
