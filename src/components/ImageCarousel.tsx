"use client";

import { useState } from "react";
import { MarketplaceListing } from "@/types/listing";

interface ImageCarouselProps {
  listing: MarketplaceListing;
}

export default function ImageCarousel({ listing }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  if (listing.imageFilenames.length === 0) {
    return <ImagePlaceholder />;
  }

  const currentImage = listing.imageFilenames[currentIndex];
  const src = `/listings/${currentImage}`;

  function handlePrev() {
    setCurrentIndex((prev) =>
      prev === 0 ? listing.imageFilenames.length - 1 : prev - 1
    );
    setHasError(false);
  }

  function handleNext() {
    setCurrentIndex((prev) =>
      prev === listing.imageFilenames.length - 1 ? 0 : prev + 1
    );
    setHasError(false);
  }

  return (
    <div className="relative w-full aspect-square bg-marketplace-bg rounded-lg overflow-hidden">
      {hasError ? (
        <ImagePlaceholder />
      ) : (
        <img
          src={src}
          alt={listing.title}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
          loading="lazy"
        />
      )}

      {listing.imageFilenames.length > 1 && !hasError && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors text-sm"
            aria-label="Previous photo"
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors text-sm"
            aria-label="Next photo"
          >
            ›
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {listing.imageFilenames.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentIndex(i);
                  setHasError(false);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentIndex ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ImagePlaceholder() {
  return (
    <div className="w-full aspect-square bg-marketplace-bg rounded-lg flex flex-col items-center justify-center p-4 text-center">
      <span className="text-4xl mb-2">📷</span>
      <p className="text-sm text-marketplace-text-secondary italic">
        Photo unavailable, which is honestly suspicious in its own little way.
      </p>
    </div>
  );
}
