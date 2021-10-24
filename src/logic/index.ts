import { BoardState } from "../state/game";

const willWinWhoPlacedLastStone = (boardState: BoardState): boolean => {
  if (boardState.recentlyPlaced === null) {
    return false;
  }
  // 33
  return true;
};

export { willWinWhoPlacedLastStone };
