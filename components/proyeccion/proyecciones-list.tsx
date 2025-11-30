import { nombresCompletos } from "@/src/constants/carrerasInfo";
import { Proyeccion } from "@/src/types/proyeccion";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { ConfirmationModal } from "../ui/confirmation-modal";
import { useState } from "react";
import { deleteProyeccion } from "@/src/actions/proyeccionActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  const [proyeccionToDelete, setProyeccionToDelete] = useState<number | null>(
    null
  );
  const router = useRouter();

  const handleDelete = async () => {
    if (!proyeccionToDelete) return;

    try {
      await deleteProyeccion(proyeccionToDelete);
      toast.success("Proyección eliminada correctamente");
      router.refresh();
      if (Number(selectedId) === proyeccionToDelete) {
        // Optionally handle deselection or redirect if the deleted item was selected
        // For now, we rely on the parent or router refresh to handle state updates
      }
    } catch (error) {
      toast.error("Error al eliminar la proyección");
      console.error(error);
    } finally {
      setProyeccionToDelete(null);
    }
  };

  return (
    <div className="space-y-3">
      <ConfirmationModal
        open={!!proyeccionToDelete}
        onOpenChange={(open) => !open && setProyeccionToDelete(null)}
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Se eliminará permanentemente la proyección y todos sus datos asociados."
        onConfirm={handleDelete}
        variant="destructive"
        confirmText="Eliminar"
      />
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
            className="w-full justify-start h-auto py-3 px-4 text-left group relative"
          >
            <div className="flex-1">
              <div className="font-medium">
                {nombresCompletos[proyeccion.carrera]}
              </div>
              <div className="text-xs text-muted-foreground">
                ID: {proyeccion.id} • {proyeccion.semestres.length} semestre
                {proyeccion.semestres.length !== 1 ? "s" : ""}
              </div>
            </div>
            <div
              role="button"
              tabIndex={0}
              className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-destructive/10 rounded-md text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                setProyeccionToDelete(proyeccion.id);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  setProyeccionToDelete(proyeccion.id);
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
