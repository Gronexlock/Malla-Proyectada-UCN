import { Card, CardContent } from "@/components/ui/card";
import type { CursoMalla } from "@/src/types/curso";

export function CursoMallaCard({
  codigo,
  asignatura,
  creditos,
  nivel,
  prereq,
}: CursoMalla) {
  return (
    <Card className="rounded-md p-0 w-36 h-20 shadow-sm overflow-hidden">
      <CardContent className="p-0 flex flex-col justify-start h-full">
        <div className="h-8 border-gray-300 border-b shadow-xs flex justify-between p-1">
          <div className="w-5 h-5 bg-black rounded-full text-white font-semibold flex justify-center items-center text-xs">
            {creditos}
          </div>
          <span className="font-semibold text-sm">{codigo}</span>
        </div>
        <div className="px-1 flex flex-col justify-center items-center h-full">
          <p className="text-sm text-center text-wrap">{asignatura}</p>
        </div>
      </CardContent>
    </Card>
  );
}
