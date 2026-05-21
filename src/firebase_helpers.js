// ── Beni Jobs — Firebase Helpers ─────────────────────────────
// Real registration and login using Firestore
import { db, auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

// Register new user
export async function registerUser({ name, phone, district, role, password, bizName, bizType }) {
  // Use phone as fake email since Firebase Auth needs email format
  const fakeEmail = `${phone.replace(/\D/g,"")}@benijobs.app`;
  const cred = await createUserWithEmailAndPassword(auth, fakeEmail, password);
  const uid  = cred.user.uid;

  // Save user profile to Firestore
  await setDoc(doc(db, "users", uid), {
    name, phone, district, role,
    bizName:  bizName  || "",
    bizType:  bizType  || "",
    verified: false,
    createdAt: serverTimestamp(),
    uid,
  });

  return { uid, name, phone, district, role, verified: false, bizName };
}

// Login existing user
export async function loginUser(phone, password) {
  const fakeEmail = `${phone.replace(/\D/g,"")}@benijobs.app`;
  const cred = await signInWithEmailAndPassword(auth, fakeEmail, password);
  const uid  = cred.user.uid;

  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) throw new Error("User profile not found");
  return { uid, ...snap.data() };
}

// Post a new job
export async function postJob(jobData, user) {
  const { setDoc, doc, serverTimestamp } = await import("firebase/firestore");
  const id = `job_${Date.now()}`;
  await setDoc(doc(db, "jobs", id), {
    ...jobData,
    postedBy:  user.uid  || "",
    company:   user.bizName || user.name,
    district:  jobData.district,
    approved:  false,
    createdAt: serverTimestamp(),
  });
  return id;
}

// Logout
export async function logoutUser() {
  await signOut(auth);
}
