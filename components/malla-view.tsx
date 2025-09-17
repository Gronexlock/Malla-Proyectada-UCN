"use client";

import { useState, useEffect } from "react";
import { CursoMalla, Malla } from "@/src/types/curso";
import { ScrollArea } from "./ui/scroll-area";
import { CursoMallaCard } from "./curso-malla-card";

export function MallaView({ codigo, catalogo }: Malla) {
  const [cursos, setCursos] = useState<CursoMalla[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMalla = async () => {
      try {
        const response = await fetch(
          `/api/mallas?codigo=${codigo}-${catalogo}`
        );
        const data = await response.json();

        data.sort((a: CursoMalla, b: CursoMalla) => a.nivel - b.nivel);

        if (!response.ok) {
          throw new Error(data.error);
        }

        setCursos(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMalla();
  }, [codigo, catalogo]);

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  const cursosPorNivel: Record<number, CursoMalla[]> = {};
  cursos.forEach((curso) => {
    if (!cursosPorNivel[curso.nivel]) {
      cursosPorNivel[curso.nivel] = [];
    }
    cursosPorNivel[curso.nivel].push(curso);
  });

  const romanNumerals = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
  ];

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex min-w-max p-4 gap-4">
        {Object.keys(cursosPorNivel)
          .sort((a, b) => Number(a) - Number(b))
          .map((level) => (
            <div key={level} className="flex flex-col gap-4">
              <h2 className="text-center font-semibold mb-2">
                {romanNumerals[Number(level) - 1]}
              </h2>

              {cursosPorNivel[Number(level)].map((course) => (
                <CursoMallaCard
                  key={course.codigo}
                  asignatura={course.asignatura}
                  codigo={course.codigo}
                  creditos={course.creditos}
                  nivel={course.nivel}
                  prereq={course.prereq}
                />
              ))}
            </div>
          ))}
      </div>
    </ScrollArea>
  );
}
