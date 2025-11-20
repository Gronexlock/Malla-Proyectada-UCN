import ProyeccionesView from "@/components/proyecciones-view";
import { getUser } from "@/src/actions/cookiesActions";
import { getProyecciones } from "@/src/utils/proyeccionUtils";

export default async function ProyeccionesPage() {
  const { selectedCarrera } = await getUser();
  const proyecciones = await getProyecciones(selectedCarrera);

  return <ProyeccionesView proyecciones={proyecciones} />;
}
