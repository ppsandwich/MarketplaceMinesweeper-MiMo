import { BOARD_HEIGHT, BOARD_WIDTH, Tile, TileType } from "@/types/game";
import { seededRandom } from "./seededRandom";

export function getAdjacentTiles(
  x: number,
  y: number,
  board: Tile[],
  width: number = BOARD_WIDTH,
  height: number = BOARD_HEIGHT
): Tile[] {
  const adjacent: Tile[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const tile = board.find((t) => t.x === nx && t.y === ny);
        if (tile) adjacent.push(tile);
      }
    }
  }
  return adjacent;
}

export function calculateAdjacentMineCounts(board: Tile[]): void {
  for (const tile of board) {
    if (tile.type === "mine") continue;
    const adjacent = getAdjacentTiles(tile.x, tile.y, board);
    tile.adjacentMineCount = adjacent.filter((t) => t.type === "mine").length;
  }
}

export function generateBoard({
  mineCount,
  seed,
  safeFirstClickPosition,
}: {
  mineCount: number;
  seed: string;
  safeFirstClickPosition: { x: number; y: number };
}): Tile[] {
  const random = seededRandom(seed);
  const totalTiles = BOARD_WIDTH * BOARD_HEIGHT;

  const board: Tile[] = [];
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      board.push({
        id: `${x}-${y}`,
        x,
        y,
        type: "safe",
        state: "hidden",
        adjacentMineCount: 0,
        listingId: "",
        playerSuspicionCount: null,
      });
    }
  }

  const safeZone = new Set<string>();
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const nx = safeFirstClickPosition.x + dx;
      const ny = safeFirstClickPosition.y + dy;
      if (nx >= 0 && nx < BOARD_WIDTH && ny >= 0 && ny < BOARD_HEIGHT) {
        safeZone.add(`${nx}-${ny}`);
      }
    }
  }

  const candidatePositions: { x: number; y: number }[] = [];
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (!safeZone.has(`${x}-${y}`)) {
        candidatePositions.push({ x, y });
      }
    }
  }

  for (let i = candidatePositions.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [candidatePositions[i], candidatePositions[j]] = [
      candidatePositions[j],
      candidatePositions[i],
    ];
  }

  const minesToPlace = Math.min(mineCount, candidatePositions.length);
  for (let i = 0; i < minesToPlace; i++) {
    const pos = candidatePositions[i];
    const tile = board.find((t) => t.x === pos.x && t.y === pos.y);
    if (tile) {
      tile.type = "mine";
    }
  }

  calculateAdjacentMineCounts(board);

  return board;
}

export function checkWinCondition(board: Tile[]): boolean {
  return board.every(
    (tile) =>
      (tile.type === "mine" && tile.state !== "opened") ||
      (tile.type === "safe" && tile.state === "opened")
  );
}

export function revealAllMines(board: Tile[]): Tile[] {
  return board.map((tile) => {
    if (tile.type === "mine" && tile.state === "hidden") {
      return { ...tile, state: "revealed_mine" as const };
    }
    return tile;
  });
}

export function openTile(board: Tile[], tileId: string): Tile[] {
  const newBoard = board.map((t) => ({ ...t }));
  const tile = newBoard.find((t) => t.id === tileId);
  if (!tile || tile.state !== "hidden") return newBoard;

  tile.state = "opened";

  if (tile.type === "safe" && tile.adjacentMineCount === 0) {
    const queue: Tile[] = [tile];
    const visited = new Set<string>([tile.id]);

    while (queue.length > 0) {
      const current = queue.shift()!;
      const adjacent = getAdjacentTiles(current.x, current.y, newBoard);

      for (const adj of adjacent) {
        if (visited.has(adj.id)) continue;
        visited.add(adj.id);

        if (adj.state === "hidden" && adj.type === "safe") {
          adj.state = "opened";
          if (adj.adjacentMineCount === 0) {
            queue.push(adj);
          }
        }
      }
    }
  }

  return newBoard;
}
