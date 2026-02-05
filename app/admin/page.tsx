"use client";

import { useState, useEffect } from "react";
import Dashboard from "./Dashboard";

import { verifyAuth, setAuthToken } from "@/lib/api";

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedKey = localStorage.getItem("admin_api_key");
    if (savedKey) {
      setAuthToken(savedKey);
      verifyAuth()
        .then(() => {
          setIsAuth(true);
        })
        .catch(() => {
          localStorage.removeItem("admin_api_key");
          setAuthToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setTimeout(() => setLoading(false), 0);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    setAuthToken(key);
    try {
      await verifyAuth();
      localStorage.setItem("admin_api_key", key);
      setIsAuth(true);
    } catch {
      setError("Invalid Access Key");
      setAuthToken(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-white">
        Verifying credentials...
      </div>
    );
  }

  if (isAuth) {
    return (
      <Dashboard
        apiKey={localStorage.getItem("admin_api_key") || ""}
        onLogout={() => {
          localStorage.removeItem("admin_api_key");
          setAuthToken(null);
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
