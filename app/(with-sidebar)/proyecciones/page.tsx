import { ProyeccionHeaderView } from "@/components/header/header-view";
import ProyeccionesView from "@/components/proyeccion/proyecciones-view";
import { getUser } from "@/src/actions/cookiesActions";
import { getProyecciones } from "@/src/utils/proyeccionUtils";

export default async function ProyeccionesPage() {
  const { selectedCarrera } = await getUser();
  const proyecciones = await getProyecciones(selectedCarrera);

  return (  
    <>
      <ProyeccionHeaderView selectedCarrera={selectedCarrera} />
      <ProyeccionesView proyecciones={proyecciones} />
    </>  
    );
  }
