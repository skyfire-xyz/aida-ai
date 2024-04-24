"use client";
import { useEffect } from "react";

export function DarkThemeWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.className = "dark bg-gray-900";
  });

  return <>{children}</>;
}
