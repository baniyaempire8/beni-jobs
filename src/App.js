import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./AppContext";

import WelcomeScreen   from "./screens/WelcomeScreen";
import RegisterScreen  from "./screens/RegisterScreen";
import LoginScreen     from "./screens/LoginScreen";
import PendingScreen   from "./screens/PendingScreen";
import HomeScreen      from "./screens/HomeScreen";
import JobDetailScreen from "./screens/JobDetailScreen";
import PostJobScreen   from "./screens/PostJobScreen";
import SavedScreen     from "./screens/SavedScreen";
import ProfileScreen   from "./screens/ProfileScreen";

import "./App.css";

// If user is logged in, redirect away from auth screens
function AuthRoute({ children }) {
  const { user } = useApp();
  return user ? <Navigate to="/home" replace /> : children;
}

// If user is NOT logged in, redirect to welcome
function ProtectedRoute({ children }) {
  const { user } = useApp();
  return user ? children : <Navigate to="/" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"         element={<AuthRoute><WelcomeScreen /></AuthRoute>} />
      <Route path="/register" element={<AuthRoute><RegisterScreen /></AuthRoute>} />
      <Route path="/login"    element={<AuthRoute><LoginScreen /></AuthRoute>} />
      <Route path="/pending"  element={<PendingScreen />} />
      <Route path="/home"     element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
      <Route path="/job/:id"  element={<ProtectedRoute><JobDetailScreen /></ProtectedRoute>} />
      <Route path="/post"     element={<ProtectedRoute><PostJobScreen /></ProtectedRoute>} />
      <Route path="/saved"    element={<ProtectedRoute><SavedScreen /></ProtectedRoute>} />
      <Route path="/profile"  element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
      <Route path="*"         element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app-shell">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
