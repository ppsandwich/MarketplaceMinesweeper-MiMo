export type Difficulty = "easy" | "medium" | "hard";

export type TileType = "safe" | "mine";

export type TileState =
  | "hidden"
  | "opened"
  | "flagged"
  | "exploded"
  | "revealed_mine";

export type GameStatus = "idle" | "playing" | "won" | "lost";

export interface Tile {
  id: string;
  x: number;
  y: number;
  type: TileType;
  state: TileState;
  adjacentMineCount: number;
  listingId: string;
  playerSuspicionCount: number | null;
}

export interface GameState {
  difficulty: Difficulty;
  status: GameStatus;
  board: Tile[];
  width: 9;
  height: 9;
  mineCount: 8 | 12 | 16;
  flagsUsed: number;
  startedAt: number | null;
  endedAt: number | null;
  selectedTileId: string | null;
  seed: string;
}

export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { mineCount: 8 | 12 | 16; label: string }
> = {
  easy: { mineCount: 8, label: "Easy" },
  medium: { mineCount: 12, label: "Medium" },
  hard: { mineCount: 16, label: "Hard" },
};

export const BOARD_WIDTH = 9 as const;
export const BOARD_HEIGHT = 9 as const;
