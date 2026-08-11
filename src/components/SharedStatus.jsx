import { useEffect, useState } from "react";
import { api } from "../api/client.js";

const STATUS_STYLES = {
  sos: { bg: "bg-critical/10", text: "text-critical", label: "SOS — Needs immediate help" },
  alert: { bg: "bg-amber/10", text: "text-amber", label: "Alert — Situation being monitored" },
  safe: { bg: "bg-brand/10", text: "text-brand", label: "Safe" },
};

/**
 * The public page a family member lands on via a share link. No
 * login required — this calls the public /shared/:token endpoint
 * directly, which deliberately exposes only minimal, non-sensitive
 * status information.
 */
export default function SharedStatus({ shareToken }) {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/tourists/shared/${shareToken}`);
        setStatus(res.data);
      } catch (err) {
        setError("This share link isn't valid or has expired.");
      }
    }
    load();
    // Refresh every 15 seconds so family sees a genuinely live status,
    // not a one-time snapshot from whenever they first opened the link.
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [shareToken]);

  if (error) {
    return (
      <div className="card p-6 text-center">
        <p className="text-sm text-critical">{error}</p>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="card p-6 text-center">
        <p className="text-sm text-muted">Loading status…</p>
      </div>
    );
  }

  const style = STATUS_STYLES[status.status] ?? STATUS_STYLES.safe;

  return (
    <div className="card p-6">
      <p className="text-xs text-muted">Live trip status</p>
      <h1 className="mt-1 font-display text-xl font-semibold text-ink">
        {status.fullName}
      </h1>

      <div className={`mt-4 rounded-xl px-4 py-3 ${style.bg}`}>
        <p className={`font-display text-sm font-semibold ${style.text}`}>{style.label}</p>
      </div>

      {status.lastKnownLocation ? (
        <div className="mt-4 space-y-1 border-t border-border pt-4">
          <p className="text-xs text-muted">Last known location</p>
          <p className="font-mono text-xs text-ink">
            {status.lastKnownLocation.latitude.toFixed(4)}, {status.lastKnownLocation.longitude.toFixed(4)}
          </p>
          <p className="text-[11px] text-muted">
            Updated {new Date(status.lastKnownLocation.recorded_at).toLocaleString()}
          </p>
        </div>
      ) : (
        <p className="mt-4 text-xs text-muted">No location data yet.</p>
      )}

      <p className="mt-4 text-[11px] text-muted">
        This page updates automatically. No login required.
      </p>
    </div>
  );
}