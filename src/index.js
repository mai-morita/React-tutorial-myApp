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
}

const Board = (props) => {
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
      {Array(3)
        .fill(0)
        .map((row, i) => {
          return (
            <div className="board-row" key={i}>
              {Array(3)
                .fill(0)
                .map((col, j) => {
                  return renderSquare(
                    i * 3 + j,
                    props.highlightCells.indexOf(i * 3 + j) !== -1
                  );
                })}
            </div>
          );
        })}
    </div>
  );
};

const Game = () => {
  const [history, setHistory] = useState([
    {
      squares: Array(9).fill(null),
    },
  ]);
  const [xIsNext, setXIsNext] = useState(true);
  const [stepNumber, setStepNumber] = useState(0);
  const [isAsc, setIsAsc] = useState(true);

  const handleClick = (i) => {
    const historyClick = history.slice(0, stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? "X" : "O";

    setHistory(
      history.concat([
        { squares, col: (i % 3) + 1, row: Math.floor(i / 3) + 1 },
      ])
    );
    setStepNumber(history.length);
    setXIsNext(!xIsNext);
  };

  const jumpTo = (step) => {
    stepNumber(step);
    xIsNext(step % 2 === 0);
  };
  const toggleAsc = () => {
    setIsAsc(!isAsc);
  };

  const current = history[stepNumber];
  const settlement = calculateWinner(current.squares);

  let status;
  if (settlement) {
    if (settlement.isDraw) {
      status = "Draw";
    } else {
      status = "Winner: " + settlement.winner;
    }
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const moves = history.map((step, move) => {
    const desc = move
      ? "Move #" + move + "(" + step.col + "," + step.row + ")"
      : "Game start";
    return (
      <li key={move}>
        <button
          onClick={() => jumpTo(move)}
          className={stepNumber === move ? "bold" : ""}
        >
          {desc}
        </button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={(i) => handleClick(i)}
          highlightCells={settlement ? settlement.line : []}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <div>
          <button onClick={() => toggleAsc()}>ASC⇔DESC</button>
        </div>
        <ol>{isAsc ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
};
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
