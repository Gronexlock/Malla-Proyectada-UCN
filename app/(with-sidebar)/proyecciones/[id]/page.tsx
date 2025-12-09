import { ProyeccionView } from "@/components/proyeccion/proyeccion-view";
import { getUser } from "@/src/actions/cookiesActions";
import { getProyeccionById } from "@/src/utils/proyeccionUtils";

export default async function ProyeccionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { selectedCarrera } = await getUser();
  const proyeccion = await getProyeccionById(Number(id), selectedCarrera!);

  return (
    <div className="p-4">
      <ProyeccionView proyeccion={proyeccion} />
    </div>
  );
}
