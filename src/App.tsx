import { HashRouter as Router, Route, Routes } from "react-router-dom";

import IndexPage from "./pages";
import GamePage from "./pages/game";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/game">
          <Route path=":gameId" element={<GamePage />} />
        </Route>
        <Route path="*" element={<IndexPage />} />
      </Routes>
    </Router>
  );
};

export default App;
