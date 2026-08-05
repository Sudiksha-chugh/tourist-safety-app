import { useEffect, useState } from "react";
import SosButton from "./SosButton.jsx";
import { fetchRiskScore, sendLocationPing } from "../api/client.js";

const LEVEL_STYLES = {
  critical: { text: "text-critical", bg: "bg-critical/10", label: "Critical" },
  high: { text: "text-amber", bg: "bg-amber/10", label: "High" },
  medium: { text: "text-amber", bg: "bg-amber/10", label: "Medium" },
  low: { text: "text-brand", bg: "bg-brand/10", label: "Low" },
};

export default function HomeScreen({ tourist, onLogout }) {
  const [risk, setRisk] = useState(null);

  // Send a location ping shortly after the screen loads, then every
  // 60 seconds after that — this is what actually powers geofence
  // breach detection on the backend for this tourist while the app
  // is open.
  useEffect(() => {
    async function pingAndRefreshRisk() {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            await sendLocationPing(latitude, longitude);
          });
        }
        const riskData = await fetchRiskScore(tourist.id);
        setRisk(riskData);
      } catch (err) {
        console.error("Background ping/risk refresh failed:", err);
      }
    }

    pingAndRefreshRisk();
    const interval = setInterval(pingAndRefreshRisk, 60000);
    return () => clearInterval(interval);
  }, [tourist.id]);

  const style = risk ? LEVEL_STYLES[risk.level] ?? LEVEL_STYLES.low : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted">Welcome back</p>
          <h1 className="font-display text-lg font-semibold text-ink">
            {tourist.fullName.split(" ")[0]}
          </h1>
        </div>
        <button onClick={onLogout} className="text-xs font-medium text-muted underline">
          Log out
        </button>
      </div>

      {risk && (
        <div className={`card flex items-center justify-between px-4 py-3 ${style.bg}`}>
          <div>
            <p className="text-xs text-muted">Current risk level</p>
            <p className={`font-display text-sm font-semibold ${style.text}`}>
              {style.label}
            </p>
          </div>
          <span className={`font-mono text-lg font-semibold ${style.text}`}>
            {risk.score}
          </span>
        </div>
      )}

      <div className="flex flex-1 items-center justify-center py-6">
        <SosButton />
      </div>

      <p className="text-center text-[11px] text-muted">
        Your location is shared periodically with the control room while this
        app is open, to help detect risk zones automatically.
      </p>
    </div>
  );
}
