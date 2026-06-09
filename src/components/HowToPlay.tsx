"use client";

export default function HowToPlay() {
  return (
    <div className="max-w-lg mx-auto px-4 pb-6">
      <details className="group">
        <summary className="cursor-pointer text-sm font-medium text-marketplace-text-secondary hover:text-marketplace-text transition-colors flex items-center gap-1.5">
          <span className="group-open:rotate-90 transition-transform text-xs">
            ▶
          </span>
          How to Play
        </summary>
        <div className="mt-3 p-4 bg-white/60 rounded-xl border border-marketplace-border text-sm text-marketplace-text-secondary space-y-3 leading-relaxed">
          <p>
            Each square is a marketplace listing. Some are scams.
          </p>
          <p>
            Open a listing and look for suspicious details: weird prices, odd
            seller names, delivery-only nonsense, brand new profiles, photos
            that do not match, and the traditional &ldquo;this is not a
            scam&rdquo;, which is usually a small siren wearing a hat.
          </p>
          <p>
            The number of suspicious details in a safe listing tells you how
            many scam listings are touching it.
          </p>
          <p>
            Report the scams. Clear the safe listings. Do not send a deposit to
            a man called LoungeKing_74.
          </p>
          <div className="pt-2 border-t border-marketplace-border space-y-1.5">
            <p>
              <strong>Desktop:</strong> Left click to inspect, right click to
              report.
            </p>
            <p>
              <strong>Mobile:</strong> Tap to inspect, use &ldquo;Report
              listing&rdquo; in the popover.
            </p>
            <p>
              <strong>Keyboard:</strong> Tab to navigate, Enter to inspect, F to
              report, Escape to close.
            </p>
          </div>
        </div>
      </details>
    </div>
  );
}
