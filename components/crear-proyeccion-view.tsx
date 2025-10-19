import { CursoAvance, CursoMalla } from "@/src/types/curso";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { romanNumerals } from "@/src/constants/numerosRomanos";
import { useState, useEffect } from "react";
import { CursoAvanceCard } from "./curso-avance-card";
import { MallaSkeleton } from "./skeletons/malla-skeleton";
import { Carrera } from "@/src/types/carrera";
import { cn } from "@/lib/utils";
import { getCursosPorAnio, getCursosPorNivel } from "@/src/utils/curso";
import { getCursoStatus } from "@/src/utils/proyeccion";
import { getSemestreActual, getSemestreSiguiente } from "@/src/utils/semestre";
import { Button } from "./ui/button";
import { useUserStore } from "@/src/store/useUserStore";
import { Proyeccion } from "@/src/types/proyeccion";
import { MoveLeft, MoveRight } from "lucide-react";
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
  const [altura, setAltura] = useState(0);
  const cursosPorNivel = getCursosPorNivel(cursos);
  const cursosPorAnio = getCursosPorAnio(cursosPorNivel);
  const { proyecciones, setProyecciones } = useUserStore();
  const [semestres, setSemestres] = useState([
    getSemestreSiguiente(getSemestreActual()),
  ]);
  const [semestreIndex, setSemestreIndex] = useState(0);
  const semestreActual = semestres[semestreIndex];
  const [proyeccionesPorSemestre, setProyeccionesPorSemestre] = useState<
    Record<string, CursoMalla[]>
  >({});
  const proyeccionActual = proyeccionesPorSemestre[semestreActual] || [];
  const LIMITE_CREDITOS = 30;
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

  function guardarProyecciones() {
    const maxId = proyecciones.reduce((max, p) => (p.id > max ? p.id : max), 0);
    const proyeccionesNueva: Proyeccion = {
      id: maxId + 1,
      proyecciones: [],
    };

    Object.keys(proyeccionesPorSemestre).forEach((semestre) => {
      proyeccionesNueva.proyecciones.push({
        semestre,
        cursos: proyeccionesPorSemestre[semestre].map((curso) => ({
          codigo: curso.codigo,
          asignatura: curso.asignatura,
          creditos: curso.creditos,
          semestre,
        })),
      });
    });
    setProyecciones([...proyecciones, proyeccionesNueva]);
  }

  function toggleCursoProyeccion(curso: CursoMalla) {
    setProyeccionesPorSemestre((prev) => {
      const proyeccionActual = prev[semestreActual] || [];
      const isCursoSelected = proyeccionActual.some(
        (c) => c.codigo === curso.codigo
      );

      return {
        ...prev,
        [semestreActual]: isCursoSelected
          ? proyeccionActual.filter((c) => c.codigo !== curso.codigo)
          : [...proyeccionActual, curso],
      };
    });
  }

  function isAlreadySelected(codigo: string): boolean {
    for (let i = 0; i < semestres.length; i++) {
      const semestre = semestres[i];
      const proyeccion = proyeccionesPorSemestre[semestre] || [];
      if (proyeccion.some((c) => c.codigo === codigo)) {
        return true;
      }
    }
    return false;
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

  function getCreditosSemestreActual(): number {
    return proyeccionActual.reduce((total, curso) => total + curso.creditos, 0);
  }

  function cumplePrerrequisitos(curso: CursoMalla): boolean {
    if (!curso.prereq || curso.prereq.length === 0) return true;
    return curso.prereq.every((pre) =>
      avance.some((a) => a.course === pre.codigo && a.status === "APROBADO")
    );
  }

  function getCursosBloqueantes(curso: CursoMalla) {
    return curso.prereq.filter((pre) =>
      cursos.some(
        (c) =>
          c.codigo === pre.codigo &&
          getCursoStatus(c.codigo, avance) !== "APROBADO"
      )
    );
  }

  return (
    <div className="flex justify-center w-full">
      <ScrollArea className="min-w-0">
        <div
          ref={callbackRef}
          className="inline-flex gap-4 p-6 pb-9 border border-r-0 rounded-l-lg bg-zinc-100"
        >
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
                        const status = getCursoStatus(course.codigo, avance);
                        const alreadySelected = isAlreadySelected(
                          course.codigo
                        );
                        const canBeSelected =
                          status !== "APROBADO" &&
                          !alreadySelected &&
                          cumplePrerrequisitos(course);
                        const lockVisible =
                          !cumplePrerrequisitos(course) &&
                          status !== "APROBADO";
                        return (
                          <div className="relative">
                            <div
                              key={course.codigo}
                              className={cn(
                                "rounded-md border border-transparent",
                                alreadySelected && "opacity-50",
                                status !== "APROBADO" &&
                                  !cumplePrerrequisitos(course) &&
                                  "opacity-50"
                              )}
                              onClick={
                                canBeSelected
                                  ? () => toggleCursoProyeccion(course)
                                  : undefined
                              }
                            >
                              <CursoAvanceCard
                                asignatura={course.asignatura}
                                codigo={course.codigo}
                                creditos={course.creditos}
                                status={alreadySelected ? "APROBADO" : status}
                                prereq={course.prereq}
                                bloqueantes={getCursosBloqueantes(course)}
                                clickable={canBeSelected}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
        <ScrollBar orientation="horizontal" className="" />
      </ScrollArea>
      <div
        className={`w-64 shrink-0 flex flex-col bg-white border border-l-0 rounded-r-lg items-center p-4 text-wrap text-center`}
        style={{ maxHeight: `${altura}px`, height: `${altura}px` }}
      >
        <div>
          <h2 className="font-bold text-lg">{semestreActual}</h2>
          <div
            className={cn(
              "px-2 py-1 rounded-full text-white text-sm font-semibold transition-colors mt-1 mb-4 max-w-fit",
              {
                "bg-zinc-900": getCreditosSemestreActual() < LIMITE_CREDITOS,
                "bg-amber-500": getCreditosSemestreActual() === LIMITE_CREDITOS,
                "bg-red-600": getCreditosSemestreActual() > LIMITE_CREDITOS,
              }
            )}
          >
            Créditos: {getCreditosSemestreActual()}
          </div>
        </div>
        <div className="mb-4 flex flex-col items-center flex-1 w-full h-full overflow-y-auto">
          {proyeccionActual.length === 0 && (
            <div className="text-gray-400 text-sm ">
              Selecciona cursos pendientes o reprobados para agregarlos aquí.
            </div>
          )}
          <div className="w-full">
            <ul className="space-y-4">
              {proyeccionActual.map((curso) => (
                <li
                  key={curso.codigo}
                  className="relative group flex justify-center"
                >
                  <CursoAvanceCard
                    asignatura={curso.asignatura}
                    codigo={curso.codigo}
                    creditos={curso.creditos}
                    status={getCursoStatus(curso.codigo, avance)}
                    prereq={curso.prereq}
                    bloqueantes={getCursosBloqueantes(curso)}
                    onClick={() => toggleCursoProyeccion(curso)}
                    clickable
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col justify-end items-center">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-4">
              <Button
                className="cursor-pointer mt-4"
                onClick={irSemestreAnterior}
                disabled={semestreIndex === 0}
              >
                <MoveLeft />
                Anterior
              </Button>
              <Button
                className="cursor-pointer mt-4"
                onClick={irSiguienteSemestre}
                disabled={proyeccionActual.length === 0}
              >
                Siguiente
                <MoveRight />
              </Button>
            </div>
            <Button
              onClick={guardarProyecciones}
              className="w-full cursor-pointer"
              variant="default"
              disabled={
                proyeccionActual.length === 0 ||
                getCreditosSemestreActual() > LIMITE_CREDITOS
              }
            >
              Guardar Proyección
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
