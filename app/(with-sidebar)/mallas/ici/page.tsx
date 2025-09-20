import { MallaView } from "@/components/malla-view";
import { CursoMalla } from "@/src/types/curso";
import { fetchMalla } from "@/src/lib/fetchMalla";

export default async function Page() {
  const malla: CursoMalla[] = await fetchMalla("8616", "202310");

  return (
    <div className="">
      <MallaView cursos={malla} />
    </div>
  );
}
