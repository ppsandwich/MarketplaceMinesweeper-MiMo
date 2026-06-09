"use client";

import { Tile as TileType, GameStatus } from "@/types/game";

interface TileProps {
  tile: TileType;
  gameStatus: GameStatus;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  isSelected: boolean;
  tabIndex: number;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export default function Tile({
  tile,
  gameStatus,
  onClick,
  onContextMenu,
  isSelected,
  tabIndex,
  onKeyDown,
}: TileProps) {
  const isGameOver = gameStatus === "won" || gameStatus === "lost";

  function getTileContent() {
    if (tile.state === "flagged") {
      return <span className="text-lg sm:text-xl">🚩</span>;
    }

    if (tile.state === "revealed_mine") {
      return <span className="text-lg sm:text-xl">💣</span>;
    }

    if (tile.state === "exploded") {
      return <span className="text-lg sm:text-xl">💥</span>;
    }

    if (tile.state === "opened") {
      if (tile.type === "mine") {
        return <span className="text-lg sm:text-xl">💣</span>;
      }

      if (tile.playerSuspicionCount !== null) {
        return (
          <span
            className={`text-base sm:text-lg font-bold tile-count-${tile.playerSuspicionCount}`}
          >
            {tile.playerSuspicionCount}
          </span>
        );
      }

      if (isGameOver && tile.type === "safe") {
        return (
          <span
            className={`text-base sm:text-lg font-bold tile-count-${tile.adjacentMineCount}`}
          >
            {tile.adjacentMineCount}
          </span>
        );
      }

      return (
        <span className="text-xs text-marketplace-text-secondary opacity-50">
          ✓
        </span>
      );
    }

    return null;
  }

  function getTileClasses() {
    const base =
      "relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-lg border-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-marketplace-accent focus:ring-offset-1 select-none";

    if (tile.state === "exploded") {
      return `${base} bg-marketplace-danger border-marketplace-danger-dark text-white animate-shake`;
    }

    if (tile.state === "revealed_mine") {
      return `${base} bg-marketplace-danger/20 border-marketplace-danger/40`;
    }

    if (tile.state === "flagged") {
      return `${base} bg-marketplace-flagged/30 border-marketplace-flagged cursor-pointer hover:bg-marketplace-flagged/40`;
    }

    if (tile.state === "opened") {
      if (tile.type === "mine") {
        return `${base} bg-marketplace-danger/10 border-marketplace-danger/30 animate-tile-reveal`;
      }
      return `${base} bg-tile-opened border-marketplace-border/50 animate-tile-reveal`;
    }

    // hidden
    const selected = isSelected
      ? "ring-2 ring-marketplace-accent ring-offset-1"
      : "";
    return `${base} bg-tile-hidden border-marketplace-border cursor-pointer hover:bg-tile-hidden-hover hover:shadow-md active:scale-95 ${selected}`;
  }

  function getAriaLabel() {
    if (tile.state === "hidden") {
      return `Unopened listing tile, row ${tile.y + 1}, column ${tile.x + 1}`;
    }
    if (tile.state === "flagged") {
      return `Reported listing, row ${tile.y + 1}, column ${tile.x + 1}`;
    }
    if (tile.state === "opened") {
      if (isGameOver && tile.type === "safe") {
        return `Safe listing with ${tile.adjacentMineCount} suspicious details, row ${tile.y + 1}, column ${tile.x + 1}`;
      }
      if (tile.type === "mine") {
        return `Scam listing, row ${tile.y + 1}, column ${tile.x + 1}`;
      }
      return `Opened listing, row ${tile.y + 1}, column ${tile.x + 1}`;
    }
    if (tile.state === "revealed_mine" || tile.state === "exploded") {
      return `Scam listing revealed, row ${tile.y + 1}, column ${tile.x + 1}`;
    }
    return `Tile row ${tile.y + 1}, column ${tile.x + 1}`;
  }

  return (
    <button
      className={getTileClasses()}
      onClick={onClick}
      onContextMenu={onContextMenu}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
      aria-label={getAriaLabel()}
    >
      {getTileContent()}
    </button>
  );
}
