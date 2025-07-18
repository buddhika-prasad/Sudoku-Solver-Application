import "./App.css";
import { useState } from "react";

// Define  difficulty levels
const easyBoard = [
  [-1, 5, -1, 9, -1, -1, -1, -1, -1],
  [8, -1, -1, -1, 4, -1, 3, -1, 7],
  [-1, -1, -1, 2, 8, -1, 1, 9, -1],
  [5, 3, 8, 6, -1, 7, 9, 4, -1],
  [-1, 2, -1, 3, -1, 1, -1, -1, -1],
  [1, -1, 9, 8, -1, 4, 6, 2, 3],
  [9, -1, 7, 4, -1, -1, -1, -1, -1],
  [-1, 4, 5, -1, -1, -1, 2, -1, 9],
  [-1, -1, -1, -1, 3, -1, -1, 7, -1],
];

const moderateBoard = [
  [-1, -1, 4, -1, -1, 6, -1, -1, 7],
  [-1, -1, -1, 5, -1, 8, 9, -1, -1],
  [8, -1, -1, -1, 4, -1, 6, -1, -1],
  [-1, 2, 5, -1, -1, -1, -1, 4, -1],
  [-1, 7, 8, 3, -1, -1, 1, -1, -1],
  [1, 6, 9, -1, 5, -1, -1, 7, -1],
  [4, -1, 3, 6, -1, 2, -1, -1, -1],
  [9, -1, 2, -1, 3, -1, 8, -1, 5],
  [-1, 5, 7, 9, -1, 1, -1, 6, -1],
];

const challengingBoard = [
  [-1, -1, 7, -1, 9, 5, -1, 1, -1],
  [-1, -1, -1, -1, -1, 4, -1, 6, 8],
  [-1, 4, 9, -1, -1, 1, -1, -1, -1],
  [-1, -1, -1, -1, 8, -1, 4, 3, -1],
  [-1, 3, -1, -1, 6, 7, 2, -1, -1],
  [2, -1, 8, 3, 5, -1, -1, -1, 6],
  [-1, 9, -1, 6, -1, -1, -1, -1, 4],
  [7, -1, -1, -1, -1, -1, 1, 9, -1],
  [-1, 1, 5, 4, 7, -1, 6, -1, -1],
];

function App() {
  // Store difficulty level
  const [sudokuArr, setSudokuArr] = useState(getDeepCopy(easyBoard));
  const [initialBoard, setInitialBoard] = useState(getDeepCopy(easyBoard));
  const [undoStack, setUndoStack] = useState([]);

  function getDeepCopy(arr) {
    return JSON.parse(JSON.stringify(arr));
  }

  function onInputChange(e, row, col) {
    var val = parseInt(e.target.value) || -1;
    let grid = getDeepCopy(sudokuArr);

    if (val === -1 || (val >= 1 && val <= 9)) {
      const previousValue = grid[row][col];
      grid[row][col] = val;
      setUndoStack([...undoStack, { row, col, value: previousValue }]);
      setSudokuArr(grid);
    }
  }

  function compareSudokus(currentSudoku, solvedSudoku) {
    let res = {
      isComplete: true,
      isSolvable: true,
    };
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        if (currentSudoku[i][j] !== solvedSudoku[i][j]) {
          if (currentSudoku[i][j] !== -1) {
            res.isSolvable = false;
          }
          res.isComplete = false;
        }
      }
    }
    return res;
  }

  function checkSudoku() {
    let sudoku = getDeepCopy(initialBoard);
    solver(sudoku);
    let compare = compareSudokus(sudokuArr, sudoku);
    if (compare.isComplete) {
      alert("Congratulations! You have solved Sudoku");
    } else if (compare.isSolvable) {
      alert("Keep going!");
    } else {
      alert("Sudoku can't be solved. Try again!");
    }
  }

  function checkRow(grid, row, num) {
    return grid[row].indexOf(num) === -1;
  }

  function checkCol(grid, col, num) {
    return grid.every((row) => row[col] !== num);
  }

  function checkBox(grid, row, col, num) {
    let boxArr = [],
      rowStart = row - (row % 3),
      colStart = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        boxArr.push(grid[rowStart + i][colStart + j]);
      }
    }
    return boxArr.indexOf(num) === -1;
  }

  function checkValid(grid, row, col, num) {
    return (
      checkRow(grid, row, num) &&
      checkCol(grid, col, num) &&
      checkBox(grid, row, col, num)
    );
  }

  function solver(grid, row = 0, col = 0) {
    if (grid[row][col] !== -1) {
      let isLast = row >= 8 && col >= 8;
      if (!isLast) {
        let [newRow, newCol] = getNext(row, col);
        return solver(grid, newRow, newCol);
      }
    }

    for (let num = 1; num <= 9; num++) {
      if (checkValid(grid, row, col, num)) {
        grid[row][col] = num;
        let [newRow, newCol] = getNext(row, col);

        if (!newRow && !newCol) {
          return true;
        }
        if (solver(grid, newRow, newCol)) {
          return true;
        }
      }
    }
    grid[row][col] = -1;
    return false;
  }

  function getNext(row, col) {
    return col !== 8 ? [row, col + 1] : row !== 8 ? [row + 1, 0] : [0, 0];
  }

  function solveSudoku() {
    let sudoku = getDeepCopy(sudokuArr);
    solver(sudoku);
    setSudokuArr(sudoku);
  }

  function resetSudoku() {
    setSudokuArr(getDeepCopy(initialBoard));
    setUndoStack([]);
  }

  function shuffleSudoku() {
    let shuffledSudoku = getDeepCopy(sudokuArr);
    for (let i = 1; i <= 9; i++) {
      let rand1 = Math.floor(Math.random() * 9) + 1;
      let rand2 = Math.floor(Math.random() * 9) + 1;
      shuffledSudoku = swapNumbers(shuffledSudoku, rand1, rand2);
    }
    setSudokuArr(shuffledSudoku);
  }

  function swapNumbers(grid, num1, num2) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === num1) {
          grid[row][col] = num2;
        } else if (grid[row][col] === num2) {
          grid[row][col] = num1;
        }
      }
    }
    return grid;
  }

  function changeDifficulty(difficulty) {
    switch (difficulty) {
      case "easy":
        setSudokuArr(getDeepCopy(easyBoard));
        setInitialBoard(getDeepCopy(easyBoard));
        break;
      case "moderate":
        setSudokuArr(getDeepCopy(moderateBoard));
        setInitialBoard(getDeepCopy(moderateBoard));
        break;
      case "challenging":
        setSudokuArr(getDeepCopy(challengingBoard));
        setInitialBoard(getDeepCopy(challengingBoard));
        break;
      default:
        setSudokuArr(getDeepCopy(easyBoard));
        setInitialBoard(getDeepCopy(easyBoard));
    }
    setUndoStack([]);
  }

  function undoLastMove() {
    const lastMove = undoStack.pop();
    if (lastMove) {
      const { row, col, value } = lastMove;
      const newGrid = getDeepCopy(sudokuArr);
      newGrid[row][col] = value;
      setSudokuArr(newGrid);
      setUndoStack([...undoStack]);
    }
  }

  return (
    <div className="App">
      <div className="App-header">
        <h3>Sudoku Solver</h3>
        <div className="difficultyButtons">
          <button onClick={() => changeDifficulty("easy")}>Easy</button>
          <button onClick={() => changeDifficulty("moderate")}>Moderate</button>
          <button onClick={() => changeDifficulty("challenging")}>
            Challenging
          </button>
        </div>
        <table>
          <tbody>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((row, rIndex) => {
              return (
                <tr
                  key={rIndex}
                  className={(row + 1) % 3 === 0 ? "bBorder" : ""}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col, cIndex) => {
                    return (
                      <td
                        key={rIndex + cIndex}
                        className={(col + 1) % 3 === 0 ? "rBorder" : ""}
                      >
                        <input
                          onChange={(e) => onInputChange(e, row, col)}
                          value={
                            sudokuArr[row][col] === -1
                              ? ""
                              : sudokuArr[row][col]
                          }
                          className="cellInput"
                          disabled={initialBoard[row][col] !== -1}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="buttonContainer">
          <button className="checkButton" onClick={checkSudoku}>
            Check
          </button>
          <button className="solveButton" onClick={solveSudoku}>
            Solve
          </button>
          <button className="resetButton" onClick={resetSudoku}>
            Reset
          </button>
          <button className="shuffleButton" onClick={shuffleSudoku}>
            Shuffle
          </button>
          <button className="undoButton" onClick={undoLastMove}>
            Undo
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
