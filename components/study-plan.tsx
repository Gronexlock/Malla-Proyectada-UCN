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

  return (
    <ul>
      {cursos.map((course) => (
        <li key={course.codigo}>
          {course.asignatura} ({course.codigo}) - {course.creditos} credits
        </li>
      ))}
    </ul>
  );
}
