import { nombresCompletos } from "@/src/constants/carrerasInfo";
import { Proyeccion } from "@/src/types/proyeccion";
import { Button } from "../ui/button";

type ProyeccionesListProps = {
  proyecciones: Proyeccion[];
  selectedId: string;
  onSelect: (proyeccion: Proyeccion) => void;
};

export function ProyeccionesList({
  proyecciones,
  selectedId,
  onSelect,
}: ProyeccionesListProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold text-foreground">
        Mis Proyecciones
      </h2>
      <div className="space-y-2">
        {proyecciones.map((proyeccion) => (
          <Button
            key={proyeccion.id}
            onClick={() => onSelect(proyeccion)}
            variant={
              Number(selectedId) === proyeccion.id ? "default" : "outline"
            }
            className="w-full justify-start h-auto py-3 px-4 text-left"
          >
            <div>
              <div className="font-medium">
                {nombresCompletos[proyeccion.carrera]}
              </div>
              <div className="text-xs text-muted-foreground">
                ID: {proyeccion.id} • {proyeccion.semestres.length} semestre
                {proyeccion.semestres.length !== 1 ? "s" : ""}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
