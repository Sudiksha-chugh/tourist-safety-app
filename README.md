# Tourist Safety — Tourist App

The consumer-facing app: register for a digital ID, log in, see your
live risk level, and press SOS in an emergency.

## Prerequisites

Your backend must be running on `http://localhost:4000` with CORS
enabled, and your dashboard (optional, separate app) runs on 5173 —
this app runs on a different port (5174) so all three can run together.

## Setup

```
npm install
npm run dev
```

Open the printed URL (`http://localhost:5174`).

## Flow to test

1. **Register** — fill the form, submit. You'll land on a confirmation
   screen showing your digital ID's hash and blockchain transaction —
   this is the real data from your backend + smart contract, not a mockup.
2. Click **Continue to login**, log in with the email/password you just
   registered with.
3. You'll land on the home screen: your current risk level (fetched
   live from `/risk-score`), and the big SOS button.
4. Your browser will ask for **location permission** — accept it. The
   app pings your location to the backend every 60 seconds in the
   background, which is what actually powers geofence detection.
5. Press the **SOS button** — it grabs your current location and sends
   it, then shows a confirmation. Check your backend or dashboard to
   confirm a real SOS alert was created.

## Notes on what's simplified for now

- Registration doesn't auto-login — you register, then log in
  separately. A production version might return a token directly from
  `/register` to skip that extra step; kept simple here on purpose.
- No "forgot password" flow, no email verification — out of scope for
  an MVP.
- Location pinging is straightforward foreground polling, not a proper
  background task — if the browser tab is closed, pinging stops. A
  native mobile app (React Native, etc.) would handle this differently,
  with real background location permissions.

## Project structure

```
src/
  App.jsx                    <- screen routing (register/login/confirmed/home)
  main.jsx                    <- React entry point
  api/client.js                 <- axios instance, token storage, API calls
  components/
    RegisterForm.jsx              <- registration form
    LoginForm.jsx                  <- login form
    DigitalIdCard.jsx               <- post-registration confirmation, shows blockchain data
    HomeScreen.jsx                   <- risk level + background location pings
    SosButton.jsx                     <- the SOS button itself
```
