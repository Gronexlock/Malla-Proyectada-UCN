"use client";
import { CursoCard } from "@/components/curso-card";

export default function Page() {
  const curso = {
    codigo: "MAT101",
    asignatura: "Cálculo I",
    creditos: 4,
    prereq: [
      { codigo: "MAT001", asignatura: "Álgebra Básica" },
      { codigo: "MAT002", asignatura: "Trigonometría" },
    ],
  };

  return (
    <div className="flex p-16 gap-4">
      <CursoCard {...curso} onClick={() => alert("Click")} />
      <CursoCard {...curso} />
      <CursoCard {...curso} />
    </div>
  );
}
