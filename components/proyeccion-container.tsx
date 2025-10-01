import { CursoMalla } from "@/src/types/curso";
import { CursoAvanceCard } from "./curso-avance-card";
import { CursoAvance } from "@/src/types/curso";

type ProyeccionContainerProps = {
  proyeccion: CursoMalla[];
  semestre: string;
  onGuardar: (semestre: string) => void;
  getCursoStatus: (codigo: string) => CursoAvance["status"] | "PENDIENTE";
};

export function ProyeccionContainer({
  proyeccion,
  semestre,
  onGuardar,
  getCursoStatus,
}: ProyeccionContainerProps) {
  return (
    <div className="w-64 h-full bg-white border rounded-md shadow flex items-center flex-col p-4 overflow-y-auto">
      <h2 className="font-bold text-lg mb-4">Proyección</h2>
      {proyeccion.length === 0 ? (
        <div className="text-gray-400 text-sm">
          Selecciona cursos pendientes o reprobados para agregarlos aquí.
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {proyeccion.map((curso) => (
              <li key={curso.codigo} className="relative group">
                <CursoAvanceCard
                  asignatura={curso.asignatura}
                  codigo={curso.codigo}
                  creditos={curso.creditos}
                  status={getCursoStatus(curso.codigo)}
                />
              </li>
            ))}
          </ul>
          <button
            onClick={() => onGuardar(semestre)}
            className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Guardar Proyección
          </button>
        </>
      )}
    </div>
  );
}
