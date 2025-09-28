import { CursoAvance, CursoMalla } from "@/src/types/curso";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { romanNumerals } from "@/src/constants/numerosRomanos";
import { useState, useEffect } from "react";
import { CursoAvanceCard } from "./curso-avance-card";
import { ProyeccionContainer } from "./proyeccion-container";
import { MallaSkeleton } from "./skeletons/malla-skeleton";
import { Carrera } from "@/src/types/carrera";
import { cn } from "@/lib/utils";
import { get } from "http";

type CrearProyeccionViewProps = {
  carrera: Carrera;
  rut: string;
};

export function CrearProyeccionView({
  carrera,
  rut,
}: CrearProyeccionViewProps) {
  const [cursos, setCursos] = useState<CursoMalla[]>([]);
  const [avance, setAvance] = useState<CursoAvance[]>([]);
  const [loading, setLoading] = useState(true);
  const [proyeccion, setProyeccion] = useState<CursoMalla[]>([]);

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
    if (cursoAvance.length === 1) {
      if (cursoAvance[0].status !== "REPROBADO") return "APROBADO";
      return "REPROBADO";
    } else {
      const statuses = cursoAvance.map((curso) => curso.status);
      if (statuses.includes("APROBADO") || statuses.includes("INSCRITO"))
        return "APROBADO";
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

  function isSelected(codigo: string) {
    return proyeccion.some((c) => c.codigo === codigo);
  }

  function toggleCursoProyeccion(curso: CursoMalla) {
    if (isSelected(curso.codigo)) {
      setProyeccion((prev) => prev.filter((c) => c.codigo !== curso.codigo));
    } else {
      setProyeccion((prev) => [...prev, curso]);
    }
  }

  return (
    <div className="flex justify-center w-full h-[calc(100vh-64px)] gap-6">
      <ScrollArea className="w-full max-w-5xl whitespace-nowrap h-full">
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
                        const status = getCursoStatus(course.codigo);
                        return (
                          <div
                            key={course.codigo}
                            className={cn(
                              "rounded-md border border-transparent",
                              status !== "APROBADO" &&
                                `cursor-pointer transition ${
                                  isSelected(course.codigo)
                                    ? "border-blue-500"
                                    : "hover:border-blue-300 transition"
                                }`
                            )}
                            onClick={
                              status === "APROBADO"
                                ? undefined
                                : () => toggleCursoProyeccion(course)
                            }
                          >
                            <CursoAvanceCard
                              asignatura={course.asignatura}
                              codigo={course.codigo}
                              creditos={course.creditos}
                              status={status}
                            />
                          </div>
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

      <ProyeccionContainer
        proyeccion={proyeccion}
        onQuitar={toggleCursoProyeccion}
        getCursoStatus={getCursoStatus}
      />
    </div>
  );
}
