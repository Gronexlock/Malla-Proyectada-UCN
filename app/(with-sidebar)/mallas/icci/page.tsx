import { MallaView } from "@/components/malla-view";
import { CursoMalla } from "@/src/types/curso";
import { fetchMalla } from "@/src/lib/malla";

export default async function Page() {
  const malla: CursoMalla[] = await fetchMalla("8606", "202320");

  return (
    <div className="p-4">
      <MallaView cursos={malla} codigoCarrera="8606" />
    </div>
  );
}
