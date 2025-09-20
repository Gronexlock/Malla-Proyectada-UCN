"use client";

import { useUserStore } from "@/src/store/useUserStore";

export default function Page() {
  const { selectedCarrera } = useUserStore();
  return <div className="">Selected Carrera: {selectedCarrera?.nombre}</div>;
}
