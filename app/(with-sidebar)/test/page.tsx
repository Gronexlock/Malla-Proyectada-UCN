"use client";

import { CursoAvance, CursoMalla } from "@/src/types/curso";
import { useEffect, useState } from "react";

export default function Page() {
  const [cursos, setCursos] = useState<CursoMalla[]>([]);
  const [avance, setAvance] = useState<CursoAvance[]>([]);
  const cursosUnicos: {
    [codigo: string]: { nombre: string; estados: string[] };
  } = {};
  const cursosSinNombre: string[] = [];

  useEffect(() => {
    const fetchData = async () => {
      const [cursosResponse, avanceResponse] = await Promise.all([
        fetch("/api/mallas/?codigo=8616-202310"),
        fetch("/api/avance/?rut=333333333&codCarrera=8616"),
      ]);
      const [cursosData, avanceData] = await Promise.all([
        cursosResponse.json(),
        avanceResponse.json(),
      ]);
      setCursos(cursosData);
      setAvance(avanceData);
    };
    fetchData();
  }, []);

  console.log("Total:", avance);
  console.log(
    "Aprobados:",
    avance.filter((c) => c.status === "APROBADO")
  );
  console.log(
    "Inscritos:",
    avance.filter((c) => c.status === "INSCRITO")
  );
  console.log(
    "Reprobados:",
    avance.filter((c) => c.status === "REPROBADO")
  );

  for (const curso of avance) {
    if (!cursosUnicos[curso.course]) {
      const nombre = cursos.find((c) => c.codigo === curso.course)?.asignatura;
      if (!nombre) cursosSinNombre.push(curso.course);
      cursosUnicos[curso.course] = {
        nombre: nombre ?? "Desconocido",
        estados: [curso.status],
      };
    } else {
      cursosUnicos[curso.course].estados.push(curso.status);
    }
  }
  console.log("Cursos únicos con estados:", cursosUnicos);

  console.log("Cursos sin nombre:", cursosSinNombre);

  return <h1>Test page</h1>;
}
