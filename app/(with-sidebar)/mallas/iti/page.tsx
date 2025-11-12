import { MallaView } from "@/components/malla-view";
import { fetchMalla } from "@/src/actions/malla";

export default async function Page() {
  const malla = await fetchMalla("8266", "202410");

  if (malla.length === 0) {
    return "Error";
  }

  return <MallaView cursos={malla} />;
}
