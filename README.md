# SudoSolve®

Welcome to SudoSolve®! In this guide you'll find instructions on how to compile and run this project.

Since Ed workspaces don't have enough space to house React.js dependencies, we've included the output of `npm run build` in the `build` folder.

## How to create a build

If you are running this outside of the Ed workspace or want to create a new build, simply run `npm run build` while in the project root. This will create a new build in the `build` subfolder.

## How to run the app

### Run from source

If you'd like to run the project from source (you will not be able to do this on Ed) you can simply run `npm run start`. Then, you can access the running webapp at `localhost:3000`.

### Run a previously created build

However, most likely you'd like to run this app from the Ed workspace. In this case, you need to serve the files from the build folder. For convenience, we've included a `run.sh` script in the project root which automates this process. Therefore, all you need to do is navigate to the project root with `cd ~/sudosolve` and then run the command `./run.sh`. This will serve the webapp at `127.0.0.1:8000`. You can access it by clicking the Network icon, and then clicking the entry that shows `HOST: 127.0.0.1:8000`.

## How to use the app

Select a board size using the dropdown. The available sizes are `4x4`, `9x9`, `16x16`, and `25x25`.

If you'd like, you can optionally visualize the algorithm's process in solving the puzzle. This will significantly slow the code down. If you want to visualize it, check the `Visualize Algorithm` checkbox.

### Manually fill in a puzzle

If you want to manually fill in a puzzle, you can do so by typing into the board. You will not be able to type invalid characters into the sudoku board.

These are the valid characters for each board size:

| Board Size | Valid Input  |
| ---------- | ------------ |
| `4x4`      | `1-4`        |
| `9x9`      | `1-9`        |
| `16x16`    | `1-9`, `A-G` |
| `25x25`    | `1-9`, `A-P` |

### Generate random board

If you don't want to manually enter an entire puzzle, you can click `Generate random board` to create a new random board. This board is guaranteed to be solvable.

### Solve

To solve the sudoku board, just click `Solve!` All UI input will be disabled while the algorithm is running, so just sit back and let it think!
