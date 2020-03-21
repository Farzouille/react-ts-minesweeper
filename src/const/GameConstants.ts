import { GameBoard } from '../interfaces/Board';

export const GameInitialState: GameBoard = {
    board: [],
    gameOver: false,
    mines: 10,
    gameSize: 10,
    gameWin: false,
    flagsLeft: 10,
  };