import { NuevaProyeccionSkeleton } from "@/components/skeletons/crear-proyeccion/crear-proyeccion-skeleton";
import { carreras } from "@/src/constants/carrerasInfo";

export default async function TestPage() {
  const carrera = carreras["icci"];

  return (
    <div>
      <NuevaProyeccionSkeleton carrera={carrera} />
    </div>
  );
}
