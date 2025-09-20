import { MallaView } from "@/components/malla-view";
import { CursoMalla } from "@/src/types/curso";
import { fetchMalla } from "@/src/lib/malla";

export default async function Page() {
  const malla: CursoMalla[] = await fetchMalla("8606", "201610");

  return (
    <div className="p-4">
      <MallaView cursos={malla} />
    </div>
  );
}
