"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type FontSizeContextType = {
  isLargeFont: boolean;
  toggleFontSize: () => void;
};

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

export const FontSizeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLargeFont, setIsLargeFont] = useState(false);

  useEffect(() => {
    // Check local storage on mount
    const saved = localStorage.getItem("large-font");
    if (saved === "true") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLargeFont(true);
      document.documentElement.classList.add("text-large");
    }
  }, []);

  const toggleFontSize = () => {
    setIsLargeFont((prev) => {
      const next = !prev;
      localStorage.setItem("large-font", String(next));
      if (next) {
        document.documentElement.classList.add("text-large");
      } else {
        document.documentElement.classList.remove("text-large");
      }
      return next;
    });
  };

  return (
    <FontSizeContext.Provider value={{ isLargeFont, toggleFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (context === undefined) {
    throw new Error("useFontSize must be used within a FontSizeProvider");
  }
  return context;
};
