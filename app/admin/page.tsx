"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Eye, EyeOff, Lock } from "lucide-react";
import Dashboard from "./Dashboard";
import { ToastProvider } from "@/components/admin/ui";
import { verifyAuth, setAuthToken } from "@/lib/api";

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [savedKey, setSavedKey] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("admin_api_key");
    if (!stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }
    setAuthToken(stored);
    verifyAuth()
      .then(() => {
        setSavedKey(stored);
        setIsAuth(true);
      })
      .catch(() => {
        localStorage.removeItem("admin_api_key");
        setAuthToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    setAuthToken(key);
    try {
      await verifyAuth();
      localStorage.setItem("admin_api_key", key);
      setSavedKey(key);
      setIsAuth(true);
    } catch {
      setError("That key didn’t work. Check it and try again.");
      setAuthToken(null);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center text-muted-foreground">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (isAuth) {
    return (
      <ToastProvider>
        <Dashboard
          apiKey={savedKey}
          onLogout={() => {
            localStorage.removeItem("admin_api_key");
            setAuthToken(null);
            setIsAuth(false);
            setKey("");
          }}
        />
      </ToastProvider>
    );
  }

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={14} /> Back to site
        </Link>
        <div className="rounded-3xl border border-border bg-card p-7 shadow-xl">
          <div className="mb-5 grid h-11 w-11 place-items-center rounded-full bg-[var(--lime)] text-[color:var(--lime-ink)]">
            <Lock size={18} />
          </div>
          <h1 className="font-display text-3xl">Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">Enter your access key to manage the site.</p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="field-input !pr-11"
                placeholder="Access key"
                aria-label="Access key"
                autoComplete="current-password"
                autoFocus
                required
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Hide key" : "Show key"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && (
              <p role="alert" className="text-sm text-red-500">
                {error}
              </p>
            )}
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting && <Loader2 size={15} className="animate-spin" />} Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
