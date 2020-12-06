# Technical Design

## Sudoku Solving Algorithm
All of our approaches are recursive backtracking algorithms.

### Initial Algorithm
1. Find an arbitrary unsolved square. 
2. Find said square's possible values, given the values already in the same column, same row, and same "sub-grid". If there are no possible values for this square, we backtrack.
3. For each of the possible values, fill the square with that value and recurse (repeat steps 1-3 until no unsolved squares are found). If none of the possible values with which we can fill this square result in a solution for the entire board, we backtrack.

### Modified Algorithm
#### Main Improvements
Let's precompute the sets of possible values for each unsolved square prior to
the recursion. As we solve squares, let's update the sets of possible values
for the affected squares.

#### Full Algorithm
1. Compute sets of all possible values for each of the board's unsolved
   squares. 
2. Find an arbitrary unsolved square.
3. For each value in the precomputed set of possible values for said square,
   fill the square with that value and update the sets of possible values for each of the affected squares (all squares in the same column, same row, and same sub-grid as the original square).
   square. Then, recurse. 
4. If the set of possible values for an unsolved square is empty, we backtrack
   because at least one of the squares we filled previously is incorrect. If none of the possible values with which we can fill this square result in a solution for the entire board, we backtrack.

### Final Algorithm
#### Main Improvements
Instead of solving the squares in an arbitrary order, let's find the square
with the least candidate values, solve it, and repeat until entire board is
solved. 

#### Full Algorithm
1. Find candidate values for each of the board's unsolved squares.
2. Determine the square with least candidate values. For each of the candidate
   values, fill said square with that value and recurse.
3. Repeat steps 1 and 2 until board is solved.

## User Interface
