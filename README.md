# 💼 Baniya Jobs
### Nepal's Job Platform — Started in Beni, Myagdi 🏔️

---

## ⚡ Run Locally (Test on your computer)

```bash
# Step 1 — Install packages
npm install

# Step 2 — Create your environment file
cp .env.example .env.local
# Open .env.local and fill in your Firebase keys

# Step 3 — Start the app
npm start
# Opens at http://localhost:3000 ✅
```

---

## 🔥 Firebase Setup (5 minutes)

1. Go to https://console.firebase.google.com
2. **Create project** → name it `baniya-jobs`
3. Click **Add app** → Web `</>`  → name it `baniya-jobs-web`
4. Copy the `firebaseConfig` values into your `.env.local` file
5. In Firebase console, enable these:
   - **Authentication** → Email/Password (for now)
   - **Firestore Database** → Start in test mode
   - **Storage** → Start in test mode

---

## 🚀 Deploy to Vercel (Free — 3 minutes)

1. Push this code to GitHub
2. Go to https://vercel.com → **New Project**
3. Import your GitHub repo
4. Add your Firebase keys under **Environment Variables**
5. Click **Deploy** → your app is LIVE! ✅

---

## 🌐 Connect your domain (jobs.benidash.com)

In Vercel:
1. Go to your project → **Settings** → **Domains**
2. Type `jobs.benidash.com` → Add
3. Vercel gives you a DNS record
4. Go to your domain registrar (GoDaddy etc.)
5. Add the DNS record → Live in 10 minutes!

---

## 📁 Project Structure

```
baniya-jobs/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── index.js          ← Entry point
│   ├── App.js            ← Routing
│   ├── App.css           ← All styles
│   ├── AppContext.js      ← Global state
│   ├── firebase.js        ← Firebase config
│   ├── data/
│   │   ├── nepal.js       ← All 77 districts
│   │   └── sampleJobs.js  ← Sample jobs
│   └── screens/
│       └── All.js         ← All 9 screens
├── .env.example           ← Copy to .env.local
├── .gitignore             ← Keeps secrets safe
└── package.json
```

---

## 📱 Screens
1. **Welcome** — Job Seeker or Employer
2. **Register** — Name, phone, district
3. **Login** — Sign in
4. **Pending** — Waiting for verification
5. **Home** — Browse & filter jobs
6. **Job Detail** — Apply, save, WhatsApp
7. **Post Job** — Employers post jobs
8. **Saved/Applied** — Track your jobs
9. **Profile** — CV, skills, open to work

---

## 🗺️ Locations
All 77 districts of Nepal included, grouped by province.
Jobs have specific landmark-based locations (e.g. "next to Myagdi Bus Park").

---

## 📞 Contact / Support
WhatsApp: +1 667 289 7651

---

Built with ❤️ — Baniya Empire · बेनी, म्याग्दी, नेपाल
