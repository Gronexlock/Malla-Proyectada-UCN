import { MallaView } from "@/components/malla-view";
import { fetchMalla } from "@/src/actions/mallaActions";

export default async function Page() {
  const malla = await fetchMalla("8606", "202320");

  if (malla.length === 0) {
    return "Error";
  }

  return <MallaView cursos={malla} />;
}
