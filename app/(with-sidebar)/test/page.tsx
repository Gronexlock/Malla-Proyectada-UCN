import { NuevaProyeccionSkeleton } from "@/components/skeletons/crear-proyeccion-skeleton";
import { carreras } from "@/src/constants/carrerasInfo";

export default async function TestPage() {
  const carrera = carreras["icci"];

  return (
    <div className="p-4 flex justify-center">
      <NuevaProyeccionSkeleton carrera={carrera} />
    </div>
  );
}
