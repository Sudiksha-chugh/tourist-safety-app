import axios from "axios";

export const api = axios.create({
  baseURL: "https://tourist-safety-backend-tixp.onrender.com/api",
  headers: { "Content-Type": "application/json" },
});

const TOKEN_KEY = "tourist_safety_token";
const TOURIST_KEY = "tourist_safety_profile";

// localStorage persists data across page refreshes and browser
// restarts — unlike React state, which resets every time the page
// reloads. This is how the tourist stays "logged in" even if they
// close the tab and come back later.
export function saveSession(token, tourist) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOURIST_KEY, JSON.stringify(tourist));
}

export function getSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  const touristRaw = localStorage.getItem(TOURIST_KEY);
  if (!token || !touristRaw) return null;
  return { token, tourist: JSON.parse(touristRaw) };
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOURIST_KEY);
}

// An axios "interceptor" runs automatically before every single
// request this client sends — here, we use it to attach the saved
// token as an Authorization header, so every component that calls
// the API doesn't need to remember to do this manually each time.
api.interceptors.request.use((config) => {
  const session = getSession();
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

export async function registerTourist(payload) {
  const res = await api.post("/tourists/register", payload);
  return res.data;
}

export async function loginTourist(email, password) {
  const res = await api.post("/tourists/login", { email, password });
  return res.data;
}

export async function sendLocationPing(latitude, longitude) {
  const res = await api.post("/locations/ping", { latitude, longitude });
  return res.data;
}

export async function sendSos(latitude, longitude) {
  const res = await api.post("/locations/sos", { latitude, longitude });
  return res.data;
}

export async function fetchRiskScore(touristId) {
  const res = await api.get(`/tourists/${touristId}/risk-score`);
  return res.data;
}
export async function getShareLink() {
  const res = await api.post("/tourists/share-link");
  return res.data;
}
