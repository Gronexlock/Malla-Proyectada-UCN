import { AvanceView } from "@/components/views/avance-view";
import { getUser } from "@/src/actions/cookiesActions";
import { getAvanceCurricular } from "@/src/utils/cursosUtils";

export default async function Page() {
  const user = await getUser();
  const { rut, selectedCarrera } = user;

  const cursos = await getAvanceCurricular(selectedCarrera);

  return (
    <div className="p-4">
      <AvanceView cursos={cursos} />
    </div>
  );
}
