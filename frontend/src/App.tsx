// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import Dashboard from "./pages/Dashboard";
import MyTasksPage from "./pages/MyTasksPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import { useAuth } from "./context/AuthContext";
import type { JSX } from "react";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { state } = useAuth();
  return state.isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      {/* Root → login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Login */}
      <Route path="/login" element={<AuthForm isLogin={true} />} />

      {/* Register */}
      <Route path="/register" element={<AuthForm isLogin={false} />} />

      {/* Protected pages */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-tasks"
        element={
          <ProtectedRoute>
            <MyTasksPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
