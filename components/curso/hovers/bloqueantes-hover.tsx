import { cn } from "@/lib/utils";
import { romanNumerals } from "@/src/constants/numerosRomanos";
import { Curso } from "@/src/types/curso";
import { Lock } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../ui/hover-card";

export type BloqueadoHoverProps = {
  cursosPendientes?: Curso[];
  nivelDispersion?: number;
};

export function BloqueadoHover({
  cursosPendientes,
  nivelDispersion,
}: BloqueadoHoverProps) {
  return (
    <HoverCard openDelay={200} closeDelay={200}>
      <HoverCardTrigger>
        <Lock className="text-orange-600" size={13} strokeWidth={2.4} />
      </HoverCardTrigger>
      <HoverCardContent className="p-0 max-w-52">
        <h2 className="text-center font-semibold py-2 border-b">
          BLOQUEADO POR
        </h2>
        <div>
          {cursosPendientes && cursosPendientes.length > 0 && (
            <div className="pt-2 pb-3">
              <h3 className="font-bold text-center">Cursos Pendientes</h3>
              <ul className="list-disc list-outside px-6 pt-2">
                {cursosPendientes.map((curso) => (
                  <li key={curso.codigo} className="text-xs">
                    {curso.asignatura}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {nivelDispersion !== undefined && (
            <div
              className={cn(
                "pt-2 pb-3",
                cursosPendientes && cursosPendientes.length > 0 && "border-t"
              )}
            >
              <h3 className="font-bold text-center">Dispersión</h3>
              <p className="text-xs px-4 pt-2">
                Debes tener aprobados todos los cursos hasta el semestre{" "}
                {romanNumerals[nivelDispersion - 2]}
              </p>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
