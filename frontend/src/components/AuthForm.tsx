// src/components/AuthForm.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface AuthFormProps {
  isLogin: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { state, login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      await login(email, password);
    } else {
      await register(email, password);
    }
    if (!state.error) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Glass card */}
        <div className="bg-white/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden animate-fade-in-up">
          {/* Colorful header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 py-12 px-10 text-center">
            <h2 className="text-4xl font-bold text-white tracking-tight drop-shadow-lg">
              {isLogin ? "Welcome Back" : "Join FlowTrack"}
            </h2>
            <p className="mt-4 text-lg text-white/90">
              {isLogin
                ? "Sign in to access your tasks & time tracker"
                : "Create your account and start being productive"}
            </p>
          </div>

          {/* Form section */}
          <div className="p-10 lg:p-12">
            {/* Error message */}
            {state.error && (
              <div className="mb-8 p-5 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-xl animate-shake">
                <p className="font-medium">{state.error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="peer w-full px-5 pt-8 pb-4 bg-white/50 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 placeholder-transparent text-gray-900 text-lg"
                  placeholder=" "
                />
                <label
                  htmlFor="email"
                  className="absolute left-5 top-3 text-base text-gray-500 transition-all duration-300 peer-placeholder-shown:top-6 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400 peer-focus:top-3 peer-focus:text-base peer-focus:text-purple-600 pointer-events-none"
                >
                  Email address
                </label>
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="peer w-full px-5 pt-8 pb-4 bg-white/50 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 placeholder-transparent text-gray-900 text-lg"
                  placeholder=" "
                />
                <label
                  htmlFor="password"
                  className="absolute left-5 top-3 text-base text-gray-500 transition-all duration-300 peer-placeholder-shown:top-6 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400 peer-focus:top-3 peer-focus:text-base peer-focus:text-purple-600 pointer-events-none"
                >
                  Password
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={state.loading}
                className={`w-full py-4 px-6 rounded-2xl text-white font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-xl ${
                  state.loading
                    ? "bg-purple-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                }`}
              >
                {state.loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <svg
                      className="animate-spin h-6 w-6 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </div>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Toggle link */}
            <div className="mt-10 text-center text-gray-700">
              {isLogin ? (
                <>
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-bold text-purple-700 hover:text-purple-900 transition-colors"
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-bold text-purple-700 hover:text-purple-900 transition-colors"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} FlowTrack • Built for Anka Technologies
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
