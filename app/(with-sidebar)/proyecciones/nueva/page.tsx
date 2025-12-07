import { NuevaProyeccionView } from "@/components/proyeccion/crear-proyeccion/crear-proyeccion-view";
import { getUser } from "@/src/actions/cookiesActions";
import { getAvanceAgrupado } from "@/src/utils/cursosUtils";
import { aprobarCursosInscritos } from "@/src/utils/proyeccionUtils";

export default async function NuevaProyeccionPage() {
  const { selectedCarrera } = await getUser();
  const cursos = aprobarCursosInscritos(
    await getAvanceAgrupado(selectedCarrera)
  ).filter((curso) => curso.codigo !== `ECIN-0${selectedCarrera.codigo}`);

  return <NuevaProyeccionView cursosIniciales={cursos} />;
}
