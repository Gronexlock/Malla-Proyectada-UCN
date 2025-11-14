import { AvanceCronoView } from "@/components/avance-crono-view";
import { getUser } from "@/src/actions/cookiesActions";
import { getAvanceCronologico } from "@/src/utils/cursosUtils";

export default async function Page() {
  const user = await getUser();
  const { rut, selectedCarrera } = user;

  const cursos = await getAvanceCronologico(rut, selectedCarrera);

  return (
    <div className="p-4 ">
      <AvanceCronoView cursos={cursos} />
    </div>
  );
}
