# Sudoku Solving Algorithm
All of our approaches are recursive backtracking algorithms.

## Initial Algorithm
1. Find an arbitrary unsolved square. 
2. Find said square's possible values, given the values already in the same column, same row, and same "sub-grid". If there are no possible values for this square, we backtrack.
3. For each of the possible values, fill the square with that value and recurse (repeat steps 1-3 until no unsolved squares are found). If none of the possible values with which we can fill this square result in a solution for the entire board, we backtrack.

## Modified Algorithm
### Main Improvements
Let's precompute the sets of possible values for each unsolved square prior to
the recursion. As we solve squares, let's update the sets of possible values
for the affected squares.

### Full Algorithm
1. Compute sets of all possible values for each of the board's unsolved
   squares. 
2. Find an arbitrary unsolved square.
3. For each value in the precomputed set of possible values for said square,
   fill the square with that value and update the sets of possible values for each of the affected squares (all squares in the same column, same row, and same sub-grid as the original square).
   square. Then, recurse. 
4. If the set of possible values for an unsolved square is empty, we backtrack
   because at least one of the squares we filled previously is incorrect. If none of the possible values with which we can fill this square result in a solution for the entire board, we backtrack.

## Final Algorithm
### Main Improvements
Instead of solving the squares in an arbitrary order, let's find the square
with the least candidate values, solve it, and repeat until entire board is
solved. 

### Full Algorithm
1. Find candidate values for each of the board's unsolved squares.
2. If any unfilled square has zero candidates, backtrack.
3. Determine the square with least number of candidates.
4. For each of the candidate values, fill said square with that value.
5. If the board is now solved, return.
6. Otherwise, recurse and repeat steps 1-5 until board is either solved or determined to be completely unsolvable.

# User Interface

The frontend was built using React.js, and communicates with the solver algorithms (which run on a separate web worker) via messages.

<img src="/ui-screenshot.PNG" height="300px"/>

## Controls

### Size

SudoSolve® supports solving sudoku boards of size `4x4`, `9x9`, `16x16`, or `25x25`. Solving larger boards will require more time, especially for more challenging puzzles with less hints, but the UI remains responsive and lagless at all times, regardless of the computational load.

### Visualizer

You can also optionally visualize the backtracking algorithm at work. This option is by default disabled since it slows down the solver quite a bit (so it can operate at a speed that humans can see), but you can enable it before solving by enabling the check box. Once the algorithm starts solving, you will see what values it is trying to place in which squares.

### Manual Input

If you would like to solve a specific puzzle, you can directly type symbols into the sudoku board. All input is automatically validated, which means it's impossible to accidentally enter improper or illegal input, since the website will not let you type illegal symbols. Legal input is determined by the size of the board.

| Board Size | Valid Input  |
| ---------- | ------------ |
| `4x4`      | `1-4`        |
| `9x9`      | `1-9`        |
| `16x16`    | `1-9`, `A-G` |
| `25x25`    | `1-9`, `A-P` |

### Solve

When you click solve, the solving algorithm gets to work! All input is disabled while the solver is working, to prevent any user input from getting overwritten. When the solver starts, the UI thread serializes the board and dispatches it to the web worker where the solver algorithm is running. On the web worker, the solver can run without fear of blocking or lagging the UI thread.

This is better than simply using `async` functions, because `async` functions don't use true multithreading. Instead, `async` functions simulate parallel processing by frequently yielding control of the thread while the interpreter switches back and forth between multiple code paths. In contrast, a web worker actually runs on its own thread, completely separate from the UI thread. Since it never has to yield control of the thread to any other code paths, the overhead of context switching is eliminated, so the solver algorithm can run faster and more efficiently.

### Random Board Generation

If you don't want to type in an entire puzzle by hand, you can also generate a random board. SudoSolve® supports generating random boards of any size, however it will take longer to generate boards of size `25x25`. All randomly generated boards are *guaranteed* to be solvable.

### Clear Board

Instead of refreshing the page or manually clearing the entire board, you can just click `Clear board` and all cells will be automatically emptied.
