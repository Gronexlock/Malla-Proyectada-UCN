import { getUser } from "@/src/actions/cookiesActions";
import { getProyecciones } from "@/src/utils/proyeccionUtils";

export default async function NuevaProyeccionPage() {
  const { selectedCarrera } = await getUser();
  const proyecciones = await getProyecciones(selectedCarrera);

  return (
    <div>
      <pre>{JSON.stringify(proyecciones, null, 2)}</pre>
    </div>
  );
}
