import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Curso } from "@/src/types/curso";
import { getLevelColor } from "@/src/utils/mallaUtils";
import { ColorConfig } from "../views/malla-view";

export type CursoCardProps = {
  curso: Curso;
  colorConfig: ColorConfig;
};

export function CursoCard({ curso, colorConfig }: CursoCardProps) {
  const color = getLevelColor(
    curso.nivel,
    colorConfig.totalLevels,
    colorConfig.cardStart,
    colorConfig.cardEnd
  );

  return (
    <Card
      className={cn("rounded p-0 w-36 shadow-xs overflow-hidden relative")}
      style={{ backgroundColor: color }}
    >
      <div className="absolute text-xs right-0.5 top-0.5">{curso.creditos}</div>
      <CardContent className="p-0 flex h-full">
        <div className="flex flex-col flex-1">
          <div className="px-2 py-8 flex h-12 flex-col justify-center items-center">
            <p className="text-sm text-center text-wrap">{curso.asignatura}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
