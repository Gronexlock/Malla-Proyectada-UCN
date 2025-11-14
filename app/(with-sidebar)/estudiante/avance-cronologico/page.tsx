import { AvanceCronoView } from "@/components/avance-crono-view";
import { getUser } from "@/src/actions/cookiesActions";
import { getAvanceCronologico } from "@/src/utils/cursosUtils";

export default async function Page() {
  const { rut, selectedCarrera } = await getUser();
  const cursos = await getAvanceCronologico(rut, selectedCarrera);

  return (
    <div className="p-4 ">
      <AvanceCronoView cursos={cursos} />
    </div>
  );
}
