// ─────────────────────────────────────────────────────────────────
//  BANIYA JOBS — Firebase Configuration
//  Steps to get your keys:
//  1. Go to https://console.firebase.google.com
//  2. Create project "baniya-jobs"
//  3. Add a Web App
//  4. Copy the firebaseConfig object and paste below
//  5. Enable: Authentication (Phone), Firestore Database, Storage
// ─────────────────────────────────────────────────────────────────

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);

export const db      = getFirestore(app);
export const auth    = getAuth(app);
export const storage = getStorage(app);
export default app;
