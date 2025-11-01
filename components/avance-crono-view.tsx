import { CursoAvance, CursoMalla } from "@/src/types/curso";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { useState, useEffect } from "react";
import { Carrera } from "@/src/types/carrera";
import { AvanceCronoSkeleton } from "./skeletons/avance-crono-skeleton";
import { formatPeriod } from "@/src/utils/semestre";
import { CursoCronoCard } from "./curso-crono-card";

type AvanceCronoViewProps = {
  carrera: Carrera;
  rut: string;
};

export function AvanceCronoView({ carrera, rut }: AvanceCronoViewProps) {
  const [cursos, setCursos] = useState<CursoMalla[]>([]);
  const [avance, setAvance] = useState<CursoAvance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!carrera || !rut) return;
      setLoading(true);

      try {
        const [cursosResponse, avanceResponse] = await Promise.all([
          fetch(`/api/mallas/?codigo=${carrera.codigo}-${carrera.catalogo}`),
          fetch(`/api/avance/?rut=${rut}&codCarrera=${carrera.codigo}`),
        ]);
        const [cursosData, avanceData] = await Promise.all([
          cursosResponse.json(),
          avanceResponse.json(),
        ]);
        setCursos(cursosData);
        setAvance(avanceData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setCursos([]);
        setAvance([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [carrera, rut]);

  if (loading) {
    return (
      <AvanceCronoSkeleton nombreCarrera={carrera.nombre.toLocaleLowerCase()} />
    );
  }

  function agruparPorSemestre(cursos: CursoAvance[]) {
    return cursos.reduce<Record<string, CursoAvance[]>>((acc, curso) => {
      const periodo = curso.period;
      if (!acc[periodo ?? ""]) {
        acc[periodo ?? ""] = [];
      }
      acc[periodo ?? ""].push(curso);
      return acc;
    }, {});
  }

  const cursosPorSemestre = agruparPorSemestre(avance);

  return (
    <ScrollArea className="w-full whitespace-nowrap h-[calc(100vh-64px)]">
      <div className="flex justify-center min-w-max gap-4 pb-6 pr-6">
        {Object.keys(cursosPorSemestre)
          .sort((a, b) => Number(a) - Number(b))
          .map((semestre) => (
            <div key={semestre} className="flex flex-col gap-2">
              <div className="bg-zinc-800 rounded-sm flex justify-center items-center mb-2">
                <h2 className="text-center text-white font-semibold">
                  {formatPeriod(semestre)}
                </h2>
              </div>
              <div className="flex flex-col gap-2">
                {cursosPorSemestre[semestre].map((curso) => (
                  <CursoCronoCard
                    key={curso.nrc}
                    nrc={curso.nrc ?? ""}
                    codigo={curso.course}
                    asignatura={
                      cursos.find((c) => c.codigo === curso.course)
                        ?.asignatura || ""
                    }
                    status={curso.status}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
