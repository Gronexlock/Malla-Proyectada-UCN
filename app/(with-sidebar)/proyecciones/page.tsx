"use client";

import { ProyeccionView } from "@/components/proyecciones-view";
import { useUserStore } from "@/src/store/useUserStore";

export default function Page() {
  const { proyecciones } = useUserStore();

  return (
    <main className="p-4">
      <ProyeccionView proyeccion={proyecciones[0]} />
    </main>
  );
}
