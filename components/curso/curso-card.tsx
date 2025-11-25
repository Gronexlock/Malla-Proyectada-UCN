import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Curso, CursoStatus } from "@/src/types/curso";
import { Badge } from "../ui/badge";
import { PendientesHover } from "./hovers/bloqueantes-hover";
import { DispersionHover } from "./hovers/dispersion-hover";
import { PrerrequisitosHover } from "./hovers/prereq-hover";

export type CursoCardProps = {
  curso: Curso;
  ignorarRestricciones?: boolean;
  bloqueantes?: Curso[];
  disperso?: boolean;
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
  ignorarRestricciones,
  bloqueantes,
  disperso,
  onClick,
}: CursoCardProps) {
  const esClickeable =
    !curso.status.includes(CursoStatus.APROBADO) &&
    (ignorarRestricciones || (!bloqueantes?.length && !disperso));
  return (
    <Card
      className={cn(
        "rounded-md p-0 w-36 shadow-sm overflow-hidden relative",
        esClickeable
          ? "cursor-pointer hover:bg-zinc-50 hover:-translate-y-1 transition-all"
          : "opacity-50"
      )}
      onClick={onClick}
    >
      <CardContent className="p-0 flex h-full">
        <div
          className={`w-1.5 ${statusColors[curso.status[0]]} absolute h-full`}
        ></div>
        <div className="flex flex-col flex-1">
          <div className={`h-6 flex justify-end pr-0.5 items-center border-b`}>
            <span className="font-semibold pr-1 text-xs">{curso.codigo}</span>
          </div>
          <div className="px-2 flex h-12 flex-col justify-center items-center">
            <p className="text-sm text-center text-wrap">{curso.asignatura}</p>
          </div>
          <div className="flex justify-between items-center p-1">
            <div className="flex gap-1 items-center pl-1">
              {disperso && <DispersionHover nivelNecesario={curso.nivel - 2} />}
              {bloqueantes && bloqueantes.length > 0 && (
                <PendientesHover cursos={bloqueantes} />
              )}
            </div>
            <div className="flex gap-1 items-center">
              {curso.prerrequisitos.length > 0 && (
                <PrerrequisitosHover cursos={curso.prerrequisitos} />
              )}
              <Badge className="rounded-full h-5 w-5 font-semibold">
                {curso.creditos}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
