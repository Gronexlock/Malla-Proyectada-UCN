"use client";

import { AvanceView } from "@/components/avance-view";
import CarreraSelect from "@/components/carrera-select";
import { useUserStore } from "@/src/store/useUserStore";

export default function Page() {
  const { rut, selectedCarrera } = useUserStore();

  return (
    <div className="p-4 flex flex-col gap-4">
      <CarreraSelect />
      <AvanceView carrera={selectedCarrera} rut={rut} />
    </div>
  );
}
