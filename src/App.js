import './App.css';
import React, {useState} from "react";

const minSize = 2;
const maxSize = 5;

const options = [];
for (let i = minSize; i <= maxSize; i++) {
    options.push(i*i);
}

function Content() {
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

    const [size, setSize] = useState(9);
    const [board, setBoard] = useState(createNewBoard(size));

    const charMap = {"":0};
    for (let i = 1; i <= size; i++) {
        if (i < 10) {
            charMap[i] = i;
        } else {
            charMap[String.fromCharCode(55 + i)] = i;
        }
    }

    function calculate() {
        // TODO: Solve the sudoku board
    }

    function sizeChange(event) {
        setSize(event.target.value);
        setBoard(createNewBoard(event.target.value));
    }

    function cellChanged(row, col, value) {
        value = value.toString().toUpperCase();
        if (value in charMap) {
            let index = charMap[value];
            if (value === "" || (index > 0 && index <= size)) {
                board[row][col] = value.toString();
                const newBoard = [];
                for (let row of board) {
                    const newRow = [];
                    for (let cell of row) {
                        newRow.push(cell);
                    }
                    newBoard.push(newRow);
                }
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
                <button onClick={calculate}>Solve!</button>
            </div>
            <div id="board">
                {board.map((row, i) => <React.Fragment key={i}>{row.map((col, j) => <input type="text" key={i.toString() + j.toString()} onChange={e => cellChanged(i, j, e.target.value)} value={board[i][j]}/>)}<br /></React.Fragment>)}
            </div>
        </div>
    );
}

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>
                    SudoSolve
                </h1>
                <Content/>
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
