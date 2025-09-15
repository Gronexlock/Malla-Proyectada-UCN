"use client";

import { useState, useEffect } from "react";
import { CursoMalla, Malla } from "@/src/types/curso";

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

  return (
    <div>
      {Object.keys(cursosPorNivel)
        .sort((a, b) => Number(a) - Number(b))
        .map((level) => (
          <div key={level} style={{ marginBottom: "1rem" }}>
            <h2>Nivel {level}</h2>
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
  );
}
