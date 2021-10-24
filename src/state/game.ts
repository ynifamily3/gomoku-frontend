import { atom, selector } from "recoil";

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
  recentlyPlaced: null | Position;
  positions: Piece[][];
}

export type BoardUiState = string[][];

const boardState = atom<BoardState>({
  key: "boardState",
  default: {
    recentlyPlaced: null,
    positions: Array.from<Piece[][], Piece[]>({ length: 15 }, () =>
      Array.from<Piece[], Piece>({ length: 15 }, () => "EMPTY")
    ),
  },
});

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

export { boardState, boardUiState };
