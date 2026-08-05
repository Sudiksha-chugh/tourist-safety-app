import { useState } from "react";
import { loginTourist } from "../api/client.js";

export default function LoginForm({ onLoggedIn, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const data = await loginTourist(email, password);
      onLoggedIn(data);
    } catch (err) {
      const message = err.response?.data?.error ?? "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="input-field"
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="input-field"
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <p className="rounded-lg bg-critical/10 px-3 py-2 text-sm text-critical">{error}</p>
      )}

      <button type="submit" className="btn-primary" disabled={isSubmitting}>
        {isSubmitting ? "Logging in…" : "Log in"}
      </button>

      <p className="text-center text-sm text-muted">
        New here?{" "}
        <button type="button" onClick={onSwitchToRegister} className="font-medium text-brand">
          Register
        </button>
      </p>
    </form>
  );
}
