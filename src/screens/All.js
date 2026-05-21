import { useState } from "react";
import { registerUser, loginUser, postJob, logoutUser } from "../firebase_helpers";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../AppContext";
import { PROVINCES, ALL_DISTRICTS, JOB_CATEGORIES } from "../data/nepal";
import { SAMPLE_JOBS } from "../data/sampleJobs";

const WA = "16672897651";

// ── Shared: Toast ────────────────────────────────────────────────
export function useToast() {
  const [msg, setMsg] = useState("");
  const show = (text) => { setMsg(text); setTimeout(() => setMsg(""), 2500); };
  const Toast = () => msg ? <div className="toast">{msg}</div> : null;
  return { show, Toast };
}

// ── Shared: TopBar ───────────────────────────────────────────────
export function TopBar({ title, backTo, right }) {
  const navigate = useNavigate();
  const { lang, toggleLang } = useApp();
  return (
    <div className="topbar">
      {backTo && <button className="topbar-back" onClick={() => navigate(backTo)}>‹</button>}
      <div className="topbar-title">{title}</div>
      {right ?? <button className="topbar-lang" onClick={toggleLang}>{lang === "en" ? "NP" : "EN"}</button>}
    </div>
  );
}

// ── Shared: BottomNav ────────────────────────────────────────────
export function BottomNav({ active }) {
  const navigate = useNavigate();
  const { saved, applied } = useApp();
  const items = [
    { id:"home",    path:"/home",    icon:"🏠", label:"Jobs"    },
    { id:"saved",   path:"/saved",   icon:"🔖", label:"Saved",   badge:saved.length   },
    { id:"post",    path:"/post",    icon:"➕", label:"Post"    },
    { id:"applied", path:"/saved",   icon:"📋", label:"Applied", badge:applied.length },
    { id:"profile", path:"/profile", icon:"👤", label:"Profile" },
  ];
  return (
    <div className="bottom-nav">
      {items.map(i => (
        <button key={i.id} className={`nav-item${active===i.id?" active":""}`} onClick={() => navigate(i.path)}>
          <span className="nav-icon">{i.icon}</span>
          <span className="nav-label">{i.label}</span>
          {i.badge > 0 && <span className="nav-badge">{i.badge}</span>}
        </button>
      ))}
    </div>
  );
}

// ── Shared: JobCard ──────────────────────────────────────────────
function JobCard({ job, onClick }) {
  const { lang, saved } = useApp();
  const loc = lang === "np" ? job.location_np : job.location_en;
  return (
    <div className="job-card" onClick={onClick}>
      <div className="job-logo" style={{ background: job.color + "22" }}>{job.logo}</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:4 }}>
          <div className="job-title">{job.title}</div>
          {job.urgent && <span className="badge badge-urgent" style={{ fontSize:9, flexShrink:0 }}>🔥 URGENT</span>}
        </div>
        <div className="job-company">{job.company}</div>
        <div className="job-location">📍 {loc}</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:5 }}>
          <span className="job-salary">{job.salary_en}</span>
          <span className="job-tag">{job.type}</span>
          {job.verified && <span className="badge badge-verified" style={{ fontSize:9 }}>✓ Verified</span>}
        </div>
        <div style={{ fontSize:10, color:"var(--muted)", marginTop:3 }}>
          👥 {job.applies} applied{saved.includes(job.id) ? " · 🔖 Saved" : ""}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  1. WELCOME
// ════════════════════════════════════════════════════════════════
export function WelcomeScreen() {
  const navigate = useNavigate();
  return (
    <div className="screen">
      <div style={{ background:"var(--navy)", flex:1, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"60px 24px 32px", textAlign:"center" }}>
        <div style={{ background:"rgba(244,168,35,.2)", width:84, height:84, borderRadius:22, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18, fontSize:38 }}>💼</div>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:".15em", color:"rgba(255,255,255,.4)", marginBottom:10 }}>BENI JOBS</div>
        <h1 style={{ fontSize:30, fontWeight:900, color:"#fff", lineHeight:1.2, marginBottom:10 }}>
          Nepal's <span style={{ color:"var(--gold)" }}>Job</span><br />Platform
        </h1>
        <p style={{ fontSize:13, color:"rgba(255,255,255,.5)", lineHeight:1.7, maxWidth:260, marginBottom:8 }}>
          Find jobs anywhere in Nepal — or hire the right people for your business.
        </p>
        <p style={{ fontSize:11, color:"rgba(255,255,255,.25)" }}>सुरु भयो म्याग्दी, बेनीबाट · नेपालभर</p>
      </div>
      <div style={{ padding:"24px 24px 44px", background:"#fff" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
          <div className="role-card" onClick={() => navigate("/register?role=jobseeker")}>
            <div style={{ fontSize:32, marginBottom:8 }}>🔍</div>
            <div style={{ fontSize:14, fontWeight:800, color:"var(--navy)" }}>Find a Job</div>
            <div style={{ fontSize:11, color:"var(--muted)", marginTop:3 }}>जागिर खोज्नुहोस्<br />Browse &amp; apply</div>
          </div>
          <div className="role-card" onClick={() => navigate("/register?role=employer")}>
            <div style={{ fontSize:32, marginBottom:8 }}>🏢</div>
            <div style={{ fontSize:14, fontWeight:800, color:"var(--navy)" }}>Post a Job</div>
            <div style={{ fontSize:11, color:"var(--muted)", marginTop:3 }}>जागिर पोस्ट गर्नुहोस्<br />Hire people</div>
          </div>
        </div>
        <button className="btn btn-outline btn-full" onClick={() => navigate("/login")}>Already registered? Sign In</button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  2. REGISTER
// ════════════════════════════════════════════════════════════════
export function RegisterScreen() {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const { show, Toast } = useToast();
  const role = new URLSearchParams(window.location.search).get("role") || "jobseeker";
  const [f, setF] = useState({ name:"", phone:"", district:"", bizName:"", password:"" });
  const set = (k,v) => setF(p => ({...p,[k]:v}));

  const submit = async () => {
    if (!f.name)       return show("Please enter your full name");
    if (!f.phone)      return show("Please enter your phone number");
    if (!f.district)   return show("Please select your district");
    if (f.password.length < 6) return show("Password must be at least 6 characters");
    if (role === "employer" && !f.bizName) return show("Please enter your business name");
    try {
      show("Creating account...");
      const userData = await registerUser({ name:f.name, phone:f.phone, district:f.district, role, password:f.password, bizName:f.bizName });
      setUser(userData);
      navigate("/pending");
    } catch(e) { show(e.message || "Registration failed. Try again."); }
  };

  return (
    <div className="screen">
      <Toast />
      <TopBar title={role === "employer" ? "Register as Employer" : "Create Account"} backTo="/" />
      <div className="scroll">
        <div className="card" style={{ background: role==="employer" ? "#FFF7ED" : "var(--warm)", border:`1.5px solid ${role==="employer"?"rgba(244,168,35,.3)":"var(--border)"}`, marginBottom:16 }}>
          <div style={{ fontSize:13, fontWeight:700, color:"var(--navy)", marginBottom:3 }}>
            {role === "employer" ? "🏢 Employer Account" : "🔍 Job Seeker Account"}
          </div>
          <div style={{ fontSize:11, color:"var(--muted)" }}>
            {role === "employer" ? "Register your business · Post jobs · Free to start" : "Register free · Get verified · Apply to any job in Nepal"}
          </div>
        </div>

        <div className="field"><label className="label">Full Name / पूरा नाम</label>
          <input className="input" placeholder="e.g. Hari Bahadur Thapa" value={f.name} onChange={e=>set("name",e.target.value)} /></div>
        <div className="field"><label className="label">Phone / फोन नम्बर</label>
          <input className="input" type="tel" placeholder="+977 98XXXXXXXX" value={f.phone} onChange={e=>set("phone",e.target.value)} /></div>
        <div className="field"><label className="label">District / जिल्ला</label>
          <select className="input" value={f.district} onChange={e=>set("district",e.target.value)}>
            <option value="">Select your district...</option>
            {PROVINCES.map(p => (
              <optgroup key={p.id} label={`${p.name} — ${p.np}`}>
                {p.districts.map(d => <option key={d.id} value={d.id}>{d.np} — {d.en}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
        {role === "employer" && (
          <div className="field"><label className="label">Business Name / व्यवसायको नाम</label>
            <input className="input" placeholder="e.g. My Hotel, My Shop, My Farm" value={f.bizName} onChange={e=>set("bizName",e.target.value)} /></div>
        )}
        <div className="field"><label className="label">Password / पासवर्ड</label>
          <input className="input" type="password" placeholder="Min 6 characters" value={f.password} onChange={e=>set("password",e.target.value)} /></div>

        <button className="btn btn-primary btn-full btn-lg" onClick={submit} style={{ marginTop:4 }}>Create Free Account</button>
        <div className="divider" style={{ margin:"14px 0" }}>or</div>
        <button className="btn btn-outline btn-full" onClick={() => navigate("/login")}>Sign In Instead</button>
        <p style={{ fontSize:10, color:"var(--muted)", textAlign:"center", marginTop:14, lineHeight:1.6 }}>
          Free forever for job seekers. Your account will be verified within 24 hours.
        </p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  3. LOGIN
// ════════════════════════════════════════════════════════════════
export function LoginScreen() {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const { show, Toast } = useToast();
  const [phone, setPhone] = useState("");
  const [pass, setPass]   = useState("");

  const login = async () => {
    if (!phone) return show("Please enter your phone number");
    if (!pass)  return show("Please enter your password");
    try {
      show("Signing in...");
      const userData = await loginUser(phone, pass);
      setUser(userData);
      navigate("/home");
    } catch(e) { show("Wrong phone or password. Try again."); }
  };
  const demoEmployer = () => {
    setUser({ name:"Ram Sharma", phone:"+16672897651", district:"myagdi", role:"employer", verified:true });
    navigate("/home");
  };

  return (
    <div className="screen">
      <Toast />
      <TopBar title="Sign In" backTo="/" />
      <div className="scroll" style={{ paddingTop:32 }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:36, marginBottom:10 }}>👋</div>
          <div style={{ fontSize:18, fontWeight:800, color:"var(--navy)" }}>Welcome back!</div>
          <div style={{ fontSize:12, color:"var(--muted)", marginTop:4 }}>Sign in to Beni Jobs</div>
        </div>
        <div className="field"><label className="label">Phone Number</label>
          <input className="input" type="tel" placeholder="+977 98XXXXXXXX" value={phone} onChange={e=>setPhone(e.target.value)} /></div>
        <div className="field"><label className="label">Password</label>
          <input className="input" type="password" placeholder="Your password" value={pass} onChange={e=>setPass(e.target.value)} /></div>
        <button className="btn btn-primary btn-full btn-lg" onClick={login}>Sign In</button>
        <div style={{ height:10 }} />
        <button className="btn btn-gold btn-full btn-lg" onClick={demoEmployer}>Demo — Sign in as Employer</button>
        <div style={{ textAlign:"center", marginTop:18, fontSize:12, color:"var(--muted)" }}>
          No account? <span style={{ color:"var(--sky)", cursor:"pointer", fontWeight:700 }} onClick={() => navigate("/")}>Register free</span>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  4. PENDING VERIFICATION
// ════════════════════════════════════════════════════════════════
export function PendingScreen() {
  const navigate = useNavigate();
  return (
    <div className="screen" style={{ justifyContent:"center", alignItems:"center", padding:"32px 24px", textAlign:"center" }}>
      <div style={{ width:90, height:90, background:"#FFF7ED", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:38, marginBottom:20, border:"2px solid rgba(244,168,35,.3)" }}>⏳</div>
      <h2 style={{ fontSize:22, fontWeight:800, color:"var(--navy)", marginBottom:10 }}>Verification Pending</h2>
      <p style={{ fontSize:13, color:"var(--muted)", lineHeight:1.75, maxWidth:280, marginBottom:24 }}>
        Our team will verify your account within <strong>24 hours</strong>. Once verified you can apply to jobs!
      </p>
      <div style={{ background:"var(--warm)", borderRadius:16, padding:18, width:"100%", marginBottom:20 }}>
        <div style={{ fontSize:11, fontWeight:700, color:"var(--muted)", marginBottom:10, textTransform:"uppercase", letterSpacing:".06em" }}>While you wait...</div>
        {[["📋","Browse available jobs across Nepal"],["🗺️","Filter by your district or location"],["💬","WhatsApp us if urgent"]].map(([icon,text]) => (
          <div key={text} style={{ display:"flex", alignItems:"center", gap:10, fontSize:13, marginBottom:8 }}>
            <span style={{ fontSize:20 }}>{icon}</span>{text}
          </div>
        ))}
      </div>
      <button className="btn btn-gold btn-full btn-lg" onClick={() => navigate("/home")} style={{ marginBottom:10 }}>Browse Jobs (Preview)</button>
      <a href={`https://wa.me/${WA}`} className="btn btn-wa btn-full btn-lg">💬 WhatsApp Us</a>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  5. HOME — Job Listings
// ════════════════════════════════════════════════════════════════
export function HomeScreen() {
  const navigate = useNavigate();
  const { user, lang, t, toggleLang, locFilter, setLocFilter, catFilter, setCatFilter } = useApp();
  const { show, Toast } = useToast();

  const jobs = SAMPLE_JOBS.filter(j =>
    (locFilter === "all" || j.district === locFilter) &&
    (catFilter === "all" || j.cat === catFilter)
  );

  const firstName = user?.name?.split(" ").slice(0,2).join(" ") || "Welcome";

  return (
    <div className="screen">
      <Toast />
      {/* App bar */}
      <div style={{ background:"var(--cream)", padding:"48px 20px 0", borderBottom:"1px solid var(--border)", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingBottom:8 }}>
          <div>
            <div style={{ fontSize:11, color:"var(--muted)", fontWeight:600 }}>नमस्ते 👋</div>
            <div style={{ fontSize:17, fontWeight:800, color:"var(--navy)" }}>{firstName}</div>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <span
              className={`badge ${user?.verified ? "badge-verified" : "badge-pending"}`}
              style={{ cursor:"pointer" }}
              onClick={() => show(user?.verified ? "✅ Your account is verified!" : "⏳ Verification usually takes 24 hours")}
            >
              {user?.verified ? "✅ Verified" : "⏳ Pending"}
            </span>
            <button className="topbar-lang" style={{ background:"var(--warm)", color:"var(--navy)", border:"1px solid var(--border)", borderRadius:20, padding:"5px 12px" }} onClick={toggleLang}>
              {lang === "en" ? "NP" : "EN"}
            </button>
          </div>
        </div>
        {/* Location filter */}
        <div style={{ marginBottom:6 }}>
          <div style={{ fontSize:10, fontWeight:700, color:"var(--muted)", marginBottom:5, textTransform:"uppercase", letterSpacing:".06em" }}>📍 {t("Filter by location","ठाउँ अनुसार खोज्नुहोस्")}</div>
          <div className="filter-row">
            {[
              {id:"all",       label:"🇳🇵 All Nepal"},
              {id:"myagdi",    label:"म्याग्दी (बेनी)"},
              {id:"kaski",     label:"कास्की (पोखरा)"},
              {id:"kathmandu", label:"काठमाडौँ"},
              {id:"chitwan",   label:"चितवन"},
              {id:"rupandehi", label:"रुपन्देही"},
              {id:"morang",    label:"मोरङ"},
              {id:"surkhet",   label:"सुर्खेत"},
              {id:"dang",      label:"दाङ"},
            ].map(l => (
              <span key={l.id} className={`chip${locFilter===l.id?" active":""}`} onClick={() => setLocFilter(l.id)}>{l.label}</span>
            ))}
          </div>
        </div>
        {/* Category filter */}
        <div style={{ marginBottom:4 }}>
          <div className="filter-row">
            {JOB_CATEGORIES.map(c => (
              <span key={c.id} className={`chip${catFilter===c.id?" active":""}`} onClick={() => setCatFilter(c.id)}>
                {c.emoji} {t(c.en,c.np)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="scroll">
        {jobs.length === 0
          ? <div className="empty-state"><div className="empty-icon">🔍</div><div className="empty-text">No jobs found.<br />Try "All Nepal" to see more.</div></div>
          : <>
              <div style={{ fontSize:12, color:"var(--muted)", fontWeight:600, marginBottom:10 }}>{jobs.length} job{jobs.length!==1?"s":""} found</div>
              {jobs.map(job => <JobCard key={job.id} job={job} onClick={() => navigate(`/job/${job.id}`)} />)}
            </>
        }
      </div>
      <BottomNav active="home" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  6. JOB DETAIL
// ════════════════════════════════════════════════════════════════
export function JobDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, lang, t, saved, toggleSave, applied, applyToJob } = useApp();
  const { show, Toast } = useToast();

  const job = SAMPLE_JOBS.find(j => j.id === id);
  if (!job) return <div className="screen"><div className="empty-state"><div className="empty-icon">😕</div><div className="empty-text">Job not found.</div></div></div>;

  const isSaved   = saved.includes(job.id);
  const isApplied = applied.includes(job.id);
  const loc = lang === "np" ? job.location_np : job.location_en;

  const handleApply = () => {
    if (!user?.verified) { show("⚠️ Your account needs to be verified first!"); return; }
    applyToJob(job.id);
    show("Application sent! ✅");
  };
  const handleSave = () => { toggleSave(job.id); show(isSaved ? "Removed from saved" : "Job saved! 🔖"); };

  return (
    <div className="screen">
      <Toast />
      <TopBar title={job.title} backTo="/home" right={
        <button onClick={handleSave} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:"#fff" }}>🔖</button>
      } />
      <div className="scroll" style={{ padding:0, paddingBottom:20 }}>
        {/* Header */}
        <div style={{ background:job.color+"18", padding:"24px 20px 18px", textAlign:"center" }}>
          <div style={{ fontSize:52, marginBottom:8 }}>{job.logo}</div>
          <div style={{ fontSize:20, fontWeight:800, color:"var(--navy)" }}>{t(job.title,job.np)}</div>
          <div style={{ fontSize:13, color:"var(--muted)", marginTop:3 }}>{job.company}</div>
          <div style={{ fontSize:12, color:"var(--sky)", fontWeight:700, marginTop:6 }}>📍 {loc}</div>
          <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:10, flexWrap:"wrap" }}>
            {job.verified && <span className="badge badge-verified">✓ Verified Employer</span>}
            {job.urgent   && <span className="badge badge-urgent">🔥 Urgent</span>}
          </div>
        </div>

        <div style={{ padding:"16px 20px" }}>
          <div className="stat-grid">
            <div className="stat-card"><div className="stat-num" style={{ fontSize:13 }}>{job.salary_en}</div><div className="stat-lbl">Salary/Month</div></div>
            <div className="stat-card"><div className="stat-num" style={{ fontSize:14 }}>{job.type}</div><div className="stat-lbl">Job Type</div></div>
          </div>
          <div style={{ background:"var(--warm)", borderRadius:12, padding:12, marginBottom:14, fontSize:12, color:"var(--navy)", fontWeight:600 }}>📍 {loc}</div>
          <div className="section-hd" style={{ marginTop:0 }}>About this Job</div>
          <p style={{ fontSize:13, color:"#374151", lineHeight:1.75, marginBottom:14 }}>{t(job.desc_en,job.desc_np)}</p>
          <div className="section-hd">Requirements</div>
          <div style={{ marginBottom:18 }}>
            {job.requirements.map((r,i) => (
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:8, padding:"7px 0", borderBottom:"1px solid var(--border)", fontSize:13 }}>
                <span style={{ color:"var(--green)", flexShrink:0 }}>✓</span>{r}
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:10, marginBottom:10 }}>
            {isApplied
              ? <div className="btn btn-outline btn-full" style={{ color:"var(--green)" }}>✅ Applied!</div>
              : <button className="btn btn-primary btn-full" onClick={handleApply}>📋 Apply Now</button>
            }
            <a href={job.contact_wa} className="btn btn-wa" style={{ flex:1, justifyContent:"center", textDecoration:"none" }}>💬 WhatsApp</a>
          </div>
          <button className="btn btn-outline btn-full" onClick={handleSave}>
            {isSaved ? "🔖 Saved — Tap to Unsave" : "🔖 Save for Later"}
          </button>
          <div style={{ fontSize:11, color:"var(--muted)", textAlign:"center", marginTop:10 }}>👥 {job.applies} people already applied</div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  7. POST JOB
// ════════════════════════════════════════════════════════════════
export function PostJobScreen() {
  const navigate = useNavigate();
  const { user } = useApp();
  const { show, Toast } = useToast();
  const [f, setF] = useState({ title:"", cat:"Hotel / Food", loc:"", district:"myagdi", salMin:"", salMax:"", type:"Full-time", desc:"", req:"", phone:"", urgent:false });
  const set = (k,v) => setF(p => ({...p,[k]:v}));

  const submit = () => {
    if (!f.title) return show("Please enter a job title");
    if (!f.loc)   return show("Please enter the exact location with a landmark");
    if (!f.desc)  return show("Please describe the job");
    if (!f.phone) return show("Please enter a contact phone number");
    if (!user?.verified) return show("⚠️ Account must be verified before posting");
    try {
      show("Submitting job...");
      await postJob({ title:f.title, cat:f.cat, locCustom:f.loc, district:f.district, salMin:f.salMin, salMax:f.salMax, type:f.type, desc:f.desc, req:f.req, phone:f.phone, urgent:f.urgent }, user);
      show("Job submitted! ✅ Will be reviewed and live in 2–4 hours.");
      setTimeout(() => navigate("/home"), 1800);
    } catch(e) { show("Failed to post job. Try again."); }
  };

  return (
    <div className="screen">
      <Toast />
      <TopBar title="Post a Job" backTo="/home" />
      <div className="scroll">
        {!user?.verified && (
          <div className="verify-box">
            <span style={{ fontSize:22 }}>⚠️</span>
            <div>
              <strong style={{ fontSize:13, color:"var(--navy)", display:"block", marginBottom:3 }}>Verification Required</strong>
              <span style={{ fontSize:11, color:"#92400E" }}>Your account must be verified before posting jobs. Usually within 24 hours.</span>
            </div>
          </div>
        )}
        <div className="field"><label className="label">Job Title</label>
          <input className="input" placeholder="e.g. Hotel Cook, Delivery Rider, Farm Worker" value={f.title} onChange={e=>set("title",e.target.value)} /></div>
        <div className="field"><label className="label">Category</label>
          <select className="input" value={f.cat} onChange={e=>set("cat",e.target.value)}>
            {["Hotel / Food","Rider / Driver","Tech / IT","Agriculture","Construction","Health","Teaching","Government","Other"].map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="label">📍 Exact Location (with landmark)</label>
          <input className="input" placeholder="e.g. Beni Bazaar, near Myagdi Bus Park" value={f.loc} onChange={e=>set("loc",e.target.value)} />
          <div style={{ fontSize:10, color:"var(--muted)", marginTop:4 }}>Be specific! Next to a hospital, school, chowk, bus park, etc.</div>
        </div>
        <div className="field"><label className="label">District</label>
          <select className="input" value={f.district} onChange={e=>set("district",e.target.value)}>
            {PROVINCES.map(p=>(
              <optgroup key={p.id} label={p.name}>
                {p.districts.map(d=><option key={d.id} value={d.id}>{d.np} — {d.en}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="field"><label className="label">Salary Range (NPR/month)</label>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <input className="input" placeholder="Min e.g. 15000" value={f.salMin} onChange={e=>set("salMin",e.target.value)} />
            <input className="input" placeholder="Max e.g. 25000" value={f.salMax} onChange={e=>set("salMax",e.target.value)} />
          </div>
        </div>
        <div className="field"><label className="label">Job Type</label>
          <select className="input" value={f.type} onChange={e=>set("type",e.target.value)}>
            {["Full-time","Part-time","Contract","Seasonal","Daily wage"].map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="field"><label className="label">Job Description</label>
          <textarea className="input" rows={4} placeholder="What will this person do? Working hours? Any benefits?" value={f.desc} onChange={e=>set("desc",e.target.value)} /></div>
        <div className="field"><label className="label">Requirements (one per line)</label>
          <textarea className="input" rows={3} placeholder={"Driving license\n2 years experience\nSmartphone"} value={f.req} onChange={e=>set("req",e.target.value)} /></div>
        <div className="field"><label className="label">Contact Phone</label>
          <input className="input" type="tel" placeholder="+977 98XXXXXXXX" value={f.phone} onChange={e=>set("phone",e.target.value)} /></div>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, padding:12, background:"var(--warm)", borderRadius:12 }}>
          <input type="checkbox" id="urgent" style={{ width:18, height:18, cursor:"pointer" }} checked={f.urgent} onChange={e=>set("urgent",e.target.checked)} />
          <label htmlFor="urgent" style={{ fontSize:13, fontWeight:600, cursor:"pointer", color:"var(--navy)" }}>🔥 Mark as URGENT hiring</label>
        </div>
        <button className="btn btn-gold btn-full btn-lg" onClick={submitJob}>📤 Post Job — Free</button>
        <p style={{ fontSize:10, color:"var(--muted)", textAlign:"center", marginTop:10 }}>
          Job reviewed by our team before publishing. Usually live within 2–4 hours.
        </p>
      </div>
      <BottomNav active="post" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  8. SAVED / APPLIED
// ════════════════════════════════════════════════════════════════
export function SavedScreen() {
  const navigate = useNavigate();
  const { saved, applied } = useApp();
  const [tab, setTab] = useState("saved");
  const savedJobs   = SAMPLE_JOBS.filter(j => saved.includes(j.id));
  const appliedJobs = SAMPLE_JOBS.filter(j => applied.includes(j.id));

  const MiniCard = ({ job, showApplied }) => (
    <div className="job-card" onClick={() => navigate(`/job/${job.id}`)}>
      <div className="job-logo" style={{ background:job.color+"22" }}>{job.logo}</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div className="job-title">{job.title}</div>
        <div className="job-company">{job.company}</div>
        <div className="job-location">📍 {job.location_en}</div>
        {showApplied
          ? <span className="badge badge-verified" style={{ marginTop:4 }}>✅ Applied</span>
          : <div className="job-salary" style={{ marginTop:4 }}>{job.salary_en}</div>
        }
      </div>
    </div>
  );

  return (
    <div className="screen">
      <TopBar title="My Jobs" backTo="/home" />
      <div className="scroll">
        <div className="tabs">
          <button className={`tab${tab==="saved"?" active":""}`} onClick={()=>setTab("saved")}>🔖 Saved ({savedJobs.length})</button>
          <button className={`tab${tab==="applied"?" active":""}`} onClick={()=>setTab("applied")}>📋 Applied ({appliedJobs.length})</button>
        </div>
        {tab === "saved" && (savedJobs.length === 0
          ? <div className="empty-state"><div className="empty-icon">🔖</div><div className="empty-text">No saved jobs yet.<br />Tap 🔖 on any job to save it.</div></div>
          : savedJobs.map(j => <MiniCard key={j.id} job={j} showApplied={false} />)
        )}
        {tab === "applied" && (appliedJobs.length === 0
          ? <div className="empty-state"><div className="empty-icon">📋</div><div className="empty-text">No applications yet.<br />Find and apply to jobs!</div></div>
          : appliedJobs.map(j => <MiniCard key={j.id} job={j} showApplied={true} />)
        )}
      </div>
      <BottomNav active="saved" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  9. PROFILE
// ════════════════════════════════════════════════════════════════
export function ProfileScreen() {
  const navigate = useNavigate();
  const { user, setUser, lang, toggleLang, saved, applied, t } = useApp();
  const { show, Toast } = useToast();
  const district = ALL_DISTRICTS.find(d => d.id === user?.district);

  const logout = async () => { show("Logging out..."); await logoutUser(); setUser(null); navigate("/"); };

  return (
    <div className="screen">
      <Toast />
      <TopBar title={t("My Profile","मेरो प्रोफाइल")} backTo="/home" />
      <div className="scroll">
        {/* Avatar */}
        <div style={{ textAlign:"center", marginBottom:20 }}>
          <div style={{ width:76, height:76, background:"var(--gold)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, margin:"0 auto 10px" }}>
            {user?.role === "employer" ? "🏢" : "👤"}
          </div>
          <div style={{ fontSize:19, fontWeight:800 }}>{user?.name}</div>
          <div style={{ fontSize:12, color:"var(--muted)", marginTop:2 }}>
            {district ? `${district.np} — ${district.en}` : "Nepal"}
          </div>
          <span className={`badge ${user?.verified?"badge-verified":"badge-pending"}`} style={{ marginTop:6 }}>
            {user?.verified ? "✅ Verified Account" : "⏳ Pending Verification"}
          </span>
        </div>

        {!user?.verified && (
          <div className="verify-box">
            <span style={{ fontSize:22 }}>📋</span>
            <div>
              <strong style={{ fontSize:13, color:"var(--navy)", display:"block", marginBottom:3 }}>Complete Verification</strong>
              <span style={{ fontSize:11, color:"#92400E" }}>Our team verifies accounts within 24 hrs. WhatsApp us to speed it up.</span>
            </div>
          </div>
        )}

        <div className="stat-grid">
          <div className="stat-card"><div className="stat-num">{saved.length}</div><div className="stat-lbl">Saved Jobs</div></div>
          <div className="stat-card"><div className="stat-num">{applied.length}</div><div className="stat-lbl">Applied</div></div>
        </div>

        <div className="section-hd" style={{ marginTop:0 }}>Account</div>
        {[
          {icon:"📋", label:t("My CV / Resume","मेरो CV"),        sub:t("Upload or build your CV","CV अपलोड गर्नुहोस्")},
          {icon:"🎓", label:t("Education","शिक्षा"),              sub:t("Add your qualifications","योग्यता थप्नुहोस्")},
          {icon:"💼", label:t("Work Experience","काम अनुभव"),     sub:t("Add past jobs","पुराना जागिर थप्नुहोस्")},
          {icon:"⚡", label:t("Skills","सीप"),                    sub:t("Add your skills","सीप थप्नुहोस्")},
          {icon:"🔔", label:t("Open to Work","काम खोज्दैछु"),     sub:t("Let employers find you","नियोक्ताले तपाईंलाई भेट्टाउन")},
        ].map(item => (
          <div key={item.label} className="menu-row">
            <div className="menu-icon">{item.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:600 }}>{item.label}</div>
              <div style={{ fontSize:11, color:"var(--muted)" }}>{item.sub}</div>
            </div>
            <span style={{ color:"var(--muted)", fontSize:18, marginLeft:"auto" }}>›</span>
          </div>
        ))}

        <div className="menu-row" onClick={toggleLang}>
          <div className="menu-icon">🌐</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:600 }}>{t("Language","भाषा")}</div>
            <div style={{ fontSize:11, color:"var(--muted)" }}>{lang==="en"?"English — tap for Nepali":"नेपाली — थिच्नुहोस् English"}</div>
          </div>
          <span style={{ color:"var(--muted)", fontSize:18, marginLeft:"auto" }}>›</span>
        </div>

        <div className="menu-row" onClick={logout}>
          <div className="menu-icon" style={{ background:"#FEE2E2" }}>🚪</div>
          <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:600, color:"var(--red)" }}>Log Out</div></div>
        </div>

        <div style={{ textAlign:"center", marginTop:20, padding:16, background:"var(--warm)", borderRadius:14, border:"1.5px solid var(--border)" }}>
          <div style={{ fontSize:13, fontWeight:800, color:"var(--navy)" }}>Beni Jobs</div>
          <div style={{ fontSize:10, color:"var(--muted)", marginTop:3 }}>बेनी, म्याग्दी, नेपाल 🏔️</div>
          <a href={`https://wa.me/${WA}`} style={{ display:"inline-block", marginTop:8, fontSize:11, color:"var(--sky)", fontWeight:600, textDecoration:"none" }}>💬 WhatsApp Support</a>
        </div>
      </div>
      <BottomNav active="profile" />
    </div>
  );
}
