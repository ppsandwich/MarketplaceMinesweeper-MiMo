"use client";

export default function GameHeader() {
  return (
    <header className="text-center py-6 px-4">
      <h1 className="text-3xl sm:text-4xl font-bold text-marketplace-text tracking-tight">
        Marketplace Minesweeper
      </h1>
      <p className="mt-2 text-sm sm:text-base text-marketplace-text-secondary max-w-lg mx-auto">
        Every listing is a clue. Some are just crimes in a trench coat.
      </p>
    </header>
  );
}
