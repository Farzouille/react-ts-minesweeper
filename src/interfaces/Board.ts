import { CellState } from './Cell';

export interface GameBoard {
    board: BoardMap;
    gameOver: boolean;
    mines: number;
    gameWin: boolean;
    gameSize: number;
    flagsLeft: number;
    gameRunning: boolean;
}

export type BoardMap = Array<Array<CellState>>;
