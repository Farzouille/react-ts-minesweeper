import React from 'react';
import './App.scss';
import { GameBoard } from './GameBoard';

function App() {
  return (
    <div className="App">
      <GameBoard gameSize={10} mineNumber={10} />
    </div>
  );
}

export default App;
