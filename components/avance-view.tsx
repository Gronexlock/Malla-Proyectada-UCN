import { CursoAvance, CursoMalla } from "@/src/types/curso";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { romanNumerals } from "@/src/constants/numerosRomanos";
import { useState, useEffect } from "react";
import { CursoAvanceCard } from "./curso-avance-card";
import { MallaSkeleton } from "./skeletons/malla-skeleton";
import { Carrera } from "@/src/types/carrera";
import CarreraSelect from "./carrera-select";

type AvanceViewProps = {
  carrera: Carrera;
  rut: string;
};

export function AvanceView({ carrera, rut }: AvanceViewProps) {
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
    return <MallaSkeleton nombreCarrera={carrera.nombre.toLocaleLowerCase()} />;
  }

  function getCursoStatus(codigo: string): CursoAvance["status"] | "PENDIENTE" {
    const cursoAvance = avance.filter((curso) => curso.course === codigo);
    if (cursoAvance.length === 0) return "PENDIENTE";
    if (cursoAvance.length === 1) return cursoAvance[0].status;
    else {
      const statuses = cursoAvance.map((curso) => curso.status);
      if (statuses.includes("APROBADO")) return "APROBADO";
      if (statuses.includes("INSCRITO")) return "INSCRITO";
      return "REPROBADO";
    }
  }

  const cursosPorNivel: Record<number, CursoMalla[]> = {};
  cursos.forEach((curso) => {
    if (!cursosPorNivel[curso.nivel]) {
      cursosPorNivel[curso.nivel] = [];
    }
    cursosPorNivel[curso.nivel].push(curso);
  });

  const cursosPorAnio: Record<number, number[]> = {};
  Object.keys(cursosPorNivel).forEach((level) => {
    const anio = Math.ceil(Number(level) / 2);
    if (!cursosPorAnio[anio]) cursosPorAnio[anio] = [];
    cursosPorAnio[anio].push(Number(level));
  });

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

                    {cursosPorNivel[level].map((course) => (
                      <CursoAvanceCard
                        key={course.codigo}
                        asignatura={course.asignatura}
                        codigo={course.codigo}
                        creditos={course.creditos}
                        status={getCursoStatus(course.codigo)}
                      />
                    ))}
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
