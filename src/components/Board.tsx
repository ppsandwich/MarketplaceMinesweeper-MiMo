"use client";

import { Tile as TileType, GameStatus, BOARD_WIDTH } from "@/types/game";
import Tile from "./Tile";

interface BoardProps {
  board: TileType[];
  gameStatus: GameStatus;
  onTileClick: (tileId: string) => void;
  onTileRightClick: (tileId: string) => void;
  selectedTileId: string | null;
}

export default function Board({
  board,
  gameStatus,
  onTileClick,
  onTileRightClick,
  selectedTileId,
}: BoardProps) {
  function handleKeyDown(tileId: string, e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onTileClick(tileId);
    }
    if (e.key === "f" || e.key === "F") {
      e.preventDefault();
      onTileRightClick(tileId);
    }
  }

  function handleContextMenu(e: React.MouseEvent, tileId: string) {
    e.preventDefault();
    onTileRightClick(tileId);
  }

  return (
    <div
      className="inline-grid gap-1 sm:gap-1.5 p-2 sm:p-3 bg-white/60 rounded-2xl border border-marketplace-border shadow-sm"
      style={{ gridTemplateColumns: `repeat(${BOARD_WIDTH}, minmax(0, 1fr))` }}
      role="grid"
      aria-label="Game board"
    >
      {board.map((tile, index) => (
        <Tile
          key={tile.id}
          tile={tile}
          gameStatus={gameStatus}
          onClick={() => onTileClick(tile.id)}
          onContextMenu={(e) => handleContextMenu(e, tile.id)}
          isSelected={selectedTileId === tile.id}
          tabIndex={0}
          onKeyDown={(e) => handleKeyDown(tile.id, e)}
        />
      ))}
    </div>
  );
}
