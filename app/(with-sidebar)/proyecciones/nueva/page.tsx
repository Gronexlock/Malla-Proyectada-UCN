import { CrearProyeccionView } from "@/components/crear-proyeccion-view";
import { getUser } from "@/src/actions/cookiesActions";
import { getAvanceCurricular } from "@/src/utils/cursosUtils";

export default async function Page() {
  const { rut, selectedCarrera } = await getUser();
  const cursos = await getAvanceCurricular(rut, selectedCarrera);

  return (
    <div className="p-4">
      <CrearProyeccionView avance={cursos} />
    </div>
  );
}
