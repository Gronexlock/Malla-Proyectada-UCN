import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Curso, CursoStatus } from "@/src/types/curso";
import { BloqueadoHover } from "./hovers/bloqueantes-hover";

export type CursoCardProps = {
  curso: Curso;
  bloqueantes?: Curso[];
  disperso?: boolean;
  muted?: boolean;
  onClick?: () => void;
};

const statusColors: Record<CursoStatus, string> = {
  [CursoStatus.APROBADO]: "bg-green-500",
  [CursoStatus.REPROBADO]: "bg-red-500",
  [CursoStatus.INSCRITO]: "bg-yellow-400",
  [CursoStatus.PENDIENTE]: "",
};

export function CursoCard({
  curso,
  bloqueantes,
  disperso,
  muted,
  onClick,
}: CursoCardProps) {
  const isClickable = !!onClick && !curso.status.includes(CursoStatus.APROBADO);

  const tieneRestricciones =
    (bloqueantes && bloqueantes.length > 0) || disperso;

  return (
    <Card
      className={cn(
        "rounded-md p-0 w-36 shadow-sm overflow-hidden relative",
        isClickable &&
          "cursor-pointer hover:bg-zinc-50 hover:-translate-y-1 transition-all",
        muted && "opacity-50"
      )}
      onClick={isClickable ? onClick : undefined}
    >
      <CardContent className="p-0 flex h-full">
        <div
          className={`w-1.5 ${statusColors[curso.status[0]]} absolute h-full`}
        ></div>
        <div className="flex flex-col flex-1">
          <div className={`h-6 flex justify-between items-center border-b`}>
            <span
              className={cn(
                "font-semibold text-xs",
                curso.status.includes(CursoStatus.PENDIENTE) ? "pl-1" : "pl-2.5"
              )}
            >
              {curso.creditos} SCT
            </span>
            <span className="font-semibold pr-1 text-xs">{curso.codigo}</span>
          </div>
          <div className="px-2 py-8 flex h-12 flex-col justify-center items-center">
            <p className="text-sm text-center text-wrap">{curso.asignatura}</p>
          </div>
          <div className="flex justify-between items-center p-1">
            <div className="flex gap-1 items-center pl-1">
              {tieneRestricciones && (
                <BloqueadoHover
                  cursosPendientes={bloqueantes}
                  nivelDispersion={disperso ? curso.nivel : undefined}
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
