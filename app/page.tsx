"use client";

import { useEffect } from "react";
import LogoutButton from "@/components/logout-button";

export default function HomePage() {
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <LogoutButton />
      <h1>Página de Inicio</h1>
    </div>
  );
}
