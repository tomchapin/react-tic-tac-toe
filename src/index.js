import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}


function Board(props) {
  function renderSquare(i) {
    return <Square
      value={props.squares[i]}
      onClick={() => props.handleSquareClick(i)}
    />;
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}


function HistoryButtons(props) {
  return props.history.map((historyState, move) => {
    const squareValue = historyState.squares[historyState.squareClicked];
    let desc;
    if (move) {
      desc = 'Go to move #' + move + `: ${squareValue} (${historyState.rowClicked}, ${historyState.colClicked})`;
    } else {
      desc = 'Go to game start';
    }

    let button_class = '';
    if (move === props.mostRecentHistoryStep) {
      button_class = 'current-history-item';
    }

    return (
      <li key={move}>
        <button className={button_class} onClick={() => props.jumpToHistory(move)}>{desc}</button>
      </li>
    )
  });
}


function Game(props) {
  let initialHistory = [{
    squares: Array(9).fill(null)
  }]

  const [history, setHistory] = useState(initialHistory);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [mostRecentHistoryStep, setMostRecentHistoryStep] = useState(0);

  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);
  const status = winner ? 'Winner: ' + winner : ('Next player: ' + (xIsNext ? 'X' : 'O'));

  function handleSquareClick(i) {
    const new_history = history.slice(0, stepNumber + 1);
    const current = new_history[new_history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const [row, col] = gridCoordinatesFromSquareNumber(i);
    squares[i] = xIsNext ? 'X' : 'O';
    setHistory(new_history.concat([{ squares: squares, squareClicked: i, rowClicked: row, colClicked: col }]));
    setStepNumber(new_history.length)
    setXIsNext(!xIsNext)
    setMostRecentHistoryStep(new_history.length);
  }

  function jumpToHistory(step) {
    console.log(`jumping to step: ${step}`);
    setStepNumber(step)
    setXIsNext((step % 2) === 0)
    setMostRecentHistoryStep(step);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={current.squares} handleSquareClick={(i) => handleSquareClick(i)} />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol><HistoryButtons history={history} mostRecentHistoryStep={mostRecentHistoryStep} jumpToHistory={jumpToHistory} /></ol>
      </div>
    </div>
  );

}


// ========================================
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function gridCoordinatesFromSquareNumber(i) {
  const row = Math.ceil((i + 1) / 3);
  const col = i + 1 - ((row - 1) * 3);
  return [row, col];
}


// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
