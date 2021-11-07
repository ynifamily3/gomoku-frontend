// import { useRecoilValue, useSetRecoilState } from "recoil";
// import * as RecoilState from "./state/game";
// import Gameboard from "./ui/Gameboard";

import Chatting from "./ui/Chatting";

const App = () => {
  // const boardState = useRecoilValue(RecoilState.boardState);
  // const boardUiState = useRecoilValue(RecoilState.boardUiState);
  // const setter = useSetRecoilState(RecoilState.boardState);
  // const handlePutPiece = (
  //   position: RecoilState.Position,
  //   piece: RecoilState.Piece
  // ) => {
  //   RecoilState.putPiece(setter, position, piece);
  // };

  return (
    <div>
      <h1>gomoku</h1>
      {/* <Gameboard
        boardState={boardState}
        boardUiState={boardUiState}
        handlePutPiece={handlePutPiece}
      /> */}
      <h2>채팅센터</h2>
      <Chatting />
    </div>
  );
};

export default App;
