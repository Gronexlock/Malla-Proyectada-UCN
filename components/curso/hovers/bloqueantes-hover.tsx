import { Curso } from "@/src/types/curso";
import { Lock } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../ui/hover-card";

export type PendientesHoverProps = {
  cursos?: Curso[];
};

export function PendientesHover({ cursos }: PendientesHoverProps) {
  return (
    <HoverCard openDelay={200} closeDelay={200}>
      <HoverCardTrigger>
        <Lock className="text-orange-600" size={18} strokeWidth={2.4} />
      </HoverCardTrigger>
      <HoverCardContent className="flex justify-center w-48">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm text-center font-semibold">
            BLOQUEADO POR:
            <span className="font-bold"> CURSOS PENDIENTES</span>
          </h2>
          {cursos && cursos.length > 0 && (
            <>
              <hr className="border-t border-gray-300 my-1" />
              {cursos.map((curso) => (
                <p key={curso.codigo} className="text-xs">
                  • {curso.asignatura}
                </p>
              ))}
            </>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
