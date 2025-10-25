import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { romanNumerals } from "@/src/constants/numerosRomanos";
import { CursoAvanceCard } from "./curso-avance-card";
import { MallaSkeleton } from "./skeletons/malla-skeleton";
import { Carrera } from "@/src/types/carrera";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { MoveLeft, MoveRight } from "lucide-react";
import { useCrearProyeccion } from "@/hooks/use-proyeccion";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Lock } from "lucide-react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { useState } from "react";

type CrearProyeccionViewProps = {
  carrera: Carrera;
  rut: string;
};

export function CrearProyeccionView({
  carrera,
  rut,
}: CrearProyeccionViewProps) {
  const [ignorarRestricciones, setIgnorarRestricciones] = useState(false);
  const proyeccion = useCrearProyeccion(carrera, rut, ignorarRestricciones);

  if (proyeccion.loading) {
    return <MallaSkeleton nombreCarrera={carrera.nombre.toLocaleLowerCase()} />;
  }

  return (
    <div className="flex justify-center w-full">
      <ScrollArea className="min-w-0">
        <div
          ref={proyeccion.callbackRef}
          className="inline-flex gap-4 p-6 pb-9 border border-r-0 rounded-l-lg bg-zinc-100"
        >
          {Object.keys(proyeccion.cursosPorAnio)
            .sort((a, b) => Number(a) - Number(b))
            .map((anio) => (
              <div key={anio} className="flex flex-col gap-2">
                <div className="rounded-sm text-center text-white font-bold mb-2 bg-zinc-800">
                  Año {anio}
                </div>
                <div className="flex gap-4">
                  {proyeccion.cursosPorAnio[Number(anio)].map((level) => (
                    <div key={level} className="flex flex-col gap-2">
                      <div className="bg-zinc-400 rounded-sm flex justify-center items-center mb-2">
                        <h2 className="text-center font-semibold">
                          {romanNumerals[level]}
                        </h2>
                      </div>
                      {proyeccion.cursosPorNivel[level].map((course) => {
                        const status = proyeccion.getCursoStatus(course.codigo);
                        const alreadySelected = proyeccion.isAlreadySelected(
                          course.codigo
                        );
                        const canBeSelected =
                          (status === "INSCRITO" && alreadySelected) ||
                          (status !== "APROBADO" &&
                            !alreadySelected &&
                            proyeccion.cumplePrerrequisitos(course));
                        status !== "APROBADO";
                        const bloqueantes =
                          proyeccion.getCursosBloqueantes(course);
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
                                  !proyeccion.cumplePrerrequisitos(course)) &&
                                  "opacity-30"
                              )}
                              onClick={
                                canBeSelected
                                  ? () =>
                                      proyeccion.toggleCursoProyeccion(course)
                                  : undefined
                              }
                            >
                              <CursoAvanceCard
                                asignatura={course.asignatura}
                                codigo={course.codigo}
                                creditos={course.creditos}
                                status={status}
                                prereq={course.prereq}
                                bloqueantes={proyeccion.getCursosBloqueantes(
                                  course
                                )}
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
          maxHeight: `${proyeccion.altura}px`,
          height: `${proyeccion.altura}px`,
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
            <h2 className="font-bold text-lg mb-1">
              {proyeccion.semestreActual}
            </h2>
            <div
              className={cn(
                "px-2 py-1 rounded-full text-white text-sm font-semibold transition-colors mt-1 mb-4 max-w-fit",
                {
                  "bg-zinc-900":
                    proyeccion.getCreditosSemestreActual() <
                    proyeccion.LIMITE_CREDITOS,
                  "bg-amber-500":
                    proyeccion.getCreditosSemestreActual() ===
                    proyeccion.LIMITE_CREDITOS,
                  "bg-red-600":
                    proyeccion.getCreditosSemestreActual() >
                    proyeccion.LIMITE_CREDITOS,
                }
              )}
            >
              Créditos: {proyeccion.getCreditosSemestreActual()}
            </div>
          </div>
        </div>
        <div className="mb-4 pt-2 flex flex-col items-center flex-1 w-full h-full overflow-y-auto">
          {proyeccion.proyeccionActual.length === 0 && (
            <div className="text-gray-400 text-sm ">
              Selecciona cursos pendientes o reprobados para agregarlos aquí.
            </div>
          )}
          <div className="w-full">
            <ul className="space-y-4">
              {proyeccion.proyeccionActual.map((curso) => (
                <li
                  key={curso.codigo}
                  className="relative group flex justify-center"
                >
                  <CursoAvanceCard
                    asignatura={curso.asignatura}
                    codigo={curso.codigo}
                    creditos={curso.creditos}
                    status={proyeccion.getCursoStatus(curso.codigo)}
                    prereq={curso.prereq}
                    bloqueantes={proyeccion.getCursosBloqueantes(curso)}
                    onClick={() => proyeccion.toggleCursoProyeccion(curso)}
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
                onClick={proyeccion.irSemestreAnterior}
                disabled={proyeccion.semestreIndex === 0}
              >
                <MoveLeft />
                Anterior
              </Button>
              <Button
                className="cursor-pointer mt-4"
                onClick={proyeccion.irSiguienteSemestre}
                disabled={proyeccion.proyeccionActual.length === 0}
              >
                Siguiente
                <MoveRight />
              </Button>
            </div>
            <Button
              onClick={proyeccion.guardarProyecciones}
              className="w-full cursor-pointer"
              variant="default"
              disabled={
                proyeccion.proyeccionActual.length === 0 ||
                (!ignorarRestricciones &&
                  proyeccion.getCreditosSemestreActual() >
                    proyeccion.LIMITE_CREDITOS)
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
