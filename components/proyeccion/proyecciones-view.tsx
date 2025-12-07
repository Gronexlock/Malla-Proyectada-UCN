import { Proyeccion } from "@/src/types/proyeccion";
import {
  getCantidadCursosPendientes,
  getEgresoMasTemprano,
} from "@/src/utils/proyeccionesUtils";
import {
  BookOpen,
  Calendar,
  Clock,
  Eye,
  GraduationCap,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

type ProyeccionesViewProps = {
  proyecciones: Proyeccion[];
};

export default function ProyeccionesView({
  proyecciones,
}: ProyeccionesViewProps) {
  return (
    <div className="flex flex-col w-full gap-8 max-w-7xl">
      <div className="grid grid-cols-3 grid-rows-1 gap-4">
        <div className="dark:bg-zinc-900 border rounded-lg h-32 flex items-center justify-center gap-3">
          <div className="flex w-full justify-center gap-3">
            <div className=" p-3.5 bg-emerald-600/20 flex justify-center items-center rounded-lg">
              <BookOpen className="text-emerald-500" />
            </div>
            <div>
              <h2 className="font-semibold text-2xl md:text-3xl">
                {proyecciones.length}
              </h2>
              <p className="dark:text-zinc-500 text-xs md:text-sm">
                {proyecciones.length === 1
                  ? "Proyección creada"
                  : "Proyecciones creadas"}
              </p>
            </div>
          </div>
        </div>
        <div className="dark:bg-zinc-900 border rounded-lg h-32 flex items-center justify-center gap-3">
          <div className="flex w-full justify-center gap-3">
            <div className=" p-3.5 bg-blue-600/20 flex justify-center items-center rounded-lg">
              <GraduationCap className="text-blue-500" />
            </div>
            <div>
              <h2 className="font-semibold text-2xl md:text-3xl">
                {getEgresoMasTemprano(proyecciones)}
              </h2>
              <p className="dark:text-zinc-500 text-xs md:text-sm">
                Egreso más temprano
              </p>
            </div>
          </div>
        </div>
        <div className="dark:bg-zinc-900 border rounded-lg h-32 flex items-center justify-center gap-3">
          <div className="flex w-full justify-center gap-3">
            <div className=" p-3.5 bg-purple-600/20 flex justify-center items-center rounded-lg">
              <Clock className="text-purple-500" />
            </div>
            <div>
              <h2 className="font-semibold text-2xl md:text-3xl">
                {getCantidadCursosPendientes(proyecciones)}
              </h2>
              <p className="dark:text-zinc-500 text-xs md:text-sm">
                Cursos pendientes
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {proyecciones.map((proyeccion) => {
          const totalSemestres = proyeccion.semestres.length;
          const totalCursos = proyeccion.semestres.reduce(
            (acc, semestre) => acc + semestre.cursos.length,
            0
          );
          const egresoEstimado =
            proyeccion.semestres[totalSemestres - 1].semestre;
          const cantSemestresRestantes = totalSemestres - 3;
          return (
            <div className="rounded-lg border p-6 flex flex-col w-full h-100 dark:bg-zinc-900">
              <div className="flex flex-col gap-1 mb-8">
                <h3 className="text-xl text-white font-semibold">
                  Proyección 1
                </h3>
                <p className="dark:text-zinc-500">Creada el 19/1/2024</p>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2 dark:text-zinc-400">
                  <Calendar size={18} />
                  <p>
                    {totalSemestres}{" "}
                    {totalSemestres === 1 ? "semestre" : "semestres"}
                  </p>
                </div>
                <div className="flex items-center gap-2 dark:text-zinc-400">
                  <BookOpen size={18} />
                  <p>
                    {totalCursos} {totalCursos === 1 ? "curso" : "cursos"}
                  </p>
                </div>
              </div>
              <div className="flex bg-muted p-3 rounded-lg mt-4 items-center justify-between">
                <p className="text-sm dark: text-zinc-400">Egreso estimado</p>
                <p className="font-semibold text-emerald-500 text-lg">
                  {egresoEstimado}
                </p>
              </div>
              <div className="flex flex-col mt-4">
                <p className="dark:text-zinc-500 text-sm mb-2">VISTA PREVIA</p>
                <div className="flex gap-2">
                  {proyeccion.semestres.slice(0, 3).map((semestre) => (
                    <div className="flex flex-col dark:bg-zinc-800 w-25 p-2 rounded-md">
                      <p className="text-emerald-500 text-sm font-semibold">
                        {semestre.semestre}
                      </p>
                      <p className="dark:text-zinc-400 text-sm truncate">
                        {semestre.cursos.length}{" "}
                        {semestre.cursos.length === 1 ? "curso" : "cursos"}
                      </p>
                    </div>
                  ))}
                  {cantSemestresRestantes > 0 && (
                    <div className="flex flex-col items-center aspect-square justify-center dark:bg-[#202022] p-2 rounded-md">
                      <p className="dark:text-zinc-400 text-sm truncate">
                        +{cantSemestresRestantes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <Button className="flex items-center gap-4 dark:!bg-zinc-900 hover:dark:!bg-zinc-800 border text-foreground/90 mt-8 hover:cursor-pointer">
                <Eye />
                Ver Proyección Completa
              </Button>
            </div>
          );
        })}
        <Link href="/proyecciones/nueva">
          <div className="flex flex-col min-h-64 items-center justify-center border-2 hover:border-emerald-500/50 border-dotted dark:bg-zinc-900 opacity-70 hover:opacity-100 transition-all rounded-lg hover:cursor-pointer group">
            <div className="flex justify-center items-center bg-secondary group-hover:bg-emerald-500/20 size-16 rounded-full mb-4 transition-colors">
              <Plus
                size={32}
                className="group-hover:text-emerald-500 transition-colors"
              />
            </div>
            <p className="text-lg">Crear Nueva Proyección</p>
            <p className="text-sm text-muted-foreground">
              Simula tu avance curricular
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
