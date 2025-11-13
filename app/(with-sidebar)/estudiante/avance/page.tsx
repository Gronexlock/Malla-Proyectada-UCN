import { AvanceView } from "@/components/avance-view";
import { fetchAvance } from "@/src/actions/avanceActions";
import { fetchMalla } from "@/src/actions/mallaActions";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();

  const rut = JSON.parse(cookieStore.get("rut")?.value || "{}");
  const selectedCarrera = JSON.parse(
    cookieStore.get("selectedCarrera")?.value || "{}"
  );

  if (!rut.rut || !selectedCarrera.codigo || !selectedCarrera.catalogo) {
    return "Error";
  }

  const [cursos, avance] = await Promise.all([
    fetchMalla(selectedCarrera.codigo, selectedCarrera.catalogo),
    fetchAvance(rut.rut, selectedCarrera.codigo),
  ]);

  return (
    <div className="p-4">
      <AvanceView cursos={cursos} avance={avance} />
    </div>
  );
}
