import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { romanNumerals } from "@/src/constants/numerosRomanos";
import { CursoAvanceCard } from "./curso-avance-card";
import { MallaSkeleton } from "./skeletons/malla-skeleton";
import { Carrera } from "@/src/types/carrera";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { MoveLeft, MoveRight } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Lock } from "lucide-react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { useEffect, useState } from "react";
import { getCursosPorAnio, getCursosPorNivel } from "@/src/utils/malla";
import { CursoAvance, CursoMalla } from "@/src/types/curso";
import { getSemestreActual, getSemestreSiguiente } from "@/src/utils/semestre";

type CrearProyeccionViewProps = {
  carrera: Carrera;
  rut: string;
};

export function CrearProyeccionView({
  carrera,
  rut,
}: CrearProyeccionViewProps) {
  const [altura, setAltura] = useState(0);
  const [cursos, setCursos] = useState<CursoMalla[]>([]);
  const cursosPorNivel = getCursosPorNivel(cursos);
  const cursosPorAnio = getCursosPorAnio(cursosPorNivel);
  const [avance, setAvance] = useState<CursoAvance[]>([]);
  const [loading, setLoading] = useState(true);
  const [semestres, setSemestres] = useState([
    getSemestreSiguiente(getSemestreActual()),
  ]);
  const [semestreIndex, setSemestreIndex] = useState(0);
  const semestreActual = semestres[semestreIndex];
  const [proyeccionesPorSemestre, setProyeccionesPorSemestre] = useState<
    Record<string, CursoMalla[]>
  >({});
  const proyeccionActual = proyeccionesPorSemestre[semestreActual] || [];
  const [avancePorSemestre, setAvancePorSemestre] = useState<
    Record<string, CursoAvance[]>
  >({});
  const LIMITE_CREDITOS = 30;
  const [ignorarRestricciones, setIgnorarRestricciones] = useState(false);

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

        const practicas = ["ECIN-08606", "ECIN-08616", "ECIN-08266"];
        const practicaIdx = cursosData.findIndex((curso: CursoMalla) =>
          practicas.includes(curso.codigo)
        );
        if (practicaIdx !== -1) cursosData.splice(practicaIdx, 1);

        setCursos(cursosData);
        setAvance(avanceData);
        actualizarAvance();
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

  function agregarCursoAlAvance(codigo: string) {
    setAvance((prev) => [...prev, { course: codigo, status: "INSCRITO" }]);
  }

  function eliminarInscripcion(codigo: string) {
    const curso = avance.find(
      (c) => c.course === codigo && c.status === "INSCRITO"
    );
    if (curso) {
      setAvance((prev) => prev.filter((c) => c.course !== codigo));
    }
  }

  function actualizarAvance() {
    setAvance((prev) =>
      prev.map((curso) =>
        curso.status === "INSCRITO" ? { ...curso, status: "APROBADO" } : curso
      )
    );
  }

  async function guardarProyecciones() {
    try {
      const response = await fetch("/api/proyecciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estudianteRut: rut,
          carreraCodigo: carrera.codigo,
          proyecciones: proyeccionesPorSemestre,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al guardar las proyecciones");
      }
    } catch (error) {
      console.error("Error guardando proyecciones:", error);
    }
  }

  function toggleCursoProyeccion(curso: CursoMalla) {
    setProyeccionesPorSemestre((prev) => {
      const isCursoSelected = proyeccionActual.some(
        (c) => c.codigo === curso.codigo
      );

      if (isCursoSelected) {
        eliminarInscripcion(curso.codigo);
      } else {
        agregarCursoAlAvance(curso.codigo);
      }

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
    setAvancePorSemestre((prev) => ({
      ...prev,
      [semestreActual]: avance,
    }));

    if (semestreIndex < semestres.length - 1) {
      setSemestreIndex(semestreIndex + 1);
    } else {
      const ultimoSemestre = semestres[semestres.length - 1];
      const siguienteSemestre = getSemestreSiguiente(ultimoSemestre);
      setSemestres((prev) => [...prev, siguienteSemestre]);
      setSemestreIndex(semestreIndex + 1);
    }
    actualizarAvance();
  }

  function irSemestreAnterior() {
    if (semestreIndex > 0) {
      setAvancePorSemestre((prev) => ({
        ...prev,
        [semestreActual]: avance,
      }));

      setProyeccionesPorSemestre((prev) => {
        const nuevo = { ...prev };
        delete nuevo[semestreActual];
        return nuevo;
      });

      const anteriorSemestre = semestres[semestreIndex - 1];
      setAvance(avancePorSemestre[anteriorSemestre] || []);
      setSemestreIndex(semestreIndex - 1);
    }
  }

  function getCreditosSemestreActual(): number {
    return proyeccionActual.reduce((total, curso) => total + curso.creditos, 0);
  }

  function cumplePrerrequisitos(curso: CursoMalla): boolean {
    if (!curso.prereq || curso.prereq.length === 0 || ignorarRestricciones)
      return true;
    return curso.prereq.every((pre) =>
      avance.some((a) => a.course === pre.codigo && a.status === "APROBADO")
    );
  }

  function getCursosBloqueantes(curso: CursoMalla) {
    if (getCursoStatus(curso.codigo) === "APROBADO") return [];
    const aprobados = avance
      .filter((a) => a.status === "APROBADO")
      .map((a) => a.course);
    return curso.prereq.filter((pre) => !aprobados.includes(pre.codigo));
  }

  function getCursoStatus(codigo: string): CursoAvance["status"] | "PENDIENTE" {
    const cursoAvance = avance.filter((curso) => curso.course === codigo);
    if (cursoAvance.length === 0) {
      return "PENDIENTE";
    }
    const statuses = cursoAvance.map((curso) => curso.status);
    if (statuses.includes("APROBADO")) {
      return "APROBADO";
    }
    if (statuses.includes("INSCRITO")) {
      return "INSCRITO";
    }
    return "REPROBADO";
  }

  const callbackRef = (node: HTMLDivElement | null) => {
    if (node) setAltura(node.offsetHeight);
  };

  if (loading) {
    return <MallaSkeleton nombreCarrera={carrera.nombre.toLocaleLowerCase()} />;
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
                        const status = getCursoStatus(course.codigo);
                        const alreadySelected = isAlreadySelected(
                          course.codigo
                        );
                        const canBeSelected =
                          (status === "INSCRITO" && alreadySelected) ||
                          (status !== "APROBADO" &&
                            !alreadySelected &&
                            cumplePrerrequisitos(course));
                        status !== "APROBADO";
                        const bloqueantes = getCursosBloqueantes(course);
                        return (
                          <div className="relative">
                            {bloqueantes.length > 0 &&
                              !ignorarRestricciones && (
                                <HoverCard openDelay={200} closeDelay={200}>
                                  <HoverCardTrigger>
                                    <Lock
                                      size={16}
                                      strokeWidth={2.3}
                                      className="text-amber-600 absolute top-20 left-18 z-20"
                                    />
                                  </HoverCardTrigger>
                                  <HoverCardContent className="flex justify-center w-40">
                                    <div className="flex flex-col gap-1">
                                      <h2 className="font-bold text-sm text-center">
                                        BLOQUEADO POR
                                      </h2>
                                      <hr />
                                      {bloqueantes.map((bloq) => (
                                        <p
                                          key={bloq.codigo}
                                          className="text-xs"
                                        >
                                          • {bloq.asignatura}
                                        </p>
                                      ))}
                                    </div>
                                  </HoverCardContent>
                                </HoverCard>
                              )}
                            <div
                              key={course.codigo}
                              className={cn(
                                "rounded-md border border-transparent transition-opacity",
                                (status === "APROBADO" ||
                                  !cumplePrerrequisitos(course)) &&
                                  "opacity-30"
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
                                status={status}
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
        className={`w-64 bg-white shrink-0 flex flex-col border border-l-0 rounded-r-lg items-center text-wrap text-center`}
        style={{
          maxHeight: `${altura}px`,
          height: `${altura}px`,
        }}
      >
        <div className="w-full">
          <div className="flex flex-col items-center">
            <div className="flex space-x-2 items-center w-full border-b justify-center py-4 mb-2">
              <Switch
                id="ignorar-reestricciones"
                checked={ignorarRestricciones}
                onCheckedChange={setIgnorarRestricciones}
              />
              <Label htmlFor="ignorar-reestricciones" className="text-md">
                Ignorar restricciones
              </Label>
            </div>
            <h2 className="font-bold text-lg mb-1">{semestreActual}</h2>
            <div
              className={cn(
                "px-2 py-1 rounded-full text-white text-sm font-semibold transition-colors mt-1 mb-4 max-w-fit",
                {
                  "bg-zinc-900": getCreditosSemestreActual() < LIMITE_CREDITOS,
                  "bg-amber-500":
                    getCreditosSemestreActual() === LIMITE_CREDITOS,
                  "bg-red-600": getCreditosSemestreActual() > LIMITE_CREDITOS,
                }
              )}
            >
              Créditos: {getCreditosSemestreActual()}
            </div>
          </div>
        </div>
        <div className="mb-4 pt-2 flex flex-col items-center flex-1 w-full h-full overflow-y-auto">
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
                    status={getCursoStatus(curso.codigo)}
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
        <div className="flex flex-col justify-end items-center pb-4">
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
                (!ignorarRestricciones &&
                  getCreditosSemestreActual() > LIMITE_CREDITOS)
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
