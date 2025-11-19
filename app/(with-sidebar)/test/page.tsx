import { NuevaProyeccionView } from "@/components/nueva-proyeccion-view";
import { getUser } from "@/src/actions/cookiesActions";
import { getAvanceCurricular } from "@/src/utils/cursosUtils";

export default async function NuevaProyeccionPage() {
  const { rut, selectedCarrera } = await getUser();
  const cursos = await getAvanceCurricular(rut, selectedCarrera);

  return (
    <div className="p-4">
      <NuevaProyeccionView cursos={cursos} />
    </div>
  );
}
