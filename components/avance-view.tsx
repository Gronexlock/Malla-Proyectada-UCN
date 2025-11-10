import { CursoAvance, CursoMalla, Status } from "@/src/types/curso";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { romanNumerals } from "@/src/constants/numerosRomanos";
import { useState, useEffect } from "react";
import { CursoCard } from "./curso-card";
import { MallaSkeleton } from "./skeletons/malla-skeleton";
import { Carrera } from "@/src/types/carrera";
import {
  getCursosPorAnio,
  getCursosPorNivel,
  CursosPorAnio,
  CursosPorNivel,
  getCursoStatus,
} from "@/src/utils/curso";

type AvanceViewProps = {
  carrera: Carrera;
  rut: string;
};

export function AvanceView({ carrera, rut }: AvanceViewProps) {
  const [cursos, setCursos] = useState<CursoMalla[]>([]);
  const [avance, setAvance] = useState<CursoAvance[]>([]);
  const [loading, setLoading] = useState(true);
  const cursosPorNivel: CursosPorNivel = getCursosPorNivel(cursos);
  const cursosPorAnio: CursosPorAnio = getCursosPorAnio(cursosPorNivel);

  useEffect(() => {
    const fetchData = async () => {
      if (!carrera.codigo || !carrera.catalogo || !rut) return;
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
    return <MallaSkeleton nombreCarrera={carrera.nombre.toLocaleLowerCase()} />;
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap h-[calc(100vh-64px)]">
      <div className="flex justify-center min-w-max gap-4">
        {Object.keys(cursosPorAnio)
          .sort((a, b) => Number(a) - Number(b))
          .map((anio) => (
            <div key={anio} className="flex flex-col gap-2">
              <div className="rounded-sm text-center text-white font-bold mb-2 bg-zinc-800">
                Año {anio}
              </div>
              <div className="flex gap-4">
                {cursosPorAnio[Number(anio)].map((level) => (
                  <div key={level} className="flex flex-col gap-2">
                    <div className="bg-zinc-400 rounded-sm flex justify-center items-center mb-2">
                      <h2 className="text-center font-semibold">
                        {romanNumerals[level]}
                      </h2>
                    </div>

                    {cursosPorNivel[level].map((course) => {
                      return (
                        <CursoCard
                          key={course.codigo}
                          {...course}
                          status={getCursoStatus(course.codigo, avance)}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
