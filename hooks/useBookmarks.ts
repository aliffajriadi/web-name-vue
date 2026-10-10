"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const KEY = "bookmarks";
const listeners = new Set<() => void>();

const read = () => {
  try {
    return localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
};
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
};

/** Reading list stored in localStorage (slugs), synced across tabs and components. */
export function useBookmarks() {
  const raw = useSyncExternalStore(subscribe, read, () => "[]");
  const slugs = useMemo<string[]>(() => {
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }, [raw]);

  const toggle = useCallback((slug: string) => {
    let current: string[] = [];
    try {
      current = JSON.parse(read());
    } catch {}
    const next = current.includes(slug) ? current.filter((s) => s !== slug) : [slug, ...current];
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
    listeners.forEach((l) => l());
    return !current.includes(slug);
  }, []);

  return { slugs, has: (s: string) => slugs.includes(s), toggle };
}
