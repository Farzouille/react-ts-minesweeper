import { GameBoard } from '../interfaces/Board';

export const GameInitialState: GameBoard = {
    board: [],
    gameOver: false,
    mines: 0,
    gameSize: 0,
    gameWin: false,
    flagsLeft: 0,
    gameRunning: false,
    gameTimer: 0,
  };