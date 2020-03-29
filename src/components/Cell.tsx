import React, { useContext } from 'react';

import { GameActions } from '../actions/GameActions';
import { dispatchContext, stateContext } from '../containers/GameBoard';
import { CellState } from '../interfaces/Cell';

interface CellProps {
    cellInfo: CellState;
}

export const Cell: React.FunctionComponent<CellProps> = (props: CellProps) => {
    const dispatch = useContext(dispatchContext);
    const { gameOver } = useContext(stateContext);
    const { isMine, uncovered, connectingMines, row, column, flagged } = props.cellInfo;

    function handleCellClick(): void {
        if (flagged || gameOver) return;
        dispatch({ type: GameActions.UNCOVER_CELL, payload: { row, column } });
    }

    function onCellRightClick(e): boolean {
        e.preventDefault();
        e.stopPropagation();
        if (gameOver || uncovered) return false;
        dispatch({ type: GameActions.RIGHT_CLICK_CELL, payload: { row, column } });
        return false;
    }

    return (
        <div
            className={`cell ${uncovered ? 'uncovered' : ''} ${flagged ? 'noHover' : ''}`}
            onClick={handleCellClick}
            onContextMenu={(e): boolean => onCellRightClick(e)}
        >
            <div
                className={`
          cell_content _${connectingMines} 
          ${(isMine && uncovered) || (isMine && gameOver) ? 'mine' : ''} 
          ${flagged ? 'flagged' : ''}`}
            >
                {connectingMines && !isMine && uncovered ? connectingMines : ''}
            </div>
        </div>
    );
};
