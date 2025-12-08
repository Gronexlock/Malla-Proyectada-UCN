import { EditorProyeccionSkeleton } from "./editor-proyeccion-skeleton";
import { MallaProyeccionSkeleton } from "./malla-proyeccion-skeleton";
import { ProyeccionPreviewSkeleton } from "./proyeccion-preview-skeleton";

export function NuevaProyeccionSkeleton() {
  return (
    <div className={`h-[calc(100vh-2.5rem)] flex flex-col`}>
      <div className="flex h-3/5 min-h-0">
        <MallaProyeccionSkeleton />
        <ProyeccionPreviewSkeleton />
      </div>
      <EditorProyeccionSkeleton />
    </div>
  );
}
