import { Card, CardContent } from "@/components/ui/card";
import { ListChecks } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Curso } from "@/src/types/curso";
import { Badge } from "./ui/badge";

export type CursoCardProps = {
  curso: Curso;
  onClick?: () => void;
};

const statusColors: Record<Curso["status"], string> = {
  APROBADO: "bg-green-500",
  REPROBADO: "bg-red-500",
  INSCRITO: "bg-yellow-400",
  PENDIENTE: "",
};

export function CursoCard({ curso, onClick }: CursoCardProps) {
  return (
    <Card
      className={`rounded-md p-0 w-36 shadow-sm overflow-hidden relative ${
        onClick
          ? "cursor-pointer hover:bg-zinc-50 hover:-translate-y-1 transition-all"
          : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-0 flex h-full">
        <div
          className={`w-1.5 ${statusColors[curso.status]} absolute h-full`}
        ></div>
        <div className="flex flex-col flex-1">
          <div className={`h-6 flex justify-end pr-0.5 items-center border-b`}>
            <span className="font-semibold pr-1 text-xs">{curso.codigo}</span>
          </div>
          <div className="px-2 flex h-12 flex-col justify-center items-center">
            <p className="text-sm text-center text-wrap">{curso.asignatura}</p>
          </div>
          <div className="flex justify-end items-center p-1 gap-1.5">
            {curso.prerrequisitos.length > 0 && (
              <HoverCard openDelay={200} closeDelay={200}>
                <HoverCardTrigger>
                  <ListChecks className="text-zinc-900" size={20} />
                </HoverCardTrigger>
                <HoverCardContent className="flex justify-center w-40">
                  <div className="flex flex-col gap-1">
                    <h2 className="font-bold text-sm text-center">
                      PRERREQUISITOS
                    </h2>
                    <hr />
                    {curso.prerrequisitos.map((pre) => (
                      <p key={pre.codigo} className="text-xs">
                        • {pre.asignatura}
                      </p>
                    ))}
                  </div>
                </HoverCardContent>
              </HoverCard>
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
