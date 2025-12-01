import { ProyeccionHeaderView } from "@/components/header/header-view";
import { AvanceCronoView } from "@/components/views/avance-crono-view";
import { getUser } from "@/src/actions/cookiesActions";
import { getAvanceCronologico } from "@/src/utils/cursosUtils";

export default async function Page() {
  const { selectedCarrera } = await getUser();
  const cursos = await getAvanceCronologico(selectedCarrera);

  return (
    <>
    <ProyeccionHeaderView selectedCarrera={selectedCarrera} />
    <div className="p-4 ">
      <AvanceCronoView cursos={cursos} />
    </div>
    </>
  );
}
