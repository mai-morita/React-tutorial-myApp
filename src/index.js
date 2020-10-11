import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button
      className={`square ${props.isHighlight ? "highlight" : ""}`}
      onClick={() => props.onClick()}
    >
      {props.value}
    </button>
  );
  //良くわからない：className={`square ${props.isHighlight ? "highlight" : ""}`}//
}

const FnBoard = (props) => {
  const renderSquare = (i, isHighlight = false) => {
    return (
      <Square
        isHighlight={isHighlight}
        key={i}
        value={props.squares[i]}
        onClick={() => props.onClick(i)}
      />
    );
  };
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
};

class Game extends React.Component {
  constructor(props) {
    super();
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      xIsNext: true,
      stepNumber: 0,
      isAsc: true,
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          col: (i % 3) + 1,
          row: Math.floor(i / 3) + 1,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }
  //良くわからない：===が？のまま//
  toggleAsc() {
    this.setState({
      asc: !this.state.asc,
    });
  }
  //良くわからない：!の意味//
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const settlement = calculateWinner(current.squares);

    let status;
    if (settlement) {
      if (settlement.isDraw) {
        status = "Draw";
      } else {
        status = "Winner: " + settlement.winner;
      }
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    const moves = history.map((step, move) => {
      const desc = move
        ? "Move #" + move + "(" + step.col + "," + step.row + ")"
        : "Game start";
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            className={this.state.stepNumber === move ? "bold" : ""}
          >
            {desc}
          </button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <FnBoard
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            highlightCells={settlement ? settlement.line : []}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <button onClick={() => this.toggleAsc()}>ASC⇔DESC</button>
          </div>
          <ol>{this.state.asc ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
    //良くわからない：()[]の違い的な部分//
  }
}
// ========================================
ReactDOM.render(<Game />, document.getElementById("root"));

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
      return {
        isDraw: false,
        winner: squares[a],
        line: [a, b, c],
      };
    }
    //良くわからない：ifの中身の部分//
  }

  if (squares.filter((e) => !e).length === 0) {
    return {
      isDraw: true,
      winner: null,
      line: [],
    };
  }

  return null;
}
