import { GameActions }from '../actions/GameActions';
import { BoardMap } from '../interfaces/Board';


export function gameReducer(state, {type, payload}) {
    switch(type) {
        case GameActions.INITIATE_GAME_BOARD:
            return {
                ...state,
                board: initiateBoard(payload.size, payload.mines),
                gameSize: payload.size,
                flagsLeft: payload.mines,
            }
        case GameActions.UNCOVER_CELL:
            return {
                ...state,
                board: uncoverCells(state.board, payload.row, payload.column),
                gameOver: state.board[payload.row][payload.column].isMine,
                gameWin: winCheck(state.board, payload.row, payload.column, state.mines, state.gameSize),
            }
        case GameActions.RIGHT_CLICK_CELL:
            return {
                ...state,
                board: placeFlag(state.board, payload.row, payload.column, state.flagsLeft),
                flagsLeft: flagCount(state.board, payload.row, payload.column, state.flagsLeft),
                gameWin: winCheck(state.board, payload.row, payload.column, state.mines, state.gameSize),
            }
        case GameActions.SHOW_ALL_CELLS:
            return {
                ...state,
                board: uncoverAllCells(state.board)
            }
    }
}

function uncoverAllCells(board: BoardMap): BoardMap {
    const newBoard = JSON.parse(JSON.stringify(board));

    newBoard.map((row) => {
        row.map((column) => {
            column.uncovered = true;
        })
    });
    return newBoard;
}

function winCheck(board: BoardMap, row: number, column: number, mines: number, size: number): boolean {
    const newBoard = JSON.parse(JSON.stringify(board));
    const cellsToDiscover = size * size - mines;
    let count = 1;
    if (newBoard[row][column].connectingMines === 0 || newBoard[row][column].isMine) {
        return false;
    }
    newBoard.map((row) => {
        row.map((column) => {
            column.uncovered && count++;
        })
    });
    return count === cellsToDiscover;
}

function flagCount(board: BoardMap, row: number, column: number, flagsLeft: number): number {
    const newBoard = JSON.parse(JSON.stringify(board));
    if (newBoard[row][column].flagged) {
        return flagsLeft + 1;
    }
    if (!newBoard[row][column].flagged && flagsLeft > 0) {
        return flagsLeft - 1
    }
    return flagsLeft;
}

function placeFlag(board: BoardMap, row: number, column: number, flagsLeft: number): BoardMap {
    let newBoard = JSON.parse(JSON.stringify(board));
    if ((flagsLeft > 0 && newBoard[row][column].flagged === false) || newBoard[row][column].flagged) {
        newBoard[row][column].flagged = !newBoard[row][column].flagged;
    }
    return newBoard;
}

function initiateEmptyBoard(size: number): BoardMap {
    return Array.from(
      Array(size), () =>
      new Array(size).fill({
        isMine: false,
        uncovered: false,
        connectingMines: 0,
        flagged: false,
      })
      );
};

function initiateBoard(size: number, mines: number): BoardMap {
    let newBoard = JSON.parse(JSON.stringify(initiateEmptyBoard(size)));
    let placedMines = 0;
    while (placedMines < mines) {
        const x = Math.floor(Math.random()*(size));
        const y = Math.floor(Math.random()*(size));

        if (!newBoard[x][y].isMine) {
            newBoard[x][y].isMine = true;
            addConnectingMineToAdjacentCells(newBoard, x, y);
            placedMines++;
        }
    }
    console.log(newBoard);
    return newBoard;
}

  //TODO Too bruteforce ?
function addConnectingMineToAdjacentCells(board: BoardMap, x: number, y: number): void {
    if (board[x - 1]) {
        if (board[x - 1][y - 1]) {
            board[x - 1][y - 1].connectingMines++;
        }
        if (board[x - 1][y]) {
            board[x - 1][y].connectingMines++;
        }
        if (board[x - 1][y + 1]) {
            board[x - 1][y + 1].connectingMines++;
        }
    }
    if (board[x][y - 1]) {
        board[x][y - 1].connectingMines++;
    }
    if (board[x][y + 1]) {
        board[x][y + 1].connectingMines++;
    }
    if (board[x+1]) {
        if (board[x + 1][y - 1]) {
            board[x + 1][y - 1].connectingMines++;
        }
        if (board[x + 1][y]) {
            board[x + 1][y].connectingMines++;
        }
        if (board[x + 1][y + 1]) {
            board[x + 1][y + 1].connectingMines++;
        }
    }
}

function uncoverCells(originalBoard: BoardMap, row: number, column: number): BoardMap {
    const newBoard = JSON.parse(JSON.stringify(originalBoard));
    uncoverCell(newBoard, row, column);
    return newBoard;
};

function uncoverCell(board: BoardMap, row: number, column: number): void {
    board[row][column].uncovered = true;
    if(board[row][column].connectingMines === 0 && !board[row][column].isMine) {
        uncoverAdjacentCells(board, row, column);
    }
};


  //TODO Too bruteforce ?
function uncoverAdjacentCells(board: BoardMap, x: number, y: number): void {
    if (board[x - 1]) {
        if (board[x - 1][y - 1] && board[x - 1][y - 1].uncovered === false) {
            uncoverCell(board, x - 1, y - 1);
        }
        if (board[x - 1][y] && board[x - 1][y].uncovered === false) {
            uncoverCell(board, x - 1, y);
        }
        if (board[x - 1][y + 1] && board[x - 1][y + 1].uncovered === false) {
            uncoverCell(board, x - 1, y + 1);
        }
    }
    if (board[x][y - 1] && board[x][y - 1].uncovered === false) {
        uncoverCell(board, x, y - 1);
    }
    if (board[x][y + 1] && board[x][y + 1].uncovered === false) {
        uncoverCell(board, x, y + 1);
    }
    if (board[x+1]) {
        if (board[x + 1][y - 1] && board[x + 1][y - 1].uncovered === false) {
            uncoverCell(board, x + 1, y - 1);
        }
        if (board[x + 1][y] && board[x + 1][y].uncovered === false) {
            uncoverCell(board, x + 1, y);
        }
        if (board[x + 1][y + 1] && board[x + 1][y + 1].uncovered === false) {
            uncoverCell(board, x + 1, y + 1);
        }
    }
};