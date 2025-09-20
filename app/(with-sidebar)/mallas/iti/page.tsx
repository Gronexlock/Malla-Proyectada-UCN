import { MallaView } from "@/components/malla-view";
import { CursoMalla } from "@/src/types/curso";
import { fetchMalla } from "@/src/lib/fetchMalla";

export default async function Page() {
  const malla: CursoMalla[] = await fetchMalla("8266", "202410");

  return (
    <div className="p-4">
      <MallaView cursos={malla} />
    </div>
  );
}
