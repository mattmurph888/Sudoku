# Sudoku
### SUMMARY
This project is a web-based Sudoku game that generates random, valid, and well-formatted puzzles for the user to play. The puzzles are generated using a combination of HTML, CSS, and JavaScript.

### PUZZLE GENERATION
The program generates a complete Sudoku puzzle by iterating through each box in the puzzle and randomly placing a number from 1 to 9. If the board is still solvable with the placed number, the program continues to the next box. If the board is not solvable, the program chooses another number until the board is solvable. The program uses a backtracking algorithm to check the current board state for a possible solution to ensure that the puzzle is solvable.

Once the program has generated a complete puzzle with all 81 boxes filled in validly, it creates an incomplete puzzle by randomly choosing boxes to become empty. The program uses the previously stated backtracking algorithm to check the current board state to ensure that the puzzle is still well-formatted (i.e., it has only one unique solution). This time, it specifies that there is only one solution. If the puzzle is still well-formatted after removing the box's value, the program continues. If not, it randomly chooses another box to empty. The program continues this process until it has reached the desired number of missing boxes.

### HOW TO PLAY
To play the game,  open the index.html file in a web browser and select the difficulty level of the puzzle you want to play. The puzzle will be generated and displayed on the screen. Next, use the mouse to select a number from the number pad at the bottom of the screen, then click on an empty box you want to fill in with that number. If the box is filled in correctly, the number will be displayed in green. Otherwise, the number will be red, and the error counter will be incremented by one. 
