import { Card, CardContent } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { ListChecks, Lock } from "lucide-react";
import { Badge } from "./ui/badge";

type CursoAvanceCardProps = {
  codigo: string;
  asignatura: string;
  creditos: number;
  status: "APROBADO" | "REPROBADO" | "INSCRITO" | "PENDIENTE";
  prereq: {
    codigo: string;
    asignatura: string;
  }[];
  bloqueantes?: {
    codigo: string;
    asignatura: string;
  }[];
  onClick?: () => void;
  clickable?: boolean;
};

const statusColors: Record<string, string> = {
  APROBADO: "bg-green-500",
  REPROBADO: "bg-red-400",
  INSCRITO: "bg-yellow-400",
  PENDIENTE: "",
};
export function CursoAvanceCard({
  codigo,
  asignatura,
  creditos,
  status,
  prereq,
  bloqueantes,
  onClick,
  clickable,
}: CursoAvanceCardProps) {
  return (
    <Card
      className={`rounded-md p-0 w-36 shadow-sm overflow-hidden relative ${
        clickable
          ? "cursor-pointer hover:bg-zinc-50 hover:-translate-y-1 transition-all"
          : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-0 flex h-full">
        <div className={`w-1.5 ${statusColors[status]} absolute h-full`}></div>
        <div className="flex flex-col flex-1">
          <div className={`h-6 flex justify-end pr-0.5 items-center border-b`}>
            <span className="font-semibold pr-1 text-xs">{codigo}</span>
          </div>
          <div className="px-2 flex h-12 flex-col justify-center items-center">
            <p className="text-sm text-center text-wrap">{asignatura}</p>
          </div>
          <div className="flex justify-end items-center p-1 gap-1.5 ">
            {bloqueantes && bloqueantes.length > 0 && (
              <HoverCard openDelay={200} closeDelay={200}>
                <HoverCardTrigger>
                  <Lock size={16} className="text-amber-700" />
                </HoverCardTrigger>
                <HoverCardContent className="flex justify-center w-40">
                  <div className="flex flex-col gap-1">
                    <h2 className="font-bold text-sm text-center">
                      BLOQUEADO POR
                    </h2>
                    <hr />
                    {bloqueantes.map((bloq) => (
                      <p key={bloq.codigo} className="text-xs">
                        • {bloq.asignatura} {bloq.codigo}
                      </p>
                    ))}
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}
            {prereq.length > 0 && (
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
                    {prereq.map((pre) => (
                      <p key={pre.codigo} className="text-xs">
                        • {pre.asignatura} {pre.codigo}
                      </p>
                    ))}
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}
            <Badge className="rounded-full h-5 w-5 font-semibold">
              {creditos}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
