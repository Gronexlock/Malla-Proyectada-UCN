import { NuevaProyeccionView } from "@/components/proyeccion/crear-proyeccion/crear-proyeccion-view";
import { getUser } from "@/src/actions/cookiesActions";
import { getAvanceAgrupado } from "@/src/utils/cursosUtils";
import { aprobarCursosInscritos } from "@/src/utils/proyeccionUtils";
import { ProyeccionHeaderView } from "@/components/header/header-view";

export default async function NuevaProyeccionPage() {
  const { selectedCarrera } = await getUser();
  const cursos = aprobarCursosInscritos(
    await getAvanceAgrupado(selectedCarrera)
  );

  return (
    <>
      <ProyeccionHeaderView selectedCarrera={selectedCarrera} />
      <NuevaProyeccionView cursos={cursos} />
    </>
  );
}
