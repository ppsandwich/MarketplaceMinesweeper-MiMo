"use client";

import { GameStatus as Status, Difficulty } from "@/types/game";

interface GameStatusProps {
  status: Status;
  difficulty: Difficulty;
  onNewGame: () => void;
}

const WIN_MESSAGES = [
  "You cleared the board without buying a $200 PlayStation from a man named Sofa Warehouse Kelvin.",
  "Not a single deposit sent. Your parents would be proud.",
  "You avoided every scam. The marketplace is safer because of you. Sort of.",
  "Zero impulse purchases. Honestly impressive restraint.",
  "You didn't fall for a single 'this is not a scam'. That's growth.",
];

const LOSE_MESSAGES = [
  "You sent a deposit to a stranger and the item has entered witness protection.",
  "The listing was too good to be true. It was.",
  "Your gut said 'no'. Your finger said 'click'. Your finger was wrong.",
  "At least it was only fictional money going to a fictional scammer.",
  "You've learned a valuable lesson about $80 OLED TVs.",
];

function getRandomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

export default function GameStatusMessage({
  status,
  difficulty,
  onNewGame,
}: GameStatusProps) {
  if (status === "idle") return null;

  if (status === "won") {
    return (
      <div className="text-center py-4 px-4 animate-tile-reveal">
        <div className="inline-block bg-marketplace-success/10 border border-marketplace-success/30 rounded-xl p-4 max-w-md">
          <p className="text-lg font-bold text-marketplace-success mb-1">
            🎉 Board Cleared!
          </p>
          <p className="text-sm text-marketplace-text-secondary">
            {getRandomMessage(WIN_MESSAGES)}
          </p>
          <button
            onClick={onNewGame}
            className="mt-3 px-4 py-1.5 bg-marketplace-accent text-white text-sm font-semibold rounded-lg hover:bg-marketplace-accent-hover transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  if (status === "lost") {
    return (
      <div className="text-center py-4 px-4 animate-tile-reveal">
        <div className="inline-block bg-marketplace-danger/10 border border-marketplace-danger/30 rounded-xl p-4 max-w-md">
          <p className="text-lg font-bold text-marketplace-danger mb-1">
            💀 Scammed!
          </p>
          <p className="text-sm text-marketplace-text-secondary">
            {getRandomMessage(LOSE_MESSAGES)}
          </p>
          <button
            onClick={onNewGame}
            className="mt-3 px-4 py-1.5 bg-marketplace-accent text-white text-sm font-semibold rounded-lg hover:bg-marketplace-accent-hover transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
}
