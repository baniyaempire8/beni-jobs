import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy
} from "firebase/firestore";

const ADMIN_PASS = "HarHarMahadev$1";
const WA_BASE   = "https://wa.me/";

export default function AdminScreen() {
  const navigate  = useNavigate();
  const [authed,  setAuthed]  = useState(false);
  const [pass,    setPass]    = useState("");
  const [tab,     setTab]     = useState("users"); // users | jobs
  const [users,   setUsers]   = useState([]);
  const [jobs,    setJobs]    = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast,   setToast]   = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const login = () => {
    if (pass === ADMIN_PASS) { setAuthed(true); fetchAll(); }
    else showToast("❌ Wrong password!");
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const uSnap = await getDocs(query(collection(db, "users"), orderBy("createdAt", "desc")));
      setUsers(uSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      const jSnap = await getDocs(query(collection(db, "jobs"), orderBy("createdAt", "desc")));
      setJobs(jSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { showToast("Error loading data"); }
    setLoading(false);
  };

  const verifyUser = async (userId, currentVal) => {
    await updateDoc(doc(db, "users", userId), { verified: !currentVal });
    showToast(!currentVal ? "✅ User verified!" : "⚠️ Verification removed");
    fetchAll();
  };

  const approveJob = async (jobId, currentVal) => {
    await updateDoc(doc(db, "jobs", jobId), { approved: !currentVal });
    showToast(!currentVal ? "✅ Job approved!" : "⚠️ Job unapproved");
    fetchAll();
  };

  const deleteJob = async (jobId) => {
    if (window.confirm("Delete this job?")) {
      await deleteDoc(doc(db, "jobs", jobId));
      showToast("🗑️ Job deleted");
      fetchAll();
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm("Delete this user?")) {
      await deleteDoc(doc(db, "users", userId));
      showToast("🗑️ User deleted");
      fetchAll();
    }
  };

  const fmt = (ts) => {
    if (!ts) return "—";
    try { return new Date(ts.seconds * 1000).toLocaleDateString("en-NP"); }
    catch { return "—"; }
  };

  // ── Login screen ─────────────────────────────────────────────
  if (!authed) return (
    <div style={{ minHeight:"100vh", background:"var(--navy)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      {toast && <div className="toast">{toast}</div>}
      <div style={{ background:"#fff", borderRadius:20, padding:32, width:"100%", maxWidth:360, textAlign:"center" }}>
        <div style={{ fontSize:40, marginBottom:12 }}>🔐</div>
        <div style={{ fontSize:18, fontWeight:800, color:"var(--navy)", marginBottom:4 }}>Beni Jobs Admin</div>
        <div style={{ fontSize:12, color:"var(--muted)", marginBottom:24 }}>Only for Manoj Baniya</div>
        <input
          className="input" type="password" placeholder="Enter admin password"
          value={pass} onChange={e => setPass(e.target.value)}
          onKeyDown={e => e.key === "Enter" && login()}
          style={{ marginBottom:12 }}
        />
        <button className="btn btn-primary btn-full btn-lg" onClick={login}>Enter Admin Panel</button>
        <button className="btn btn-outline btn-full" onClick={() => navigate("/home")} style={{ marginTop:10 }}>← Back to App</button>
      </div>
    </div>
  );

  // ── Admin Panel ───────────────────────────────────────────────
  const pendingUsers = users.filter(u => !u.verified);
  const verifiedUsers = users.filter(u => u.verified);
  const pendingJobs = jobs.filter(j => !j.approved);
  const approvedJobs = jobs.filter(j => j.approved);

  return (
    <div style={{ minHeight:"100vh", background:"var(--cream)", fontFamily:"DM Sans, sans-serif" }}>
      {toast && <div className="toast">{toast}</div>}

      {/* Top bar */}
      <div style={{ background:"var(--navy)", padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50 }}>
        <div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,.5)", fontWeight:700 }}>BENI JOBS</div>
          <div style={{ fontSize:16, fontWeight:800, color:"#fff" }}>Admin Panel 🔐</div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={fetchAll} style={{ background:"rgba(255,255,255,.15)", border:"none", color:"#fff", padding:"6px 12px", borderRadius:20, cursor:"pointer", fontSize:12, fontWeight:700 }}>
            🔄 Refresh
          </button>
          <button onClick={() => navigate("/home")} style={{ background:"rgba(255,255,255,.15)", border:"none", color:"#fff", padding:"6px 12px", borderRadius:20, cursor:"pointer", fontSize:12, fontWeight:700 }}>
            ← App
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, padding:"12px 16px" }}>
        {[
          { num: pendingUsers.length, label:"⏳ Pending Users",   color:"#FEF3C7", tc:"#B45309" },
          { num: verifiedUsers.length,label:"✅ Verified Users",  color:"#D1FAE5", tc:"#059669" },
          { num: pendingJobs.length,  label:"📋 Pending Jobs",    color:"#FEE2E2", tc:"#DC2626" },
          { num: approvedJobs.length, label:"✅ Live Jobs",        color:"#DBEAFE", tc:"#1D4ED8" },
        ].map(s => (
          <div key={s.label} style={{ background:s.color, borderRadius:12, padding:"10px 8px", textAlign:"center" }}>
            <div style={{ fontSize:22, fontWeight:900, color:s.tc }}>{s.num}</div>
            <div style={{ fontSize:9, fontWeight:700, color:s.tc, lineHeight:1.3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", background:"#fff", borderBottom:"2px solid var(--border)", padding:"0 16px" }}>
        {[
          { id:"users", label:`👥 Users (${users.length})` },
          { id:"jobs",  label:`💼 Jobs (${jobs.length})`  },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding:"12px 16px", fontWeight:700, fontSize:13, border:"none", background:"none",
            borderBottom: tab===t.id ? "3px solid var(--navy)" : "3px solid transparent",
            color: tab===t.id ? "var(--navy)" : "var(--muted)", cursor:"pointer", fontFamily:"inherit"
          }}>{t.label}</button>
        ))}
      </div>

      {loading && <div style={{ textAlign:"center", padding:32, color:"var(--muted)" }}>Loading...</div>}

      <div style={{ padding:"12px 16px 80px" }}>

        {/* ── USERS TAB ── */}
        {tab === "users" && (
          <>
            {pendingUsers.length > 0 && (
              <>
                <div style={{ fontSize:13, fontWeight:800, color:"#DC2626", margin:"8px 0 10px", display:"flex", alignItems:"center", gap:6 }}>
                  ⏳ Needs Verification ({pendingUsers.length})
                </div>
                {pendingUsers.map(u => <UserCard key={u.id} u={u} onVerify={verifyUser} onDelete={deleteUser} fmt={fmt} />)}
              </>
            )}
            {verifiedUsers.length > 0 && (
              <>
                <div style={{ fontSize:13, fontWeight:800, color:"#059669", margin:"16px 0 10px" }}>✅ Verified ({verifiedUsers.length})</div>
                {verifiedUsers.map(u => <UserCard key={u.id} u={u} onVerify={verifyUser} onDelete={deleteUser} fmt={fmt} />)}
              </>
            )}
            {users.length === 0 && !loading && (
              <div style={{ textAlign:"center", padding:48, color:"var(--muted)" }}>
                <div style={{ fontSize:32 }}>👥</div>
                <div style={{ marginTop:8 }}>No users registered yet</div>
              </div>
            )}
          </>
        )}

        {/* ── JOBS TAB ── */}
        {tab === "jobs" && (
          <>
            {pendingJobs.length > 0 && (
              <>
                <div style={{ fontSize:13, fontWeight:800, color:"#DC2626", margin:"8px 0 10px" }}>
                  📋 Needs Approval ({pendingJobs.length})
                </div>
                {pendingJobs.map(j => <JobCard key={j.id} j={j} onApprove={approveJob} onDelete={deleteJob} fmt={fmt} />)}
              </>
            )}
            {approvedJobs.length > 0 && (
              <>
                <div style={{ fontSize:13, fontWeight:800, color:"#059669", margin:"16px 0 10px" }}>✅ Live Jobs ({approvedJobs.length})</div>
                {approvedJobs.map(j => <JobCard key={j.id} j={j} onApprove={approveJob} onDelete={deleteJob} fmt={fmt} />)}
              </>
            )}
            {jobs.length === 0 && !loading && (
              <div style={{ textAlign:"center", padding:48, color:"var(--muted)" }}>
                <div style={{ fontSize:32 }}>💼</div>
                <div style={{ marginTop:8 }}>No jobs posted yet</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── User Card ─────────────────────────────────────────────────
function UserCard({ u, onVerify, onDelete, fmt }) {
  const phone = u.phone?.replace(/\D/g,"") || "";
  return (
    <div style={{ background:"#fff", borderRadius:16, border:`2px solid ${u.verified?"#D1FAE5":"#FEE2E2"}`, padding:14, marginBottom:10 }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8 }}>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
            <div style={{ width:36, height:36, background:u.role==="employer"?"#FEF3C7":"var(--warm)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
              {u.role === "employer" ? "🏢" : "👤"}
            </div>
            <div>
              <div style={{ fontSize:14, fontWeight:700 }}>{u.name || "—"}</div>
              <div style={{ fontSize:11, color:"var(--muted)" }}>{u.role === "employer" ? "Employer" : "Job Seeker"} · {u.district || "—"}</div>
            </div>
          </div>
          {u.bizName && <div style={{ fontSize:11, color:"var(--sky)", fontWeight:600, marginBottom:3 }}>🏢 {u.bizName}</div>}
          <div style={{ fontSize:11, color:"var(--muted)" }}>📱 {u.phone || "—"} · Joined: {fmt(u.createdAt)}</div>
        </div>
        <span style={{ background: u.verified?"#D1FAE5":"#FEE2E2", color:u.verified?"#059669":"#DC2626", fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:20, flexShrink:0 }}>
          {u.verified ? "✅ Verified" : "⏳ Pending"}
        </span>
      </div>
      <div style={{ display:"flex", gap:8, marginTop:12 }}>
        <button onClick={() => onVerify(u.id, u.verified)} style={{
          flex:1, padding:"9px", borderRadius:10, border:"none", cursor:"pointer", fontWeight:700, fontSize:12, fontFamily:"inherit",
          background: u.verified ? "#FEE2E2" : "#D1FAE5",
          color: u.verified ? "#DC2626" : "#059669"
        }}>
          {u.verified ? "❌ Remove Verification" : "✅ Verify Now"}
        </button>
        {phone && (
          <>
            <a href={`tel:+${phone}`} style={{ padding:"9px 14px", borderRadius:10, background:"var(--warm)", border:"none", cursor:"pointer", fontSize:16, textDecoration:"none" }}>📞</a>
            <a href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer" style={{ padding:"9px 14px", borderRadius:10, background:"#D1FAE5", border:"none", cursor:"pointer", fontSize:16, textDecoration:"none" }}>💬</a>
          </>
        )}
        <button onClick={() => onDelete(u.id)} style={{ padding:"9px 14px", borderRadius:10, background:"#FEE2E2", border:"none", cursor:"pointer", fontSize:16 }}>🗑️</button>
      </div>
    </div>
  );
}

// ── Job Card ──────────────────────────────────────────────────
function JobCard({ j, onApprove, onDelete, fmt }) {
  const phone = j.phone?.replace(/\D/g,"") || "";
  return (
    <div style={{ background:"#fff", borderRadius:16, border:`2px solid ${j.approved?"#D1FAE5":"#FEE2E2"}`, padding:14, marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, marginBottom:8 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14, fontWeight:700 }}>{j.title || "—"}</div>
          <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>{j.company || j.bizName || "—"} · {j.cat || "—"}</div>
          <div style={{ fontSize:11, color:"var(--sky)", fontWeight:600, marginTop:2 }}>📍 {j.locCustom || j.location_en || "—"}</div>
          <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>💰 {j.salMin && j.salMax ? `NPR ${j.salMin}–${j.salMax}` : j.salary_en || "—"} · {j.type || "—"}</div>
          <div style={{ fontSize:10, color:"var(--muted)", marginTop:2 }}>Posted: {fmt(j.createdAt)}</div>
        </div>
        <span style={{ background:j.approved?"#D1FAE5":"#FEE2E2", color:j.approved?"#059669":"#DC2626", fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:20, flexShrink:0 }}>
          {j.approved ? "✅ Live" : "⏳ Pending"}
        </span>
      </div>
      {j.desc && <div style={{ fontSize:12, color:"#374151", lineHeight:1.6, marginBottom:10, padding:10, background:"var(--warm)", borderRadius:10 }}>{j.desc.substring(0,150)}{j.desc.length>150?"...":""}</div>}
      <div style={{ display:"flex", gap:8 }}>
        <button onClick={() => onApprove(j.id, j.approved)} style={{
          flex:1, padding:"9px", borderRadius:10, border:"none", cursor:"pointer", fontWeight:700, fontSize:12, fontFamily:"inherit",
          background: j.approved ? "#FEE2E2" : "#D1FAE5",
          color: j.approved ? "#DC2626" : "#059669"
        }}>
          {j.approved ? "❌ Unpublish" : "✅ Approve & Publish"}
        </button>
        {phone && (
          <>
            <a href={`tel:+${phone}`} style={{ padding:"9px 14px", borderRadius:10, background:"var(--warm)", fontSize:16, textDecoration:"none" }}>📞</a>
            <a href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer" style={{ padding:"9px 14px", borderRadius:10, background:"#D1FAE5", fontSize:16, textDecoration:"none" }}>💬</a>
          </>
        )}
        <button onClick={() => onDelete(j.id)} style={{ padding:"9px 14px", borderRadius:10, background:"#FEE2E2", border:"none", cursor:"pointer", fontSize:16 }}>🗑️</button>
      </div>
    </div>
  );
}
