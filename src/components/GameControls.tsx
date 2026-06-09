"use client";

import { Difficulty, DIFFICULTY_CONFIG } from "@/types/game";

interface GameControlsProps {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onNewGame: () => void;
  flagsUsed: number;
  mineCount: number;
  timer: number;
  status: "idle" | "playing" | "won" | "lost";
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function GameControls({
  difficulty,
  onDifficultyChange,
  onNewGame,
  flagsUsed,
  mineCount,
  timer,
  status,
}: GameControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-3 px-4 bg-white/80 backdrop-blur-sm rounded-xl border border-marketplace-border shadow-sm">
      <div className="flex items-center gap-1.5">
        {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((d) => (
          <button
            key={d}
            onClick={() => onDifficultyChange(d)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              difficulty === d
                ? "bg-marketplace-accent text-white shadow-sm"
                : "bg-marketplace-bg text-marketplace-text-secondary hover:bg-marketplace-border"
            }`}
          >
            {DIFFICULTY_CONFIG[d].label}
          </button>
        ))}
      </div>

      <div className="h-6 w-px bg-marketplace-border hidden sm:block" />

      <button
        onClick={onNewGame}
        className="px-4 py-1.5 text-sm font-semibold bg-marketplace-accent text-white rounded-lg hover:bg-marketplace-accent-hover transition-colors shadow-sm"
      >
        New Game
      </button>

      <div className="h-6 w-px bg-marketplace-border hidden sm:block" />

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5" title="Flags used">
          <span className="text-base">🚩</span>
          <span className="font-mono font-semibold tabular-nums">
            {mineCount - flagsUsed}
          </span>
        </div>

        <div className="flex items-center gap-1.5" title="Time elapsed">
          <span className="text-base">⏱️</span>
          <span className="font-mono font-semibold tabular-nums">
            {formatTime(timer)}
          </span>
        </div>

        {status === "won" && (
          <span className="text-marketplace-success font-semibold">
            ✓ Cleared!
          </span>
        )}
        {status === "lost" && (
          <span className="text-marketplace-danger font-semibold">
            ✗ Scammed!
          </span>
        )}
      </div>
    </div>
  );
}
