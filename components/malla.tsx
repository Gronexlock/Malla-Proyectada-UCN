"use client";

import { useState, useEffect } from "react";
import { CursoMalla, Malla } from "@/src/types/curso";
import { ScrollArea } from "@/components/ui/scroll-area"
import { CourseCard } from "@/components/course-card"

interface MallaProps extends Malla {}

export function MallaComponent({ codigo, catalogo }: MallaProps) {
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

    // Función para mapear estados de la API al CourseCard
  const mapStatus = (estadoApi?: string): "aprobado" | "pendiente" | "cursando" | "bloqueado" => {
    switch (estadoApi?.toLowerCase()) {
      case "aprobado":
        return "aprobado"
      case "cursando":
        return "cursando"
      case "bloqueado":
        return "bloqueado"
      default:
        return "pendiente"
    }
  }

  return (

    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-6 min-w-max p-4">
        {Object.keys(cursosPorNivel)
          .sort((a, b) => Number(a) - Number(b))
          .map((level) => (
            <div key={level} className="flex flex-col gap-4 min-w-[170px]">
              <h2 className="text-center font-semibold mb-2">Nivel {level}</h2>
              <ul>
                {cursosPorNivel[Number(level)].map((course) => (
                  <li key={course.codigo}>
                    {course.asignatura} ({course.codigo}) - {course.creditos}{" "}
                    credits
                  </li>
                ))}
              </ul>
            </div>
        ))}
      </div>
    </ScrollArea>
  );
}
