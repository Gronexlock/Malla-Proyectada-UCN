import { CursoAvance, CursoMalla } from "@/src/types/curso";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { romanNumerals } from "@/src/constants/numerosRomanos";
import { useState, useEffect } from "react";
import { CursoAvanceCard } from "./curso-avance-card";
import { MallaSkeleton } from "./skeletons/malla-skeleton";
import { Carrera } from "@/src/types/carrera";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/src/store/useUserStore";
import { getCursosPorAnio, getCursosPorNivel } from "@/src/utils/curso";
import { getCursoStatus } from "@/src/utils/proyeccion";
import { getSemestreActual, getSemestreSiguiente } from "@/src/utils/semestre";
import { Button } from "./ui/button";

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
  const { setProyecciones } = useUserStore();
  const [altura, setAltura] = useState(0);
  const cursosPorNivel = getCursosPorNivel(cursos);
  const cursosPorAnio = getCursosPorAnio(cursosPorNivel);

  const [semestres, setSemestres] = useState([
    getSemestreSiguiente(getSemestreActual()),
  ]);
  const [semestreIndex, setSemestreIndex] = useState(0);
  const semestreActual = semestres[semestreIndex];

  const callbackRef = (node: HTMLDivElement | null) => {
    if (node) setAltura(node.offsetHeight);
  };

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

  function irSiguienteSemestre() {
    if (semestreIndex < semestres.length - 1) {
      setSemestreIndex(semestreIndex + 1);
    } else {
      const ultimoSemestre = semestres[semestres.length - 1];
      const siguienteSemestre = getSemestreSiguiente(ultimoSemestre);
      setSemestres((prev) => [...prev, siguienteSemestre]);
      setSemestreIndex(semestreIndex + 1);
    }
  }

  function irSemestreAnterior() {
    if (semestreIndex > 0) {
      setSemestreIndex(semestreIndex - 1);
    }
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap h-[calc(100vh-64px)]">
      <div className="flex justify-center min-w-max gap-4">
        {Object.keys(cursosPorAnio)
          .sort((a, b) => Number(a) - Number(b))
          .map((anio) => (
            <div ref={callbackRef} key={anio} className="flex flex-col gap-2">
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
                      const status = getCursoStatus(course.codigo, avance);
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
        <div
          className={`sticky right-0 w-64 h-[${altura}px] bg-white border rounded-md shadow flex items-center overflow-y-auto flex-col p-4 text-wrap text-center`}
        >
          <h2 className="font-bold text-lg mb-4">
            Proyección {semestreActual}
          </h2>
          {proyeccion.length === 0 ? (
            <div className="text-gray-400 text-sm">
              Selecciona cursos pendientes o reprobados para agregarlos aquí.
            </div>
          ) : (
            <div className="flex flex-col h-full justify-between">
              <ul className="space-y-4">
                {proyeccion.map((curso) => (
                  <li
                    key={curso.codigo}
                    className="relative group flex justify-center"
                  >
                    <CursoAvanceCard
                      asignatura={curso.asignatura}
                      codigo={curso.codigo}
                      creditos={curso.creditos}
                      status={getCursoStatus(curso.codigo, avance)}
                      onClick={() => toggleCursoProyeccion(curso)}
                    />
                  </li>
                ))}
              </ul>
              <div className="flex justify-between gap-4">
                {/* Implementar funcinalidad */}
                <Button
                  className="cursor-pointer mt-4"
                  onClick={irSemestreAnterior}
                  disabled={semestreIndex === 0}
                >
                  Anterior
                </Button>
                <Button
                  className="cursor-pointer mt-4"
                  onClick={irSiguienteSemestre}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
