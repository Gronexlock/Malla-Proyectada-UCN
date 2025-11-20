import { Curso } from "@/src/types/curso";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

export type CursoHoverProps = {
  cursos: Curso[];
  title: string;
  icon: React.ReactNode;
};

export function CursoHover({ cursos, title, icon }: CursoHoverProps) {
  return (
    <HoverCard openDelay={200} closeDelay={200}>
      <HoverCardTrigger>{icon}</HoverCardTrigger>
      <HoverCardContent className="flex justify-center w-40">
        <div className="flex flex-col gap-1">
          <h2 className="font-bold text-sm text-center">{title}</h2>
          <hr />
          {cursos.map((curso) => (
            <p key={curso.codigo} className="text-xs">
              • {curso.asignatura}
            </p>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
