# 💼 Baniya Jobs
### Nepal's Job Platform — Started in Beni, Myagdi

---

## 🚀 How to Run This App

### Step 1 — Install Node.js
Download from: https://nodejs.org (choose LTS version)

### Step 2 — Open terminal, go to this folder
```
cd baniya-jobs
```

### Step 3 — Install packages
```
npm install
```

### Step 4 — Start the app
```
npm start
```
It will open in your browser at http://localhost:3000 ✅

---

## 🔥 Connect to Firebase (Real Database)

1. Go to https://console.firebase.google.com
2. Click "Add project" → name it "baniya-jobs"
3. Add a **Web App**
4. Copy the config keys
5. Open `src/firebase.js` and paste your keys there
6. In Firebase console, enable:
   - **Authentication** → Phone (for OTP login)
   - **Firestore Database** → for users and jobs
   - **Storage** → for CV/photo uploads

### Firestore Collections needed:
- `users` — each user document (name, phone, district, role, verified)
- `jobs` — each job posting (title, location, salary, etc.)
- `applications` — when someone applies

---

## 📱 Turn into Android App (Play Store)

Since you already have a Google Play Developer account:

### Option A — PWA (Easiest, free)
1. Run `npm run build`
2. Deploy to web hosting (Firebase Hosting is free)
3. Users can "Add to Home Screen" from Chrome — works like an app!

### Option B — Capacitor (Real APK for Play Store)
```
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Baniya Jobs" "com.baniyaempire.jobs"
npm run build
npx cap add android
npx cap sync
npx cap open android
```
Then in Android Studio → Build → Generate Signed APK → Upload to Play Store

---

## 📞 Your WhatsApp Contact
Currently set to: +1 667 289 7651
To change: search for "16672897651" and replace with your number

---

## 🗂️ Project Structure
```
baniya-jobs/
├── src/
│   ├── App.js           — Main app + routing
│   ├── App.css          — All styles
│   ├── AppContext.js    — Global state (user, language, saved jobs)
│   ├── firebase.js      — Firebase config (add your keys here)
│   ├── data/
│   │   ├── nepal.js     — All 77 districts of Nepal
│   │   └── jobs.js      — Sample jobs (replace with Firebase)
│   └── screens/
│       └── index.js     — All 9 screens
├── package.json
└── README.md
```

---

## 🧩 Screens
1. **Welcome** — Choose Job Seeker or Employer
2. **Register** — Name, phone, district, password
3. **Login** — Sign in
4. **Pending** — Waiting for verification
5. **Home** — Browse & filter jobs
6. **Job Detail** — Apply, save, WhatsApp
7. **Post Job** — Employers post jobs
8. **Saved/Applied** — Track applications
9. **Profile** — CV, settings, language

---

## 🌐 Languages
- English and Nepali (NP) toggle on every screen
- All 77 districts listed in both languages

---

Built with ❤️ for Baniya Empire · Beni, Myagdi, Nepal
