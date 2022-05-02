import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      mostRecentHistoryStep: 0
    };
  }

  calculateWinner(squares) {
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

  gridCoordinatesFromSquareNumber(i) {
    const row = Math.ceil((i + 1) / 3);
    const col = i + 1 - ((row - 1) * 3);
    return [row, col];
  }

  handleSquareClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (this.calculateWinner(squares) || squares[i]) {
      return;
    }
    let row, col = this.gridCoordinatesFromSquareNumber(i);
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{ squares: squares, squareClicked: i, rowClicked: row, colClicked: col }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      mostRecentHistoryStep: history.length
    });
  }

  jumpTo(step) {
    console.log(`jumping to step: ${step}`);
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      mostRecentHistoryStep: step
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.calculateWinner(current.squares);

    const historyStateButtons = history.map((historyState, move) => {
      let squareValue = historyState.squares[historyState.squareClicked];
      let desc;
      if (move) {
        desc = 'Go to move #' + move + `: ${squareValue} (${historyState.rowClicked, historyState.colClicked})`;
      } else {
        desc = 'Go to game start';
      }

      let button_class = '';
      console.log(`move: ${move}`)
      console.log(`mostRecentHistoryStep: ${this.state.mostRecentHistoryStep}`)
      if (move === this.state.mostRecentHistoryStep) {
        button_class = 'current-history-item';
      }

      return (
        <li key={move}>
          <button className={button_class} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) => this.handleSquareClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{historyStateButtons}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
