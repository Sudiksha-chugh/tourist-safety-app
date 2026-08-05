/**
 * Shown right after registration — this is where all the blockchain
 * work from earlier becomes something a real person can see and
 * understand, not just a curl response.
 */
export default function DigitalIdCard({ tourist, digitalId }) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 text-brand">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-sm font-medium">Digital ID confirmed</span>
      </div>

      <h2 className="mt-3 font-display text-xl font-semibold text-ink">
        Welcome, {tourist.fullName.split(" ")[0]}
      </h2>
      <p className="mt-1 text-sm text-muted">
        Your identity has been recorded and secured on the blockchain — tamper-evident
        for the duration of your trip.
      </p>

      <dl className="mt-5 space-y-3 border-t border-border pt-4">
        <div className="flex justify-between gap-4">
          <dt className="text-xs text-muted">Tourist ID</dt>
          <dd className="truncate font-mono text-xs text-ink">{tourist.id}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-xs text-muted">Record hash</dt>
          <dd className="truncate font-mono text-xs text-ink">{digitalId.recordHash}</dd>
        </div>
        {digitalId.blockchainTxHash && (
          <div className="flex justify-between gap-4">
            <dt className="text-xs text-muted">Blockchain tx</dt>
            <dd className="truncate font-mono text-xs text-brand">
              {digitalId.blockchainTxHash}
            </dd>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <dt className="text-xs text-muted">Status</dt>
          <dd className="text-xs font-medium text-brand">
            {digitalId.blockchainStatus === "confirmed" ? "Confirmed on-chain" : "Pending"}
          </dd>
        </div>
      </dl>
    </div>
  );
}
