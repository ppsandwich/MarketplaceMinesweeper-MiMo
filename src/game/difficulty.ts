import { Difficulty, DIFFICULTY_CONFIG } from "@/types/game";

export function getMineCount(difficulty: Difficulty): number {
  return DIFFICULTY_CONFIG[difficulty].mineCount;
}

export function getDifficultyLabel(difficulty: Difficulty): string {
  return DIFFICULTY_CONFIG[difficulty].label;
}
