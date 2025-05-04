'use client';
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function RouteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const current = sessionStorage.getItem("currentPath");
    if (current) {
      sessionStorage.setItem("previousPath", current);
    }
    sessionStorage.setItem("currentPath", pathname);
  }, [pathname]);

  return null;
}