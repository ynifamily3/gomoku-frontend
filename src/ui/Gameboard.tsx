import React, { useEffect, useState } from "react";
import { Direction, willThree } from "../logic";
import * as RecoilState from "../state/game";

const gridStyle: React.CSSProperties = {
  display: "inline-block",
  width: 30,
  // height: 30,
  backgroundColor: "rgb(220, 180, 92)",
  textAlign: "center",
};

const Gameboard = ({
  boardUiState,
  handlePutPiece,
  boardState,
}: {
  boardState: RecoilState.BoardState;
  boardUiState: string[][];
  handlePutPiece: (
    position: RecoilState.Position,
    piece: RecoilState.Piece
  ) => void;
}) => {
  const [currentPiece, setCurrentPiece] = useState<RecoilState.Piece>("BLACK");
  const [currentPosition, setCurrentPosition] = useState<RecoilState.Position>({
    r: 0,
    c: 0,
  });
  const [msg, setMsg] = useState("마우스를 움직이십시오.");
  useEffect(() => {
    // 33 check for horiz

    const is33 = willThree(boardState, Direction.horizontal, currentPosition);
    setMsg(JSON.stringify(currentPosition) + "  3여부: " + is33);
  }, [boardState, currentPosition]);
  return (
    <>
      <div>
        {boardUiState.map((row, r) => {
          return (
            <div key={r}>
              {row.map((piece, c) => {
                return (
                  <button
                    key={c}
                    style={gridStyle}
                    onClick={() => {
                      handlePutPiece({ r, c }, currentPiece);
                    }}
                    onMouseOver={() => {
                      setCurrentPosition({ r, c });
                    }}
                  >
                    {piece}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
      <button
        onClick={() => {
          setCurrentPiece("BLACK");
        }}
      >
        까망이
      </button>
      <button
        onClick={() => {
          setCurrentPiece("WHITE");
        }}
      >
        하양이
      </button>
      <button
        onClick={() => {
          setCurrentPiece("EMPTY");
        }}
      >
        지우기
      </button>
      <div>{msg}</div>
    </>
  );
};
export default Gameboard;
