import { Card, CardContent } from "@/components/ui/card";
import type { CursoMalla } from "@/src/types/curso";

export function CursoMalla({
  codigo,
  asignatura,
  creditos,
  nivel,
  prereq,
}: CursoMalla) {
  return (
    <Card className="rounded-md relative w-36 h-24 mb-4 shadow-sm overflow-hidden">
      <CardContent className="p-3 flex flex-col gap-1 relative justify-center h-full">
        <h3 className="font-semibold text-sm text-center text-wrap">
          {asignatura}
        </h3>
      </CardContent>
    </Card>
  );
}
