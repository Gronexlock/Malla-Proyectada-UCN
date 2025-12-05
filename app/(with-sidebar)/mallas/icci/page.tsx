import { MallaView } from "@/components/views/malla-view";
import { carreras } from "@/src/constants/carrerasInfo";
import { getMalla } from "@/src/utils/cursosUtils";

export default async function Page() {
  const carrera = carreras["icci"];
  const cursos = await getMalla(carrera);

  // TODO: crear página de error
  if (cursos.length === 0) {
    return "Error";
  }

  return (
    <div className="p-4 flex justify-center">
      <MallaView cursos={cursos} carrera={carrera} />
    </div>
  );
}
