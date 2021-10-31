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

enum Direction {
  horizontal, // -
  vertical, // |
  diagonal, // /
  antiDiagonal, // \
}

/**
 * 방향에 따라 다음방향의 논리적인 POSITION을 뱉어주는 함수
 *
 * @param boardState 현재까지의 게임 상태
 * @param direction 방위
 * @param position 현재 위치
 * @returns 다음 위치
 */
const getNext = (
  boardState: BoardState,
  direction: Direction,
  position: Position
): null | Position => {
  const { r, c } = position;
  switch (direction) {
    case Direction.horizontal:
      if (c + 1 < boardState.positions[r].length) {
        return { r, c: c + 1 };
      } else return null;
    case Direction.vertical:
      if (r + 1 < boardState.positions.length) {
        return { r: r + 1, c };
      } else return null;
    case Direction.diagonal: // /
      if (r - 1 >= 0 && c + 1 < boardState.positions[r].length) {
        return { r: r - 1, c: c + 1 };
      } else return null;
    case Direction.antiDiagonal: // \
      if (
        r + 1 < boardState.positions.length &&
        c + 1 < boardState.positions[r].length
      ) {
        return { r: r + 1, c: c + 1 };
      } else return null;
  }
};

/**
 * 방향에 따라 이전방향의 논리적인 POSITION을 뱉어주는 함수
 *
 * @param boardState 현재까지의 게임 상태
 * @param direction 방위
 * @param position 현재 위치
 * @returns 이전 위치
 */
const getPrev = (
  boardState: BoardState,
  direction: Direction,
  position: Position
): null | Position => {
  const { r, c } = position;
  switch (direction) {
    case Direction.horizontal:
      if (c - 1 >= 0) {
        return { r, c: c - 1 };
      } else return null;
    case Direction.vertical:
      if (r - 1 >= 0) {
        return { r: r - 1, c };
      } else return null;
    case Direction.diagonal: // /
      if (r + 1 < boardState.positions.length && c - 1 >= 0) {
        return { r: r + 1, c: c - 1 };
      } else return null;
    case Direction.antiDiagonal: // \
      if (r - 1 >= 0 && c - 1 >= 0) {
        return { r: r - 1, c: c - 1 };
      } else return null;
  }
};

/**
 * OOOO 이면서, 양쪽이 비어있고, 뚫려있는 쪽 바로 옆에 같은 색이 없으면 true
 *
 * 검X검검검검X검     X검검검검X검     검X검검검검X-> 이런건 안됨
 *
 * 흰X검검검검X흰     XX검검검검XX -> 이런건 됨
 *
 * @param boardState 현재까지의 게임 상태
 * @param direction 체크할 방위
 * @param position 체크할 위치
 * @returns 열린 4라면 true
 */
const isOpen4 = (
  boardState: BoardState,
  direction: Direction,
  position: Position
) => {
  const color = getPiece(boardState, position);
  if (color === "EMPTY") return false;
  // 4 check
  let count = -1; // 왼편체크와 오른편체크에서 각각 중복으로 본인을 세므로 -1
  let leftPtr: null | Position = null; // null이면 valid한 위치가 아님 (벗어남)
  let rightPtr: null | Position = null; // 한 칸 벗어난 위치
  let positionPtr: null | Position = { ...position };
  while (positionPtr !== null) {
    if (getPiece(boardState, positionPtr) === color) {
      count++;
    } else {
      break;
    }
    positionPtr = getNext(boardState, direction, positionPtr);
    rightPtr = positionPtr ? { ...positionPtr } : null;
  }
  positionPtr = { ...position };
  while (positionPtr !== null) {
    if (getPiece(boardState, positionPtr) === color) {
      count++;
    } else {
      break;
    }
    positionPtr = getPrev(boardState, direction, positionPtr);
    leftPtr = positionPtr ? { ...positionPtr } : null;
  }
  if (count !== 4) return false;
  // 양쪽이 비어있는지 체크 (empty가 아니거나 null이면 false)
  if (leftPtr === null || rightPtr === null) return false;
  if (getPiece(boardState, leftPtr) !== "EMPTY") return false;
  if (getPiece(boardState, rightPtr) !== "EMPTY") return false;
  // 뚫려있는 쪽 바로 옆에 같은 색이 없으면 true
  const leftleft = getPrev(boardState, direction, leftPtr);
  if (leftleft && getPiece(boardState, leftleft) === color) return false;
  const rightright = getNext(boardState, direction, rightPtr);
  if (rightright && getPiece(boardState, rightright) === color) return false;
  return true;
};

/**
 *
 * @param boardState 현재까지의 게임 상태
 * @param direction 체크할 방위
 * @param position 곧 둘 위치
 * @returns 곧 둘 위치에 둘 때 인자의 방위쪽으로 열린 4가 될 가능성이 있다면 true
 */
const willThree = (
  boardState: BoardState,
  direction: Direction,
  position: Position
): boolean => {
  /*
  3 체크하는 법
일단 그곳에 착수한다.
착수 후 ○○○  패턴의 경우 양쪽에 하나씩 추가해 보아 ‘열린 4’가 나타나는지 관찰한다.

착수 후 ○○✕○ 패턴의 경우 중간에 넣어서 ‘열린 4’가 나타나는지 관찰한다.

열린 4 체크하는 법
양쪽이 뚫려있어야 하는 건 물론이고 뚫려있는 쪽 옆에 ‘같은 색’이 들어가면 안 된다.

○○✕○ 패턴-> 직접 6가지 경우의 수를 조사해서 직접 집어넣어 본다.

○○○ 패턴-> 왼쪽이나 오른쪽에 집어넣어 본다.
*/
  return false;
};

export { isBlack, isWhite, isEmpty, willThree, Direction };
