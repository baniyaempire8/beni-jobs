import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [lang, setLang]           = useState("en");
  const [user, setUser]           = useState(null);
  const [saved, setSaved]         = useState([]);
  const [applied, setApplied]     = useState([]);
  const [locFilter, setLocFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");

  const toggleLang = () => setLang(l => l === "en" ? "np" : "en");
  const t = (en, np) => lang === "np" && np ? np : en;

  const toggleSave = (jobId) =>
    setSaved(prev => prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]);

  const applyToJob = (jobId) =>
    setApplied(prev => prev.includes(jobId) ? prev : [...prev, jobId]);

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
