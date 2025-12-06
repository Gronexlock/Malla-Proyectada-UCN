import { Curso } from "@/src/types/curso";
import { EditorProyeccion } from "./editor/editor-proyeccion";
import { MallaCurricular } from "./malla-proyeccion";
import { ProyeccionPreview } from "./proyeccion-preview";

type NuevaProyeccionViewProps = {
  cursos: Curso[];
  proyeccionesPreview: Record<string, Curso[]>;
  toggleCursoProyeccion: (curso: Curso) => void;
};

export function NuevaProyeccionView({
  cursos,
  proyeccionesPreview,
  toggleCursoProyeccion,
}: NuevaProyeccionViewProps) {
  return (
    <div className={`h-[calc(100vh-2.5rem)] flex flex-col`}>
      <div className="flex h-3/5 min-h-0">
        <MallaCurricular cursos={cursos} onCursoClick={toggleCursoProyeccion} />
        <ProyeccionPreview proyeccionesPreview={proyeccionesPreview} />
      </div>
      <EditorProyeccion />
    </div>
  );
}
