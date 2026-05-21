import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./AppContext";

import WelcomeScreen,
{ RegisterScreen, LoginScreen, PendingScreen,
  HomeScreen, JobDetailScreen, PostJobScreen,
  SavedScreen, ProfileScreen } from "./screens/index";

import "./App.css";

function AuthRoute({ children }) {
  const { user } = useApp();
  return user ? <Navigate to="/home" replace /> : children;
}

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
