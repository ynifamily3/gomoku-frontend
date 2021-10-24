import React from "react";

const gridStyle: React.CSSProperties = {
  display: "inline-block",
  width: 30,
  height: 30,
  backgroundColor: "rgb(220, 180, 92)",
  textAlign: "center",
};

const Gameboard = ({ boardUiState }: { boardUiState: string[][] }) => {
  return (
    <div>
      {boardUiState.map((row, r) => {
        return (
          <div key={r}>
            {row.map((piece, j) => {
              return (
                <span key={j} style={gridStyle}>
                  [{piece}]
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
export default Gameboard;
