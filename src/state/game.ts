import { atom, selector, SetterOrUpdater } from "recoil";
import { produce } from "immer";
export const PIECE = {
  EMPTY: "EMPTY",
  BLACK: "BLACK",
  WHITE: "WHITE",
} as const;
export type Piece = typeof PIECE[keyof typeof PIECE];

export interface Position {
  r: number;
  c: number;
}

export interface BoardState {
  currentPiece: Piece;
  recentlyPlaced: null | Position;
  positions: Piece[][];
}

export type BoardUiState = string[][];

const boardState = atom<BoardState>({
  key: "boardState",
  default: {
    currentPiece: "BLACK",
    recentlyPlaced: null,
    positions: Array.from<Piece[][], Piece[]>({ length: 15 }, () =>
      Array.from<Piece[], Piece>({ length: 15 }, () => "EMPTY")
    ),
  },
});

// controller
const putPiece = (
  dispatch: SetterOrUpdater<BoardState>,
  position: Position,
  piece: Piece
) => {
  dispatch((boardState) =>
    produce(boardState, (draft) => {
      draft.positions[position.r][position.c] = piece;
    })
  );
};

const boardUiState = selector<BoardUiState>({
  key: "boardUiState",
  get: ({ get }) => {
    return get(boardState).positions.map((row) =>
      row.map((piece) =>
        piece === "EMPTY" ? "　" : piece === PIECE.BLACK ? "●" : "○"
      )
    );
  },
});

export { boardState, boardUiState, putPiece };
