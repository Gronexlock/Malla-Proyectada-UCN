import { Card, CardContent } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { ListChecks } from "lucide-react";
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
  onClick?: () => void;
  clickable?: boolean;
};

const statusColors: Record<string, string> = {
  APROBADO: "bg-green-400",
  REPROBADO: "bg-red-400",
  INSCRITO: "bg-yellow-400",
  PENDIENTE: "border-b",
};

export function CursoAvanceCard({
  codigo,
  asignatura,
  creditos,
  status,
  prereq,
  onClick,
  clickable,
}: CursoAvanceCardProps) {
  return (
    <Card
      className={`rounded-md p-0 w-36 shadow-sm overflow-hidden ${
        clickable
          ? "cursor-pointer hover:bg-zinc-50 hover:-translate-y-1 transition-all"
          : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-0 flex flex-col justify-start h-full">
        <div
          className={`h-8 flex ${statusColors[status]} justify-between p-1 items-center`}
        >
          <div className="flex gap-1">
            <Badge className="rounded-full h-5 w-5">{creditos}</Badge>
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
                        • {pre.asignatura}
                      </p>
                    ))}
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
          <span className="font-semibold pr-1 text-xs">{codigo}</span>
        </div>
        <div className="px-1 flex h-14 flex-col justify-center items-center">
          <p className="text-sm text-center text-wrap">{asignatura}</p>
        </div>
      </CardContent>
    </Card>
  );
}
