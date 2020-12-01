import './App.css';
import React, {useState} from "react";
import Worker from "./solver.worker.js";

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

    const charMap = {"": 0};
    for (let i = 1; i <= size; i++) {
        if (i < 10) {
            charMap[i] = i;
        } else {
            // subtract 10 is necessary because 10=>A, 11=>B, etc.
            charMap[String.fromCharCode("A".charCodeAt(0) - 10 + i)] = i;
        }
    }

    /**
     * Solve the current board asynchronously, and populate the board with the solution when done.
     */
    function calculate() {
        worker.onmessage = function (event) {
            setCalculating(false);
            if (event.data !== null) {
                setBoard(event.data);
            } else {
                alert("This board is unsolvable!");
            }
        }

        const copy = copyBoard(board);
        worker.postMessage({board: copy, charMap: charMap});
        setCalculating(true);
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

    return (
        <div id="content">
            <div id="controls">
                <select value={size} onChange={sizeChange}>
                    {options.map(size => <option key={size} value={size}>{size}x{size}</option>)}
                </select>
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
                <button onClick={calculate} disabled={calculating ? calculating : undefined}>Solve!</button>
                <button onClick={clear} disabled={calculating ? calculating : undefined}>Clear board</button>
            </div>
            {calculating ? <div id="loading">Loading...</div> : null}
        </div>
    );
}

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>
                    SudoSolve®
                </h1>
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
