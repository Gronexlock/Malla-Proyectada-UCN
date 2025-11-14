import { AvanceView } from "@/components/avance-view";
import { fetchAvance } from "@/src/actions/avanceActions";
import { getUser } from "@/src/actions/cookiesActions";
import { fetchMalla } from "@/src/actions/mallaActions";
import { getMallaConAvance } from "@/src/utils/cursosUtils";

export default async function Page() {
  const user = await getUser();
  const { rut, selectedCarrera } = user;

  const [cursos, avance] = await Promise.all([
    fetchMalla(selectedCarrera.codigo, selectedCarrera.catalogo),
    fetchAvance(rut, selectedCarrera.codigo),
  ]);
  const cursosConAvance = getMallaConAvance(cursos, avance);

  return (
    <div className="p-4">
      <AvanceView cursos={cursosConAvance} />
    </div>
  );
}
