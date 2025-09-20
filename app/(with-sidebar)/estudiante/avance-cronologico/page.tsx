"use client";

import { AvanceCronoView } from "@/components/avance-crono-view";
import CarreraSelect from "@/components/carrera-select";
import { useUserStore } from "@/src/store/useUserStore";

export default function Page() {
  const { rut, selectedCarrera } = useUserStore();

  return (
    <div className="p-4 ">
      <AvanceCronoView carrera={selectedCarrera} rut={rut} />
    </div>
  );
}
