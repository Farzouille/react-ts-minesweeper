import React, { useEffect, useReducer, Dispatch } from 'react';
import { gameReducer } from '../reducers/GameReducer';
import { GameInitialState } from '../const/GameConstants';
import { Cell } from '../components/Cell';
import { GameActions } from '../actions/GameActions';

interface GameBoardProps {
    gameSize: number;
    mineNumber: number;
}

export const stateContext = React.createContext(GameInitialState);
export const dispatchContext = React.createContext({} as Dispatch<{type: string, payload: any}>);

export const GameBoard: React.FunctionComponent<GameBoardProps> = props => {
    const [state, dispatch] = useReducer(gameReducer, GameInitialState);

    useEffect(() => {
        dispatch({ type: GameActions.INITIATE_GAME_BOARD, payload: { size: 10, mines: 10 } });
      }, [dispatch])

    const { gameSize, mineNumber } = props;
    return (
    <stateContext.Provider value={state}>
      <dispatchContext.Provider value={dispatch}>
        <div>Flag Count : {state.flagsLeft}</div>
        <div
            className="board"
            style={
              {
                gridTemplateRows: `repeat(${state.gameSize}, 25px)`,
                gridTemplateColumns: `repeat(${state.gameSize}, 25px)`,
              }
            }>
              {
                  state.gameOver ? 
                  <div className="gameOver">
                    YOU LOOSE
                  </div> : ''
              }
              {
                state.gameWin ?
                <div className="gameWin">
                YOU WIN
              </div> : ''
              }
              {
                state.board.map((row, i) => 
                  row.map((cell, j) => <Cell 
                    cellInfo={
                      {
                        ...cell,
                        row: i,
                        column: j
                      }
                    }
                    key={i+j}
                    />)
                )
              }
          </div>
        </dispatchContext.Provider>
      </stateContext.Provider>);
}