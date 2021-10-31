import { useRecoilValue, useSetRecoilState } from "recoil";
import * as RecoilState from "./state/game";
import Gameboard from "./ui/Gameboard";

const App = () => {
  const boardState = useRecoilValue(RecoilState.boardState);
  const boardUiState = useRecoilValue(RecoilState.boardUiState);
  const setter = useSetRecoilState(RecoilState.boardState);
  const handlePutPiece = (
    position: RecoilState.Position,
    piece: RecoilState.Piece
  ) => {
    RecoilState.putPiece(setter, position, piece);
  };

  return (
    <div>
      <h1>gomoku</h1>
      <Gameboard
        boardState={boardState}
        boardUiState={boardUiState}
        handlePutPiece={handlePutPiece}
      />
    </div>
  );
};

export default App;
