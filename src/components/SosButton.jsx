import { useState } from "react";
import { sendSos } from "../api/client.js";

/**
 * Gets the browser's current GPS location, wrapped as a Promise so
 * we can use it with async/await instead of the older callback style
 * the raw browser API expects.
 */
function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation isn't supported on this device"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
    });
  });
}

export default function SosButton() {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMessage, setErrorMessage] = useState(null);

  async function handlePress() {
    setStatus("sending");
    setErrorMessage(null);

    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      await sendSos(latitude, longitude);
      setStatus("sent");
    } catch (err) {
      setErrorMessage(
        err.message?.includes("Geolocation")
          ? "Turn on location access to send an SOS with your position."
          : "Couldn't send SOS. Check your connection and try again."
      );
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="card flex flex-col items-center gap-2 p-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 6L9 17l-5-5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="font-display text-base font-semibold text-ink">SOS sent</p>
        <p className="text-sm text-muted">
          Your location has been shared with the control room. Help is on the way.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-2 text-xs font-medium text-muted underline"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex items-center justify-center">
        {/* The pulsing rings — purely decorative, but they're what makes
            this read as "urgent / live" rather than just a static button */}
        <span className="absolute h-32 w-32 rounded-full bg-critical/30 animate-pulse-ring" />
        <span
          className="absolute h-32 w-32 rounded-full bg-critical/30 animate-pulse-ring"
          style={{ animationDelay: "0.5s" }}
        />
        <button
          onClick={handlePress}
          disabled={status === "sending"}
          className="relative flex h-32 w-32 flex-col items-center justify-center rounded-full
                     bg-critical text-white shadow-lg transition active:scale-95
                     disabled:opacity-80"
        >
          <span className="font-display text-2xl font-bold tracking-wide">
            {status === "sending" ? "…" : "SOS"}
          </span>
          <span className="mt-0.5 text-[11px] opacity-90">
            {status === "sending" ? "Sending" : "Press & hold"}
          </span>
        </button>
      </div>

      {errorMessage && (
        <p className="max-w-xs rounded-lg bg-critical/10 px-3 py-2 text-center text-sm text-critical">
          {errorMessage}
        </p>
      )}

      <p className="max-w-xs text-center text-xs text-muted">
        This will immediately share your live location with the tourist safety
        control room.
      </p>
    </div>
  );
}
