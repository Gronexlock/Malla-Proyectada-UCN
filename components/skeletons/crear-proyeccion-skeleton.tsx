"use client";

import { Carrera } from "@/src/types/carrera";
import { EditorProyeccion } from "../proyeccion/crear-proyeccion/editor/editor-proyeccion";
import { MallaCurricular } from "../proyeccion/crear-proyeccion/malla-proyeccion";
import { ProyeccionPreview } from "../proyeccion/crear-proyeccion/proyeccion-preview";

type NuevaProyeccionSkeletonProps = {
  carrera: Carrera;
};

export function NuevaProyeccionSkeleton({
  carrera,
}: NuevaProyeccionSkeletonProps) {
  return (
    <div className={`h-[calc(100vh-2.5rem)] flex flex-col`}>
      <div className="flex h-3/5 min-h-0">
        <MallaCurricular cursos={cursos} onCursoClick={toggleCursoProyeccion} />
        <ProyeccionPreview proyeccionesPreview={{}} />
      </div>
      <EditorProyeccion />
    </div>
  );
}
