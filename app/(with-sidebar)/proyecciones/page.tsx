"use client";

import ProyeccionesView from "@/components/proyecciones-view";
import { useUserStore } from "@/src/store/useUserStore";

export default function Page() {
  const { rut, selectedCarrera } = useUserStore();

  return <ProyeccionesView rut={rut} carrera={selectedCarrera.codigo} />;
}
