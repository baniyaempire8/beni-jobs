import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [lang, setLang]           = useState("en");   // "en" or "np"
  const [user, setUser]           = useState(null);   // null = not logged in
  const [saved, setSaved]         = useState([]);     // array of job IDs
  const [applied, setApplied]     = useState([]);     // array of job IDs
  const [locFilter, setLocFilter] = useState("all");  // district id or "all"
  const [catFilter, setCatFilter] = useState("all");  // category id or "all"

  // Toggle language EN ↔ NP
  const toggleLang = () => setLang(l => l === "en" ? "np" : "en");

  // Helper: return en or np string based on current language
  const t = (en, np) => lang === "np" && np ? np : en;

  // Save / unsave a job
  const toggleSave = (jobId) => {
    setSaved(prev =>
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };

  // Apply to a job
  const applyToJob = (jobId) => {
    if (!applied.includes(jobId)) {
      setApplied(prev => [...prev, jobId]);
    }
  };

  return (
    <AppContext.Provider value={{
      lang, toggleLang, t,
      user, setUser,
      saved, toggleSave,
      applied, applyToJob,
      locFilter, setLocFilter,
      catFilter, setCatFilter,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
