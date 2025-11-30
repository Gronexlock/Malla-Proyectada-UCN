"use client";

import { useProyeccion } from "@/src/contexts/ProyeccionContext";
import { EditorProyeccion } from "./editor/editor-proyeccion";
import { MallaCurricular } from "./malla-proyeccion";
import { ProyeccionPreview } from "./proyeccion-preview";

export function NuevaProyeccionView() {
  const { cursos, proyeccionesPreview, toggleCursoProyeccion } =
    useProyeccion();

  return (
    <div className={`h-[calc(100vh-2.5rem)] flex flex-col`}>
      <div className="flex min-h-0">
        <MallaCurricular cursos={cursos} onCursoClick={toggleCursoProyeccion} />
        <ProyeccionPreview proyeccionesPreview={proyeccionesPreview} />
      </div>
      <EditorProyeccion />
    </div>
  );
}
