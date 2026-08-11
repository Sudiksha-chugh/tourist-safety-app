import { useState } from "react";
import RegisterForm from "./components/RegisterForm.jsx";
import LoginForm from "./components/LoginForm.jsx";
import DigitalIdCard from "./components/DigitalIdCard.jsx";
import HomeScreen from "./components/HomeScreen.jsx";
import { saveSession, getSession, clearSession } from "./api/client.js";
import SharedStatus from "./components/SharedStatus.jsx";
// "screen" tracks which view we're on. This is a simple, honest
// approach for an app this size — a dedicated routing library
// (like react-router) becomes worth it once you have many distinct
// pages/URLs; for a handful of screens, plain state is clearer.
export default function App() {
  const existingSession = getSession();

  // Check if we're on a /shared/:token URL — this takes priority
  // over the normal login flow, since it's meant to work for anyone,
  // logged in or not.
  const sharedTokenMatch = window.location.pathname.match(/^\/shared\/(.+)$/);
  const sharedToken = sharedTokenMatch ? sharedTokenMatch[1] : null;

  const [screen, setScreen] = useState(
    sharedToken ? "shared" : existingSession ? "home" : "login"
  );

  const [session, setSession] = useState(existingSession);
  const [justRegistered, setJustRegistered] = useState(null);

  function handleRegistered(data) {
    setJustRegistered(data);
    setScreen("confirmed");
  }

  function handleLoggedIn(data) {
    saveSession(data.token, data.tourist);
    setSession({ token: data.token, tourist: data.tourist });
    setScreen("home");
  }

  function handleContinueFromConfirmation() {
    // Registration doesn't currently return a token directly — the
    // simplest honest flow is to send them to log in with the
    // credentials they just created.
    setScreen("login");
  }

  function handleLogout() {
    clearSession();
    setSession(null);
    setScreen("login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7v6c0 5.5 3.8 9.7 10 11 6.2-1.3 10-5.5 10-11V7l-10-5z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-display text-sm font-semibold text-ink">Tourist Safety</span>
        </div>

        {screen === "register" && (
          <div className="card p-6">
            <h1 className="font-display text-lg font-semibold text-ink">Create your digital ID</h1>
            <p className="mt-1 mb-5 text-sm text-muted">
              A few details, secured and tamper-evident for your trip.
            </p>
            <RegisterForm
              onRegistered={handleRegistered}
              onSwitchToLogin={() => setScreen("login")}
            />
          </div>
        )}

        {screen === "login" && (
          <div className="card p-6">
            <h1 className="font-display text-lg font-semibold text-ink">Welcome back</h1>
            <p className="mt-1 mb-5 text-sm text-muted">Log in to continue your trip.</p>
            <LoginForm
              onLoggedIn={handleLoggedIn}
              onSwitchToRegister={() => setScreen("register")}
            />
          </div>
        )}

        {screen === "confirmed" && justRegistered && (
          <div className="space-y-4">
            <DigitalIdCard
              tourist={justRegistered.tourist}
              digitalId={justRegistered.digitalId}
            />
            <button onClick={handleContinueFromConfirmation} className="btn-primary">
              Continue to login
            </button>
          </div>
        )}
{screen === "home" && session && (
          <HomeScreen tourist={session.tourist} onLogout={handleLogout} />
        )}

        {screen === "shared" && sharedToken && (
          <SharedStatus shareToken={sharedToken} />
        )}
      </div>
    </div>
  );
}
