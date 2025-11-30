import { Curso } from "@/src/types/curso";
import { ListChecks } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../ui/hover-card";

export type PrerrequisitosHoverProps = {
  cursos?: Curso[];
};

export function PrerrequisitosHover({ cursos }: PrerrequisitosHoverProps) {
  return (
    <HoverCard openDelay={200} closeDelay={200}>
      <HoverCardTrigger>
        <ListChecks className="text-zinc-800" size={20} strokeWidth={2.4} />
      </HoverCardTrigger>
      <HoverCardContent className="flex justify-center w-48">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm text-center font-semibold">PRERREQUISITOS</h2>
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
