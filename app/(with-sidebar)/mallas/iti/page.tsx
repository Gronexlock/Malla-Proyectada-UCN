import { MallaView } from "@/components/malla-view";
import { fetchMalla } from "@/src/actions/mallaActions";
import { carreras } from "@/src/constants/carreras";

export default async function Page() {
  const carrera = carreras["iti"];
  const malla = await fetchMalla(carrera.codigo, carrera.catalogo);

  // TODO: crear página de error
  if (malla.length === 0) {
    return "Error";
  }

  return <MallaView cursos={malla} />;
}
