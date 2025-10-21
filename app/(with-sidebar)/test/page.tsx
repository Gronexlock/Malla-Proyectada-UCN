"use client";

import { CursoAvance, CursoMalla } from "@/src/types/curso";
import { Trash2 } from "lucide-react";
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

  const proyecciones = [1, 2, 3, 4, 5, 6];

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-zinc-100 shadow border rounded-md w-64 ">
        <ul>
          {proyecciones.map((p) => (
            <div className="flex first:rounded-t-md justify-between items-center border-b border-zinc-300 last:border-0 last:rounded-b-md p-4 cursor-pointer transition-colors hover:bg-zinc-200">
              <li key={p} className="text-lg">
                Proyección {p}
              </li>
              <div className="flex rounded-full items-center justify-center hover:shadow p-2 hover:bg-red-200 transition-colors">
                <Trash2 size={16} className="text-red-600" />
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}
