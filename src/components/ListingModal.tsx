"use client";

import { useEffect, useRef } from "react";
import { MarketplaceListing } from "@/types/listing";
import { Tile, GameStatus } from "@/types/game";
import ImageCarousel from "./ImageCarousel";

interface ListingModalProps {
  listing: MarketplaceListing;
  tile: Tile;
  gameStatus: GameStatus;
  playerSuspicionCount: number | null;
  onSuspicionCountChange: (count: number | null) => void;
  onLooksSafe: () => void;
  onReport: () => void;
  onClose: () => void;
  isGameOver: boolean;
}

export default function ListingModal({
  listing,
  tile,
  gameStatus,
  playerSuspicionCount,
  onSuspicionCountChange,
  onLooksSafe,
  onReport,
  onClose,
  isGameOver,
}: ListingModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const isScam = tile.type === "mine";
  const isOpened = tile.state === "opened" || tile.state === "exploded";
  const isFlagged = tile.state === "flagged";

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  function handleSuspicionIncrement() {
    const current = playerSuspicionCount ?? -1;
    if (current < 8) {
      onSuspicionCountChange(current + 1);
    }
  }

  function handleSuspicionDecrement() {
    const current = playerSuspicionCount ?? 1;
    if (current > 0) {
      onSuspicionCountChange(current - 1);
    }
  }

  const showScamOverlay = isScam && (gameStatus === "lost" || tile.state === "exploded");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Listing: ${listing.title}`}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        tabIndex={-1}
      >
        {showScamOverlay && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-marketplace-danger/90 text-white p-6">
            <span className="text-5xl mb-4">🚨</span>
            <h2 className="text-2xl font-bold mb-2">SCAMMED! Game Over</h2>
            <p className="text-center text-sm opacity-90 mb-6 max-w-xs">
              You sent a deposit to &ldquo;{listing.sellerName}&rdquo; and the{" "}
              {listing.category === "furniture"
                ? "couch"
                : listing.category === "electronics"
                  ? "device"
                  : listing.category === "vehicles"
                    ? "vehicle"
                    : "item"}{" "}
              has entered witness protection.
            </p>
            <button
              onClick={() => {
                onClose();
              }}
              className="px-6 py-2.5 bg-white text-marketplace-danger font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Replay
            </button>
          </div>
        )}

        <div className="flex items-center justify-between p-4 border-b border-marketplace-border">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-marketplace-text truncate">
              {listing.title}
            </h3>
            <p className="text-xl font-bold text-marketplace-accent mt-0.5">
              {listing.price}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-marketplace-bg transition-colors text-marketplace-text-secondary"
            aria-label="Close listing"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <ImageCarousel listing={listing} />

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-marketplace-bg flex items-center justify-center text-lg">
                {listing.sellerAvatarType === "face"
                  ? "👤"
                  : listing.sellerAvatarType === "logo"
                    ? "🏪"
                    : listing.sellerAvatarType === "pet"
                      ? "🐾"
                      : listing.sellerAvatarType === "ai_weird"
                        ? "🤖"
                        : listing.sellerAvatarType === "object"
                          ? "📦"
                          : "👤"}
              </div>
              <div>
                <p className="text-sm font-medium text-marketplace-text">
                  {listing.sellerName}
                </p>
                <p className="text-xs text-marketplace-text-secondary">
                  {listing.sellerProfileAge}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-marketplace-text-secondary">
              <span>📍</span>
              <span>{listing.location}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-marketplace-bg rounded-full text-xs text-marketplace-text-secondary capitalize">
                {listing.category.replace("_", " ")}
              </span>
            </div>

            <p className="text-sm text-marketplace-text leading-relaxed">
              {listing.description}
            </p>
          </div>

          {tile.state === "opened" && !isGameOver && (
            <div className="border-t border-marketplace-border pt-4">
              <p className="text-sm text-marketplace-text-secondary mb-3 text-center">
                Suspicious details spotted:
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleSuspicionDecrement}
                  disabled={playerSuspicionCount === null || playerSuspicionCount <= 0}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-marketplace-bg hover:bg-marketplace-border disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-lg font-bold"
                  aria-label="Decrease suspicion count"
                >
                  −
                </button>
                <span className="w-12 text-center text-2xl font-bold font-mono text-marketplace-text">
                  {playerSuspicionCount ?? "–"}
                </span>
                <button
                  onClick={handleSuspicionIncrement}
                  disabled={playerSuspicionCount !== null && playerSuspicionCount >= 8}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-marketplace-bg hover:bg-marketplace-border disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-lg font-bold"
                  aria-label="Increase suspicion count"
                >
                  +
                </button>
              </div>
              {playerSuspicionCount !== null && (
                <button
                  onClick={() => onSuspicionCountChange(null)}
                  className="block mx-auto mt-2 text-xs text-marketplace-text-secondary hover:text-marketplace-text underline"
                >
                  Clear note
                </button>
              )}
            </div>
          )}

          {isGameOver && tile.state === "opened" && tile.type === "safe" && (
            <div className="border-t border-marketplace-border pt-4 text-center">
              <p className="text-sm text-marketplace-text-secondary">
                This listing had{" "}
                <strong>{tile.adjacentMineCount}</strong> suspicious{" "}
                {tile.adjacentMineCount === 1 ? "detail" : "details"}.
              </p>
            </div>
          )}
        </div>

        {!isGameOver && (
          <div className="border-t border-marketplace-border p-4 flex gap-3">
            {!isOpened && !isFlagged && (
              <button
                onClick={onLooksSafe}
                className="flex-1 py-2.5 bg-marketplace-success text-white font-semibold rounded-lg hover:bg-marketplace-success/90 transition-colors"
              >
                Looks safe
              </button>
            )}
            {isOpened && (
              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-marketplace-bg text-marketplace-text font-semibold rounded-lg hover:bg-marketplace-border transition-colors"
              >
                Close
              </button>
            )}
            {isFlagged && (
              <button
                onClick={onReport}
                className="flex-1 py-2.5 bg-marketplace-bg text-marketplace-text font-semibold rounded-lg hover:bg-marketplace-border transition-colors"
              >
                Unreport
              </button>
            )}
            {!isFlagged && (
              <button
                onClick={onReport}
                className="flex-1 py-2.5 bg-marketplace-danger text-white font-semibold rounded-lg hover:bg-marketplace-danger-dark transition-colors"
              >
                Report listing
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
