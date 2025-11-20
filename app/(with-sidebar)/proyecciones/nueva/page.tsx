import { NuevaProyeccionView } from "@/components/proyeccion/nueva-proyeccion-view";
import { getUser } from "@/src/actions/cookiesActions";
import { getAvanceAgrupado } from "@/src/utils/cursosUtils";
import { aprobarCursosInscritos } from "@/src/utils/proyeccionUtils";

export default async function NuevaProyeccionPage() {
  const { selectedCarrera } = await getUser();
  const cursos = aprobarCursosInscritos(
    await getAvanceAgrupado(selectedCarrera)
  );

  return (
    <div className="p-4">
      <NuevaProyeccionView cursos={cursos} />
    </div>
  );
}
