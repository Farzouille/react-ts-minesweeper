/* eslint-disable @typescript-eslint/no-use-before-define */
import { GameActions } from '../actions/GameActions';
import { BoardMap, GameBoard } from '../interfaces/Board';

export function gameReducer(state: GameBoard, { type, payload }): GameBoard {
    switch (type) {
        case GameActions.INITIATE_GAME_BOARD:
            return {
                ...state,
                board: initiateBoard(payload.size, payload.mines),
                gameSize: payload.size,
                flagsLeft: payload.mines,
                mines: payload.mines,
                gameOver: false,
                gameWin: false,
                gameRunning: false,
            };
        case GameActions.UNCOVER_CELL:
            const newBoardUncovered = uncoverCells(state.board, payload.row, payload.column);
            const gameWin = winCheck(
                newBoardUncovered,
                payload.row,
                payload.column,
                state.mines,
                state.gameSize,
                state.flagsLeft,
                'left',
            );
            return {
                ...state,
                board:
                    gameWin || newBoardUncovered[payload.row][payload.column].isMine
                        ? uncoverAllMines(state.board)
                        : newBoardUncovered,
                gameOver: newBoardUncovered[payload.row][payload.column].isMine,
                gameWin,
                gameRunning: !(gameWin || newBoardUncovered[payload.row][payload.column].isMine),
            };
        case GameActions.RIGHT_CLICK_CELL:
            const newBoard = placeFlag(state.board, payload.row, payload.column, state.flagsLeft);
            const gameWinFlag = winCheck(
                newBoard,
                payload.row,
                payload.column,
                state.mines,
                state.gameSize,
                state.flagsLeft,
                'right',
            );
            const gameOver =
                state.flagsLeft === 1
                    ? checkFlagsOnMines(state.board, payload.row, payload.column, state.mines)
                    : false;
            return {
                ...state,
                board: gameWinFlag || gameOver ? uncoverAllMines(state.board) : newBoard,
                flagsLeft: flagCount(state.board, payload.row, payload.column, state.flagsLeft),
                gameWin: gameWinFlag,
                gameOver,
                gameRunning: !(gameWinFlag || gameOver),
            };
        case GameActions.SHOW_ALL_MINES:
            return {
                ...state,
                board: uncoverAllMines(state.board),
            };
    }
    return state;
}

function checkFlagsOnMines(board: BoardMap, row: number, column: number, mines: number): boolean {
    const newBoard = JSON.parse(JSON.stringify(board));
    let count = 0;
    newBoard[row][column].flagged = true;
    newBoard.map((rowMap) => {
        rowMap.map((columnMap) => {
            columnMap.flagged && columnMap.isMine && count++;
            return columnMap;
        });
        return rowMap;
    });
    return count !== mines;
}

function uncoverAllMines(board: BoardMap): BoardMap {
    const newBoard = JSON.parse(JSON.stringify(board));
    newBoard.map((row) => {
        row.map((column) => {
            if (column.isMine) {
                column.uncovered = !column.uncovered;
            }
            return column;
        });
        return row;
    });
    return newBoard;
}

function winCheck(
    board: BoardMap,
    row: number,
    column: number,
    mines: number,
    size: number,
    flagsLeft: number,
    click: string,
): boolean {
    const newBoard = JSON.parse(JSON.stringify(board));
    const cellsToDiscover = size * size - mines;
    let countDiscovered = 0;
    let countMineFlagged = 0;
    if (newBoard[row][column].isMine && click === 'left') {
        return false;
    }
    if (click === 'left') {
        newBoard[row][column].flagged = true;
    }
    newBoard.map((rowMap) => {
        rowMap.map((columnMap) => {
            columnMap.uncovered && !columnMap.isMine && countDiscovered++;
            columnMap.flagged && columnMap.isMine && countMineFlagged++;
            return columnMap;
        });
        return rowMap;
    });
    return countDiscovered === cellsToDiscover || (flagsLeft === 1 && countMineFlagged === mines);
}

function flagCount(board: BoardMap, row: number, column: number, flagsLeft: number): number {
    const newBoard = JSON.parse(JSON.stringify(board));
    if (newBoard[row][column].flagged) {
        return flagsLeft + 1;
    }
    if (!newBoard[row][column].flagged && flagsLeft > 0) {
        return flagsLeft - 1;
    }
    return flagsLeft;
}

function placeFlag(board: BoardMap, row: number, column: number, flagsLeft: number): BoardMap {
    const newBoard = JSON.parse(JSON.stringify(board));
    if ((flagsLeft > 0 && newBoard[row][column].flagged === false) || newBoard[row][column].flagged) {
        newBoard[row][column].flagged = !newBoard[row][column].flagged;
    }
    return newBoard;
}

function initiateEmptyBoard(size: number): BoardMap {
    return Array.from(Array(size), () =>
        new Array(size).fill({
            isMine: false,
            uncovered: false,
            connectingMines: 0,
            flagged: false,
        }),
    );
}

function initiateBoard(size: number, mines: number): BoardMap {
    const newBoard = JSON.parse(JSON.stringify(initiateEmptyBoard(size)));
    let placedMines = 0;
    while (placedMines < mines) {
        const x = Math.floor(Math.random() * size);
        const y = Math.floor(Math.random() * size);
        if (!newBoard[x][y].isMine) {
            newBoard[x][y].isMine = true;
            addConnectingMineToAdjacentCells(newBoard, x, y);
            placedMines++;
        }
    }
    return newBoard;
}

// TODO Too bruteforce ?
function addConnectingMineToAdjacentCells(board: BoardMap, x: number, y: number): void {
    board[x - 1]?.[y - 1] && board[x - 1][y - 1].connectingMines++;
    board[x - 1]?.[y] && board[x - 1][y].connectingMines++;
    board[x - 1]?.[y + 1] && board[x - 1][y + 1].connectingMines++;
    board[x]?.[y - 1] && board[x][y - 1].connectingMines++;
    board[x]?.[y + 1] && board[x][y + 1].connectingMines++;
    board[x + 1]?.[y - 1] && board[x + 1][y - 1].connectingMines++;
    board[x + 1]?.[y] && board[x + 1][y].connectingMines++;
    board[x + 1]?.[y + 1] && board[x + 1][y + 1].connectingMines++;
}

function uncoverCells(originalBoard: BoardMap, row: number, column: number): BoardMap {
    const newBoard = JSON.parse(JSON.stringify(originalBoard));
    uncoverCell(newBoard, row, column);
    return newBoard;
}

function uncoverCell(board: BoardMap, row: number, column: number): void {
    if (board[row]?.[column]) {
        board[row][column].uncovered = true;
        board[row][column].flagged = false;
        if (board[row][column].connectingMines === 0 && !board[row][column].isMine) {
            uncoverAdjacentCells(board, row, column);
        }
    }
}

// TODO Too bruteforce ?
function uncoverAdjacentCells(board: BoardMap, x: number, y: number): void {
    !board[x - 1]?.[y - 1]?.uncovered && uncoverCell(board, x - 1, y - 1);
    !board[x - 1]?.[y]?.uncovered && uncoverCell(board, x - 1, y);
    !board[x - 1]?.[y + 1]?.uncovered && uncoverCell(board, x - 1, y + 1);
    !board[x]?.[y - 1]?.uncovered && uncoverCell(board, x, y - 1);
    !board[x]?.[y + 1]?.uncovered && uncoverCell(board, x, y + 1);
    !board[x + 1]?.[y - 1]?.uncovered && uncoverCell(board, x + 1, y - 1);
    !board[x + 1]?.[y]?.uncovered && uncoverCell(board, x + 1, y);
    !board[x + 1]?.[y + 1]?.uncovered && uncoverCell(board, x + 1, y + 1);
}
