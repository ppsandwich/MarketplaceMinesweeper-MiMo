import { Difficulty } from "@/types/game";

const PREFIX = "marketplace-minesweeper";

export function getLastDifficulty(): Difficulty {
  if (typeof window === "undefined") return "medium";
  const stored = localStorage.getItem(`${PREFIX}:difficulty`);
  if (stored === "easy" || stored === "medium" || stored === "hard") {
    return stored;
  }
  return "medium";
}

export function setLastDifficulty(difficulty: Difficulty): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${PREFIX}:difficulty`, difficulty);
}
