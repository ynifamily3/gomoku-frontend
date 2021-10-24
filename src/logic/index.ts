import { BoardState, Piece, Position } from "../state/game";

const isBlack = (boardState: BoardState, position: Position): boolean => {
  return boardState.positions[position.r][position.c] === "BLACK";
};

const isWhite = (boardState: BoardState, position: Position): boolean => {
  return boardState.positions[position.r][position.c] === "WHITE";
};

const isEmpty = (boardState: BoardState, position: Position): boolean => {
  return boardState.positions[position.r][position.c] === "EMPTY";
};

const getPiece = (boardState: BoardState, position: Position): Piece => {
  return boardState.positions[position.r][position.c];
};

const willWinWhoPlacedLastStone = (boardState: BoardState): boolean => {
  if (boardState.recentlyPlaced === null) {
    return false;
  }
  // TODO
  return true;
};

const willthreethree = (boardState: BoardState): boolean => {
  if (boardState.recentlyPlaced === null) {
    return false;
  }
  // TODO
  // https://namu.wiki/w/%EC%98%A4%EB%AA%A9/%EB%A3%B0%EC%9D%98%20%EC%A2%85%EB%A5%98#s-2.1
  //  렌주에서 '3'은 단순히 돌 세개가 연속으로 있는 걸 말하는 게 아니다.
  // '3'이라 함은 한 수를 추가 했을 때 '열린 4' 를 만들 수 있는 상태를 말한다.
  // 그러므로 '3-3'은 3이 동시에 두 개가 발생하여 상대편이 한 쪽을 막아도
  // 다른 쪽으로 열린 4를 만들게 되는 지점을 뜻하고 이게 착수금지되는 것이다.
  return true;
};

export { willWinWhoPlacedLastStone, isBlack, isWhite, isEmpty, willthreethree };
