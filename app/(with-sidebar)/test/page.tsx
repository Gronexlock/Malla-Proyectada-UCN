import { NuevaProyeccionView } from "@/components/nueva-proyeccion-view";
import { getUser } from "@/src/actions/cookiesActions";
import { getAvanceAgrupado } from "@/src/utils/cursosUtils";
import { actualizarAvance } from "@/src/utils/proyeccionUtils";

export default async function NuevaProyeccionPage() {
  const { rut, selectedCarrera } = await getUser();
  const cursos = actualizarAvance(
    await getAvanceAgrupado(rut, selectedCarrera)
  );

  return (
    <div className="p-4">
      <NuevaProyeccionView cursos={cursos} />
    </div>
  );
}
