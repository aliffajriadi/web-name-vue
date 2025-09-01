"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function GlobalLoader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 600); // kasih delay
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      {/* Loader bar di atas */}
      {loading && (
        <div className="fixed top-1 left-0 w-full h-1 bg-transparent z-[9999] antialiased container max-w-6xl mx-auto md:px-72">
          <div className="h-full bg-black animate-[loader_0.6s_ease-in-out_forwards]" />
        </div>
      )}

      {children}
    </>
  );
}
