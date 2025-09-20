"use client";

import { AvanceView } from "@/components/avance-view";
import { useUserStore } from "@/src/store/useUserStore";

export default function Page() {
  const { rut, selectedCarrera } = useUserStore();

  return (
    <div className="">
      <AvanceView carrera={selectedCarrera} rut={rut} />
    </div>
  );
}
