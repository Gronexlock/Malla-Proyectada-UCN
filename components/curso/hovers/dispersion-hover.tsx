import { MoveHorizontal } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../ui/hover-card";

export type DispersionHoverProps = {
  nivelNecesario: number;
};

export function DispersionHover({ nivelNecesario }: DispersionHoverProps) {
  return (
    <HoverCard openDelay={200} closeDelay={200}>
      <HoverCardTrigger>
        <MoveHorizontal
          className="text-orange-600"
          size={22}
          strokeWidth={2.2}
        />
      </HoverCardTrigger>
      <HoverCardContent className="flex justify-center w-48">
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold text-sm text-center">
            BLOQUEADO POR:
            <span className="font-bold"> DISPERSIÓN</span>
          </h2>
          <hr className="border-t border-gray-300 my-1" />
          <p className="text-xs">
            Necesitas tener todo aprobado hasta el
            <span className="font-bold"> nivel {nivelNecesario}</span>
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
