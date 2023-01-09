const puzzle = document.getElementById('puzzle-container');
let guess = 0;

let completeBoard = generateCompleteSudoku();
let finalBoard = generateWellFormedSudoku(completeBoard, 10); // 55 is realistic max
let errors = 0;
const EMPTY_BOARD = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
];

function isValidSudoku(input_state, target_solutions) {
	/**
	 * array of sets that track seen numbers in rows, cols, and sections
	 * input_state([int][int]): array of arrays representing the current sudoku board state
	 * target_solutions(int): number prepresenting the max number of solutions allowed
	 * ^ need unique solutions to be well formatted
	 */
	let state = structuredClone(input_state);
	let seen_rows = [];
	let seen_cols = [];
	let seen_sections = [];
	for (let i = 0; i < 9; i++) {
		seen_rows.push(new Set());
		seen_cols.push(new Set());
		seen_sections.push(new Set());
	}

	// update the seen sets for the given state
	for (let row = 0; row < state.length; row++) {
		for (let col = 0; col < state[0].length; col++) {
			if (state[row][col] != 0) {
				let num = state[row][col];
				let section = Math.floor(row / 3) * 3 + Math.floor(col / 3);
				// returns false if the current state is not valid
				if (
					seen_rows[row].has(num) ||
					seen_cols[col].has(num) ||
					seen_sections[section].has(num)
				) {
					return false;
				}
				seen_rows[row].add(num);
				seen_cols[col].add(num);
				seen_sections[section].add(num);
			}
		}
	}

	// use backtracking to recursively check if the state is solveable
	// let solved = false;
	let solutions = 0;
	function backTrack(row, col) {
		// if row is 9 then we are at the end and the state is solveable
		if (row == 9) {
			solutions++;
			return;
		}

		// math that gets the next row,col
		let new_row = row + Math.floor((col + 1) / 9);
		let new_col = (col + 1) % 9;

		// if the row,col is filled move on, otherwise guesses recursively and backtrack
		if (state[row][col] != 0) {
			backTrack(new_row, new_col);
		} else {
			for (let num = 1; num < 10; num++) {
				let section = Math.floor(row / 3) * 3 + Math.floor(col / 3);
				if (
					!seen_rows[row].has(num) &&
					!seen_cols[col].has(num) &&
					!seen_sections[section].has(num)
				) {
					seen_rows[row].add(num);
					seen_cols[col].add(num);
					seen_sections[section].add(num);
					state[row][col] = num;

					backTrack(new_row, new_col);

					if (solutions < target_solutions) {
						seen_rows[row].delete(num);
						seen_cols[col].delete(num);
						seen_sections[section].delete(num);
						state[row][col] = 0;
					}
				}
			}
		}
	}

	backTrack(0, 0);
	return solutions;
}

function generateCompleteSudoku() {
	/**
	 * generate a valid filled out sudoku board
	 */
	let board = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
	];
	let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	for (let row = 0; row < board.length; row++) {
		for (let col = 0; col < board[0].length; col++) {
			numbers = shuffle(numbers);
			for (let i = 0; i < numbers.length; i++) {
				board[row][col] = numbers[i];
				if (isValidSudoku(board, 1) != 0) {
					break;
				}
			}
		}
	}
	return board;
}

function generateIncompleteSudoku(input_board, num_missing) {
	/**
	 * generates a board with empty spaces filled in as 0s
	 * output boards are valid but not guarenteed to be well formatted
	 */
	let board = structuredClone(input_board);
	elements = board.length * board[0].length;
	for (let i = 0; i < elements; i++) {
		if (Math.random() <= num_missing / (elements - i)) {
			let row = Math.floor(i / board[0].length);
			let col = i % board[0].length;
			board[row][col] = 0;
			num_missing--;
		}
	}
	return board;
}

function generateWellFormedSudoku(input_board, num_missing) {
	/**
	 * keep generating valid boards until you get one that is well formatted
	 * well formatted means there is 1 unique solution
	 */
	let board = generateIncompleteSudoku(input_board, num_missing);
	let num_remakes = 0;
	while (isValidSudoku(board, 2) != 1) {
		num_remakes++;
		board = generateIncompleteSudoku(input_board, num_missing);
	}
	return board;
}

function shuffle(input_array) {
	/**
	 * randomly shuffle the input array with the Fisher-Yates algorithm
	 */
	let array = structuredClone(input_array);
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

function printBoard(g) {
	/**
	 * display the grid in the console
	 */
	let output = '';
	for (let i = 0; i < g.length; i++) {
		for (let j = 0; j < g[0].length; j++) {
			output += g[i][j].toString() + ' ';
		}
		output += '\n';
	}
}

function generateBoardElements(board) {
	/**
	 * create the row and box elements on the page
	 */
	for (let i = 0; i < board.length; i++) {
		let row = document.createElement('div');
		for (let j = 0; j < board[0].length; j++) {
			let box = document.createElement('div');
			box.id = `box${i}${j}`;
			box.setAttribute('onclick', `checkGuess(${i}, ${j})`);
			row.appendChild(box).className = `box box-row${i} box-col${j}`;
			let number = board[i][j];
			if (number == 0) {
				box.innerHTML = '';
			} else {
				box.innerHTML = board[i][j];
			}
		}
		puzzle.appendChild(row).className = `row row${i}`;
	}
}

function generateGuessButtons() {
	/**
	 * creates the guess selection buttons
	 */
	const button_container = document.getElementById('button-container');
	for (let i = 1; i < 10; i++) {
		let number_button = document.createElement('div');
		number_button.className = 'number-button';
		number_button.id = `number-button${i}`;
		number_button.setAttribute('onclick', `setGuess(${i})`);
		number_button.innerHTML = `${i}`;
		button_container.appendChild(number_button);
	}
	let clear_button = document.createElement('div');
	clear_button.className = 'number-button';
	clear_button.id = `number-button${0}`;
	clear_button.setAttribute('onclick', `setGuess(${0})`);
	clear_button.innerHTML = 'erase';
	button_container.appendChild(clear_button);
	let empty_space = document.createElement('div');
	empty_space.className = 'number-button';
	empty_space.id = 'empty-space';
	button_container.appendChild(empty_space);
	let error_container = document.createElement('div');
	error_container.id = 'error-container';
	error_container.className = 'number-button';
	error_container.innerHTML = `Errors: ${errors}`;
	button_container.appendChild(error_container);
}

function setGuess(num) {
	/**
	 * updates what number you are currently guessing
	 * triggers when a guess button is clicked
	 */
	let button = document.getElementById(`number-button${guess}`);
	button.style.backgroundColor = 'white';
	button = document.getElementById(`number-button${num}`);
	button.style.backgroundColor = 'rgb(137, 140, 140)';
	guess = num;
}

function checkGuess(row, col) {
	/**
	 * handles all guesses on the board
	 */
	let box = document.getElementById(`box${row}${col}`);
	if (finalBoard[row][col] == 0 && box.style.color != 'green') {
		box.style.fontWeight = 'bold';
		box.style.fontSize = '1.5em';
		if (guess == 0) {
			box.innerHTML = ' ';
		} else if (guess == completeBoard[row][col]) {
			box.style.color = 'green';
			box.innerHTML = guess;
		} else if (box.innerHTML != guess) {
			box.style.color = 'red';
			box.innerHTML = guess;
			errors++;
			updateErrors();
		}
	}
}

function setPuzzle(num_missing) {
	/**
	 * sets a new board when a level button is clicked
	 */
	completeBoard = generateCompleteSudoku();
	finalBoard = generateWellFormedSudoku(completeBoard, num_missing);
	setNewPuzzle(finalBoard);
}

function setNewPuzzle(board) {
	/**
	 * updates the display to show the new board
	 */
	for (let row = 0; row < board.length; row++) {
		for (let col = 0; col < board[0].length; col++) {
			let box = document.getElementById(`box${row}${col}`);
			box.style.color = 'black';
			box.style.fontWeight = 'normal';
			box.style.fontSize = '1em';
			if (board[row][col] == 0) {
				box.innerHTML = ' ';
			} else {
				box.innerHTML = board[row][col];
			}
		}
	}
	setGuess(0);
	errors = 0;
	updateErrors();
}

function updateErrors() {
	/**
	 * updates the error display
	 */
	let error_container = document.getElementById('error-container');
	error_container.innerHTML = `Errors: ${errors}`;
}

printBoard(completeBoard);
printBoard(finalBoard);
generateBoardElements(EMPTY_BOARD);
generateGuessButtons();
setGuess(0);
