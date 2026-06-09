"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  Difficulty,
  GameState,
  Tile,
  GameStatus,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  DIFFICULTY_CONFIG,
} from "@/types/game";
import { MarketplaceListing } from "@/types/listing";
import { generateBoard, openTile, checkWinCondition, revealAllMines } from "@/game/board";
import { generateSeed } from "@/game/seededRandom";
import { listingsBySuspicionCount } from "@/data/listings";
import { scamListings } from "@/data/scamListings";
import { getLastDifficulty, setLastDifficulty } from "@/utils/localStorage";

import GameHeader from "@/components/GameHeader";
import GameControls from "@/components/GameControls";
import Board from "@/components/Board";
import ListingModal from "@/components/ListingModal";
import GameStatusMessage from "@/components/GameStatus";
import HowToPlay from "@/components/HowToPlay";

function assignListings(board: Tile[], seed: string): Tile[] {
  const random = (() => {
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
      h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
    }
    return () => {
      h |= 0;
      h = (h + 0x6d2b79f5) | 0;
      let t = Math.imul(h ^ (h >>> 15), 1 | h);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  })();

  const usedListingIds = new Set<string>();
  const usedScamIds = new Set<string>();

  return board.map((tile) => {
    if (tile.type === "mine") {
      const available = scamListings.filter((l) => !usedScamIds.has(l.id));
      if (available.length === 0) {
        const fallback = scamListings[Math.floor(random() * scamListings.length)];
        return { ...tile, listingId: fallback.id };
      }
      const listing = available[Math.floor(random() * available.length)];
      usedScamIds.add(listing.id);
      return { ...tile, listingId: listing.id };
    }

    const pool = listingsBySuspicionCount[tile.adjacentMineCount] ?? [];
    const available = pool.filter((l) => !usedListingIds.has(l.id));
    if (available.length === 0) {
      if (pool.length > 0) {
        const fallback = pool[Math.floor(random() * pool.length)];
        return { ...tile, listingId: fallback.id };
      }
      return { ...tile, listingId: "unknown" };
    }
    const listing = available[Math.floor(random() * available.length)];
    usedListingIds.add(listing.id);
    return { ...tile, listingId: listing.id };
  });
}

export default function Home() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setDifficulty(getLastDifficulty());
  }, []);

  useEffect(() => {
    if (gameState?.status === "playing") {
      timerRef.current = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState?.status]);

  const startNewGame = useCallback(
    (diff?: Difficulty) => {
      const d = diff ?? difficulty;
      const seed = generateSeed();
      const mineCount = DIFFICULTY_CONFIG[d].mineCount;

      const emptyBoard: Tile[] = [];
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          emptyBoard.push({
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

      setGameState({
        difficulty: d,
        status: "idle",
        board: emptyBoard,
        width: BOARD_WIDTH,
        height: BOARD_HEIGHT,
        mineCount,
        flagsUsed: 0,
        startedAt: null,
        endedAt: null,
        selectedTileId: null,
        seed,
      });
      setSelectedTileId(null);
      setTimer(0);
    },
    [difficulty]
  );

  useEffect(() => {
    if (!gameState) {
      startNewGame();
    }
  }, [gameState, startNewGame]);

  const handleTileClick = useCallback(
    (tileId: string) => {
      if (!gameState) return;
      if (gameState.status === "won" || gameState.status === "lost") return;

      const tile = gameState.board.find((t) => t.id === tileId);
      if (!tile) return;

      if (tile.state === "flagged") {
        setSelectedTileId(tileId);
        return;
      }

      if (tile.state === "opened") {
        setSelectedTileId(tileId);
        return;
      }

      if (gameState.status === "idle") {
        const newBoard = generateBoard({
          mineCount: gameState.mineCount,
          seed: gameState.seed,
          safeFirstClickPosition: { x: tile.x, y: tile.y },
        });
        const boardWithListings = assignListings(newBoard, gameState.seed);
        const opened = openTile(boardWithListings, tileId);

        const won = checkWinCondition(opened);
        setGameState({
          ...gameState,
          status: won ? "won" : "playing",
          board: opened,
          startedAt: Date.now(),
          endedAt: won ? Date.now() : null,
          selectedTileId: tileId,
        });
        setSelectedTileId(tileId);
        setTimer(0);
        return;
      }

      if (tile.type === "mine") {
        const newBoard = gameState.board.map((t) => {
          if (t.id === tileId) {
            return { ...t, state: "exploded" as const };
          }
          return t;
        });
        const revealed = revealAllMines(newBoard);
        setGameState({
          ...gameState,
          status: "lost",
          board: revealed,
          endedAt: Date.now(),
          selectedTileId: tileId,
        });
        setSelectedTileId(tileId);
        return;
      }

      const newBoard = openTile(gameState.board, tileId);
      const won = checkWinCondition(newBoard);
      if (won) {
        const finalBoard = newBoard.map((t) =>
          t.type === "mine" && t.state === "hidden"
            ? { ...t, state: "revealed_mine" as const }
            : t
        );
        setGameState({
          ...gameState,
          status: "won",
          board: finalBoard,
          endedAt: Date.now(),
          selectedTileId: tileId,
        });
      } else {
        setGameState({
          ...gameState,
          board: newBoard,
          selectedTileId: tileId,
        });
      }
      setSelectedTileId(tileId);
    },
    [gameState]
  );

  const handleTileRightClick = useCallback(
    (tileId: string) => {
      if (!gameState) return;
      if (gameState.status === "won" || gameState.status === "lost") return;

      const tile = gameState.board.find((t) => t.id === tileId);
      if (!tile) return;
      if (tile.state === "opened") return;

      const newBoard = gameState.board.map((t) => {
        if (t.id === tileId) {
          if (t.state === "flagged") {
            return { ...t, state: "hidden" as const };
          }
          if (t.state === "hidden") {
            return { ...t, state: "flagged" as const };
          }
        }
        return t;
      });

      const flagsUsed = newBoard.filter((t) => t.state === "flagged").length;
      setGameState({ ...gameState, board: newBoard, flagsUsed });
    },
    [gameState]
  );

  const handleDifficultyChange = useCallback(
    (d: Difficulty) => {
      setDifficulty(d);
      setLastDifficulty(d);
      startNewGame(d);
    },
    [startNewGame]
  );

  const handleSuspicionCountChange = useCallback(
    (count: number | null) => {
      if (!gameState || !selectedTileId) return;
      const newBoard = gameState.board.map((t) =>
        t.id === selectedTileId ? { ...t, playerSuspicionCount: count } : t
      );
      setGameState({ ...gameState, board: newBoard });
    },
    [gameState, selectedTileId]
  );

  const handleLooksSafe = useCallback(() => {
    if (!gameState || !selectedTileId) return;
    handleTileClick(selectedTileId);
  }, [gameState, selectedTileId, handleTileClick]);

  const handleReport = useCallback(() => {
    if (!gameState || !selectedTileId) return;
    handleTileRightClick(selectedTileId);
  }, [gameState, selectedTileId, handleTileRightClick]);

  const handleCloseModal = useCallback(() => {
    setSelectedTileId(null);
  }, []);

  const selectedTile = gameState?.board.find((t) => t.id === selectedTileId);
  const selectedListing = selectedTile
    ? getListingById(selectedTile.listingId)
    : null;

  if (!gameState) return null;

  return (
    <div className="flex flex-col items-center min-h-screen py-4">
      <GameHeader />
      <HowToPlay />

      <div className="w-full max-w-xl px-4 space-y-4">
        <GameControls
          difficulty={difficulty}
          onDifficultyChange={handleDifficultyChange}
          onNewGame={() => startNewGame()}
          flagsUsed={gameState.flagsUsed}
          mineCount={gameState.mineCount}
          timer={timer}
          status={gameState.status}
        />

        <div className="flex justify-center">
          <Board
            board={gameState.board}
            gameStatus={gameState.status}
            onTileClick={handleTileClick}
            onTileRightClick={handleTileRightClick}
            selectedTileId={selectedTileId}
          />
        </div>

        <GameStatusMessage
          status={gameState.status}
          difficulty={difficulty}
          onNewGame={() => startNewGame()}
        />
      </div>

      {selectedTile && selectedListing && (
        <ListingModal
          listing={selectedListing}
          tile={selectedTile}
          gameStatus={gameState.status}
          playerSuspicionCount={selectedTile.playerSuspicionCount}
          onSuspicionCountChange={handleSuspicionCountChange}
          onLooksSafe={handleLooksSafe}
          onReport={handleReport}
          onClose={handleCloseModal}
          isGameOver={
            gameState.status === "won" || gameState.status === "lost"
          }
        />
      )}
    </div>
  );
}

function getListingById(id: string): MarketplaceListing | null {
  for (const listings of Object.values(listingsBySuspicionCount)) {
    const found = listings.find((l) => l.id === id);
    if (found) return found;
  }
  const scam = scamListings.find((l) => l.id === id);
  if (scam) return scam;
  return null;
}
