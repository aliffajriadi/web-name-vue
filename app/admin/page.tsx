"use client";

import { useState, useEffect } from "react";
import Dashboard from "./Dashboard";

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedKey = localStorage.getItem("admin_api_key");
    if (savedKey === "super-secret-key-123") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAuth(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (key === "super-secret-key-123") {
      // In production this would be validated against server
      localStorage.setItem("admin_api_key", key);
      setIsAuth(true);
      setError("");
    } else {
      setError("Invalid Access Key");
    }
  };

  if (isAuth) {
    return (
      <Dashboard
        apiKey={localStorage.getItem("admin_api_key") || ""}
        onLogout={() => {
          localStorage.removeItem("admin_api_key");
          setIsAuth(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-card border border-border p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Please enter your management key to continue.
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Access Key
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full bg-background border border-border rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••••••"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
}
