import React, { useReducer, Dispatch, useState } from 'react';
import { gameReducer } from '../reducers/GameReducer';
import { GameInitialState } from '../const/GameConstants';
import { Cell } from '../components/Cell';
import { GameActions } from '../actions/GameActions';

export const stateContext = React.createContext(GameInitialState);
export const dispatchContext = React.createContext({} as Dispatch<{type: string, payload: any}>);

export const GameBoard: React.FunctionComponent = () => {
    const [state, dispatch] = useReducer(gameReducer, GameInitialState);
    const [size, setSize] = useState(10);
    const [mines, setMines] = useState(10);

    const handleSubmit = (evt) => {
      if (mines <= size * size) {
        dispatch({type: GameActions.INITIATE_GAME_BOARD, payload: {size, mines}})
      } else {
        alert(`With ${size} as a board size, the number of mines should be less than ${size*size}`);
      }
      evt.preventDefault();
  }

    return (
    <stateContext.Provider value={state}>
      <dispatchContext.Provider value={dispatch}>
        <form onSubmit={handleSubmit}>
          <label>
            Selet the size of your board (Max 100)
            <input type="number" value={size} onChange={e => setSize(+e.target.value)} max={100} />
          </label><br />
          <label>
            Selet the number of mines (Max 10 000)
            <input type="number" value={mines} onChange={e => setMines(+e.target.value)} max={10000} />
          </label><br />
          <input type="submit" value="New Game" />
        </form><br />
        <div>Flag Count : {state.flagsLeft}</div>
        <div>Timer : {state.gameTimer}</div>
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
          <button onClick={(e) => dispatch({type:GameActions.SHOW_ALL_CELLS, payload: {}})}>Hey kids, wanna cheat?</button>
        </dispatchContext.Provider>
      </stateContext.Provider>);
}