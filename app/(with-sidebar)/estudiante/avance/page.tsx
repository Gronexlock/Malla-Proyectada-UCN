"use client";

import { AvanceView } from "@/components/avance-view";
import { useUserStore } from "@/src/store/useUserStore";

export default function Page() {
  const { rut, selectedCarrera } = useUserStore();

  return (
    <div className="p-4">
      <AvanceView
        codigo={selectedCarrera.codigo}
        catalogo={selectedCarrera.catalogo}
        rut={rut}
      />
    </div>
  );
}
