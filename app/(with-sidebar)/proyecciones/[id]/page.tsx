"use client";

import { ProyeccionView } from "@/components/proyeccion-view";
import { useUserStore } from "@/src/store/useUserStore";
import { useMemo } from "react";

export default function Page() {
  const { selectedCarrera } = useUserStore();
  const carreraMemo = useMemo(() => selectedCarrera, [selectedCarrera]);

  return <ProyeccionView id="2" carrera={carreraMemo} />;
}
