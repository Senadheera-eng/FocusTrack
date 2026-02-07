// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "./components/AuthForm";

function App() {
  return (
    <Routes>
      {/* Root → login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Login */}
      <Route path="/login" element={<AuthForm isLogin={true} />} />

      {/* Register */}
      <Route path="/register" element={<AuthForm isLogin={false} />} />

      {/* Dashboard placeholder (after successful login) */}
      <Route
        path="/dashboard"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 max-w-3xl text-center border border-white/30">
              <h1 className="text-5xl font-bold text-indigo-800 mb-6">
                Welcome to FlowTrack Dashboard
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                You are logged in successfully!
              </p>
              <p className="text-lg text-gray-600">
                Task creation, time tracking & analytics will appear here
                soon...
              </p>
            </div>
          </div>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
