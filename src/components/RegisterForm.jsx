import { useState } from "react";
import { registerTourist } from "../api/client.js";

const initialForm = {
  fullName: "",
  passportOrIdNumber: "",
  nationality: "",
  phoneNumber: "",
  email: "",
  password: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  tripStartDate: "",
  tripEndDate: "",
  itinerarySummary: "",
};

/**
 * The registration form. On success, it hands the newly-created
 * digital ID back up to App via onRegistered — App decides what
 * screen to show next (the confirmation card).
 */
export default function RegisterForm({ onRegistered, onSwitchToLogin }) {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault(); // stop the browser's default full-page-reload form behavior
    setIsSubmitting(true);
    setError(null);

    try {
      const data = await registerTourist(form);
      onRegistered(data);
    } catch (err) {
      const message = err.response?.data?.error ?? "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <input
          className="input-field col-span-2"
          placeholder="Full name"
          required
          value={form.fullName}
          onChange={(e) => updateField("fullName", e.target.value)}
        />
        <input
          className="input-field"
          placeholder="Passport / ID number"
          required
          value={form.passportOrIdNumber}
          onChange={(e) => updateField("passportOrIdNumber", e.target.value)}
        />
        <input
          className="input-field"
          placeholder="Nationality"
          value={form.nationality}
          onChange={(e) => updateField("nationality", e.target.value)}
        />
        <input
          className="input-field"
          placeholder="Phone number"
          value={form.phoneNumber}
          onChange={(e) => updateField("phoneNumber", e.target.value)}
        />
        <input
          className="input-field"
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
        />
        <input
          className="input-field col-span-2"
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) => updateField("password", e.target.value)}
        />
        <input
          className="input-field"
          placeholder="Emergency contact name"
          value={form.emergencyContactName}
          onChange={(e) => updateField("emergencyContactName", e.target.value)}
        />
        <input
          className="input-field"
          placeholder="Emergency contact phone"
          value={form.emergencyContactPhone}
          onChange={(e) => updateField("emergencyContactPhone", e.target.value)}
        />
        <label className="col-span-1 text-xs text-muted">
          Trip start
          <input
            className="input-field mt-1"
            type="date"
            value={form.tripStartDate}
            onChange={(e) => updateField("tripStartDate", e.target.value)}
          />
        </label>
        <label className="col-span-1 text-xs text-muted">
          Trip end
          <input
            className="input-field mt-1"
            type="date"
            value={form.tripEndDate}
            onChange={(e) => updateField("tripEndDate", e.target.value)}
          />
        </label>
        <input
          className="input-field col-span-2"
          placeholder="Itinerary (e.g. Delhi -> Manali -> Leh)"
          value={form.itinerarySummary}
          onChange={(e) => updateField("itinerarySummary", e.target.value)}
        />
      </div>

      {error && (
        <p className="rounded-lg bg-critical/10 px-3 py-2 text-sm text-critical">{error}</p>
      )}

      <button type="submit" className="btn-primary" disabled={isSubmitting}>
        {isSubmitting ? "Creating your digital ID…" : "Register & create digital ID"}
      </button>

      <p className="text-center text-sm text-muted">
        Already registered?{" "}
        <button type="button" onClick={onSwitchToLogin} className="font-medium text-brand">
          Log in
        </button>
      </p>
    </form>
  );
}
