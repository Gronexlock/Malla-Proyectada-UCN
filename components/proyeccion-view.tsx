import { Proyeccion } from "@/src/types/proyeccion";
import { groupProyeccionBySemestres } from "@/src/utils/proyeccion";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useEffect, useState } from "react";
import { CursoMallaCard } from "./curso-malla-card";
import { ScrollBar } from "./ui/scroll-area";
import { Carrera } from "@/src/types/carrera";
import { CursoMalla } from "@/src/types/curso";

type ProyeccionViewProps = {
  id: string;
  carrera: Carrera;
};

export function ProyeccionView({ id, carrera }: ProyeccionViewProps) {
  const [proyeccion, setProyeccion] = useState<Proyeccion>();
  const [cursosMalla, setCursosMalla] = useState<CursoMalla[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !carrera.codigo || !carrera.catalogo) return;
      setLoading(true);
      console.log("Ejecutando useEffect con id:", id, "y carrera:", carrera);

      try {
        const [proyeccionResp, cursosResp] = await Promise.all([
          fetch(`/api/proyecciones/${id}`),
          fetch(`/api/mallas/?codigo=${carrera.codigo}-${carrera.catalogo}`),
        ]);
        if (!proyeccionResp.ok || !cursosResp.ok) {
          throw new Error("Error al obtener los datos");
        }
        const [proyeccionData, cursosData] = await Promise.all([
          proyeccionResp.json(),
          cursosResp.json(),
        ]);
        setProyeccion(proyeccionData);
        setCursosMalla(cursosData);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        setProyeccion(undefined);
        setCursosMalla([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, carrera]);

  if (loading || !proyeccion) {
    return <div>Cargando proyección...</div>;
  }

  const proyeccionPorSemestre = groupProyeccionBySemestres(proyeccion!);

  return (
    <ScrollArea className="w-full whitespace-nowrap h-[calc(100vh-64px)]">
      <div className="flex justify-center min-w-max gap-4 pb-6 pr-6">
        {proyeccionPorSemestre.semestres.map((semestre) => {
          return (
            <div key={semestre.semestre} className="flex flex-col gap-2">
              <div className="bg-zinc-800 rounded-sm flex justify-center items-center mb-2">
                <h2 className="text-center text-white font-semibold">
                  {semestre.semestre}
                </h2>
              </div>
              <div className="flex flex-col gap-2">
                {semestre.cursos.map((curso) => {
                  const cursoMalla = cursosMalla.find(
                    (c) => c.codigo === curso.cursoCodigo
                  )!;
                  // return 1;
                  return (
                    <CursoMallaCard
                      key={cursoMalla.codigo}
                      curso={cursoMalla}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
