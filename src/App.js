import './App.css';
import React, {useState} from "react";

const minSize = 2;
const maxSize = 5;

const options = [];
for (let i = minSize; i <= maxSize; i++) {
    options.push(i * i);
}

function Cell(props) {
    let row = props.row;
    let col = props.col;
    let value = props.value;

    let classes = [];
    const sqrSize = Math.sqrt(props.size);
    if (row !== 0 && row % sqrSize === 0) {
        classes.push("border-row");
    }
    if (col !== 0 && col % sqrSize === 0) {
        classes.push("border-col");
    }

    if (value && value !== "") {
        classes.push("filled");
    }

    const className = classes.join(" ");

    return <input type="text"
                  className={className}
                  key={row.toString() + "," + col.toString()}
                  onChange={e => props.cellChanged(row, col, e.target.value)}
                  value={value}/>;
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

    const charMap = {"": 0};
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

    function clear() {
        setBoard(createNewBoard(size));
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
            </div>
            <div id="board">
                {board.map((row, i) => <div className="row" key={i}>{row.map((val, j) => <Cell key={i * size + j} row={i}
                                                                                          col={j} value={val}
                                                                                          size={size}
                                                                                          cellChanged={cellChanged}/>)}</div>)}
            </div>
            <div id="buttons">
                <button onClick={calculate}>Solve!</button>
                <button onClick={clear}>Clear board</button>
            </div>
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
