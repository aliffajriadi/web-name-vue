"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/* ───────── Toasts ───────── */
type Toast = { id: number; kind: "success" | "error" | "info"; text: string };
const ToastCtx = createContext<(kind: Toast["kind"], text: string) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((kind: Toast["kind"], text: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, kind, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === "error" ? 6000 : 3200);
  }, []);
  const Icon = { success: CheckCircle2, error: XCircle, info: Info };
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[300] flex w-[min(92vw,380px)] flex-col gap-2" aria-live="polite">
        {toasts.map((t) => {
          const I = Icon[t.kind];
          return (
            <div
              key={t.id}
              role="status"
              className="pointer-events-auto flex items-start gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm shadow-xl animate-in slide-in-from-bottom-2 fade-in"
            >
              <I
                size={18}
                className={cn(
                  "mt-0.5 shrink-0",
                  t.kind === "success" && "text-[var(--accent)]",
                  t.kind === "error" && "text-red-500",
                )}
              />
              <span className="grow">{t.text}</span>
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}

/* ───────── Confirm dialog ───────── */
export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = "Confirm",
  danger,
  loading,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  body?: ReactNode;
  confirmLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[250] grid place-items-center p-4" role="alertdialog" aria-modal="true" aria-label={title}>
      <button className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-label="Cancel" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-2xl animate-in zoom-in-95 fade-in">
        <div className={cn("mb-4 grid h-10 w-10 place-items-center rounded-full", danger ? "bg-red-500/10 text-red-500" : "bg-muted")}>
          <AlertTriangle size={18} />
        </div>
        <h3 className="font-display text-xl">{title}</h3>
        {body && <p className="mt-2 text-sm text-muted-foreground">{body}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn-sm" onClick={onCancel} autoFocus>
            Cancel
          </button>
          <button className={cn("btn-sm", danger ? "danger" : "solid")} onClick={onConfirm} disabled={loading}>
            {loading ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────── Drawer ───────── */
export function Drawer({
  open,
  title,
  subtitle,
  onClose,
  footer,
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  footer: ReactNode;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex justify-end" role="dialog" aria-modal="true" aria-label={title}>
      <button className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" aria-label="Close" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-[640px] flex-col border-l border-border bg-background shadow-2xl animate-in slide-in-from-right duration-200">
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <div>
            <h2 className="font-display text-xl">{title}</h2>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <button onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-lg border border-border hover:bg-muted">
            <X size={16} />
          </button>
        </div>
        <div className="grow overflow-y-auto px-6 py-6">{children}</div>
        <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/40 px-6 py-4">{footer}</div>
      </div>
    </div>
  );
}

/* ───────── Form pieces ───────── */
export function Field({
  label,
  hint,
  required,
  children,
  counter,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  counter?: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-medium">
          {label}
          {required && <span className="ml-0.5 text-[var(--accent)]">*</span>}
        </span>
        {counter && <span className="font-mono text-[11px] text-muted-foreground">{counter}</span>}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3">
      <div>
        <div className="text-[13px] font-medium">{label}</div>
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors", checked ? "bg-[var(--accent)]" : "bg-border")}
      >
        <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", checked ? "left-[22px]" : "left-0.5")} />
      </button>
    </div>
  );
}

export function useDebounced<T>(value: T, ms = 200) {
  const [v, setV] = useState(value);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    t.current = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t.current);
  }, [value, ms]);
  return v;
}
