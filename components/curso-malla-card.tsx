import { Card, CardContent } from "@/components/ui/card";
import { ListChecks } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

export type CursoMallaCardProps = {
  codigo: string;
  asignatura: string;
  creditos: number;
  prereq: string[];
};

export function CursoMallaCard({
  codigo,
  asignatura,
  creditos,
  prereq,
}: CursoMallaCardProps) {
  return (
    <Card className={`rounded-md p-0 w-36 h-20 shadow-sm overflow-hidden`}>
      <CardContent className="p-0 flex flex-col justify-start h-full">
        <div className="h-8 border-b flex justify-between p-1 items-center">
          <div className="flex gap-1.5">
            <div className="w-5 h-5 bg-zinc-900 text-white rounded-full font-semibold flex justify-center items-center text-xs">
              {creditos}
            </div>
            {prereq.length > 0 && (
              <HoverCard openDelay={200} closeDelay={200}>
                <HoverCardTrigger>
                  <ListChecks className="text-zinc-900" size={20} />
                </HoverCardTrigger>
                <HoverCardContent className="flex justify-center w-40">
                  <div className="flex flex-col gap-1">
                    <h2 className="font-semibold text-sm">Prerrequisitos</h2>
                    <hr />
                    {prereq.map((pre) => (
                      <p key={pre} className="text-xs">
                        • {pre}
                      </p>
                    ))}
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
          <span className="font-semibold pr-1 text-xs">{codigo}</span>
        </div>
        <div className="px-1 flex flex-col justify-center items-center h-full">
          <p className="text-sm text-center text-wrap">{asignatura}</p>
        </div>
      </CardContent>
    </Card>
  );
}
