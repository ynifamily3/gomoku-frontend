import { useRecoilValue } from "recoil";
import * as RecoilState from "./state/game";
import Gameboard from "./ui/Gameboard";

const App = () => {
  const boardUiState = useRecoilValue(RecoilState.boardUiState);
  return (
    <div>
      <h1>gomoku</h1>
      <Gameboard boardUiState={boardUiState} />
    </div>
  );
};

export default App;
