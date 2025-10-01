import { CursoMalla } from "@/src/types/curso";
import { CursoAvanceCard } from "./curso-avance-card";
import { CursoAvance } from "@/src/types/curso";
import { Button } from "./ui/button";

type ProyeccionContainerProps = {
  altura: number;
  proyeccion: CursoMalla[];
  semestre: string;
  onGuardar: (semestre: string) => void;
  avance: CursoAvance[];
  getCursoStatus: (
    codigo: string,
    avance: CursoAvance[]
  ) => CursoAvance["status"] | "PENDIENTE";
};

export function ProyeccionContainer({
  altura,
  proyeccion,
  semestre,
  onGuardar,
  avance,
  getCursoStatus,
}: ProyeccionContainerProps) {
  return (
    <div
      className={`sticky right-0 w-64 h-[${altura}px] bg-white border rounded-md shadow flex items-center overflow-y-auto flex-col p-4 text-wrap text-center`}
    >
      <h2 className="font-bold text-lg mb-4">Proyección</h2>
      {proyeccion.length === 0 ? (
        <div className="text-gray-400 text-sm">
          Selecciona cursos pendientes o reprobados para agregarlos aquí.
        </div>
      ) : (
        <div className="flex flex-col h-full justify-between">
          <ul className="space-y-4">
            {proyeccion.map((curso) => (
              <li
                key={curso.codigo}
                className="relative group flex justify-center"
              >
                <CursoAvanceCard
                  asignatura={curso.asignatura}
                  codigo={curso.codigo}
                  creditos={curso.creditos}
                  status={getCursoStatus(curso.codigo, avance)}
                />
              </li>
            ))}
          </ul>
          <Button
            className="cursor-pointer"
            onClick={() => onGuardar(semestre)}
          >
            Guardar Proyección
          </Button>
        </div>
      )}
    </div>
  );
}
