export interface CellState {
  connectingMines: number;
  flagged: boolean;
  uncovered: boolean;
  isMine: boolean;
  row: number;
  column: number;
}
