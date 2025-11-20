import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Curso, CursoStatus } from "@/src/types/curso";
import { ListChecks, Lock } from "lucide-react";
import { CursoHover } from "./curso-hover";
import { Badge } from "./ui/badge";

export type CursoCardProps = {
  curso: Curso;
  muted?: boolean;
  bloqueantes?: Curso[];
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
  muted,
  bloqueantes,
  onClick,
}: CursoCardProps) {
  return (
    <Card
      className={cn(
        "rounded-md p-0 w-36 shadow-sm overflow-hidden relative",
        onClick &&
          bloqueantes &&
          bloqueantes.length === 0 &&
          "cursor-pointer hover:bg-zinc-50 hover:-translate-y-1 transition-all",
        muted || (bloqueantes && bloqueantes.length > 0) ? "opacity-50" : ""
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
          <div className="flex justify-end items-center p-1 gap-1.5">
            {bloqueantes && bloqueantes.length > 0 && (
              <CursoHover
                cursos={bloqueantes}
                title="BLOQUEADO POR"
                icon={
                  <Lock
                    className="text-orange-600"
                    size={18}
                    strokeWidth={2.4}
                  />
                }
              />
            )}
            {curso.prerrequisitos.length > 0 && (
              <CursoHover
                cursos={curso.prerrequisitos}
                title="PRERREQUISITOS"
                icon={<ListChecks className="text-zinc-900" size={20} />}
              />
            )}
            <Badge className="rounded-full h-5 w-5 font-semibold">
              {curso.creditos}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
