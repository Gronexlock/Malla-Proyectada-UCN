import { Card, CardContent } from "@/components/ui/card";

type CursoMallaCardProps = {
  asignatura: string;
  creditos: number;
  nivel: number;
};

export function CursoMallaCard({
  asignatura,
  creditos,
  nivel,
}: CursoMallaCardProps) {
  function getColorForLevel(nivel: number): string {
    const baseLightness = 90;
    const step = 2;

    const lightness = Math.max(20, baseLightness - (nivel - 1) * step);

    return `hsl(0, 0%, ${lightness}%)`;
  }

  return (
    <Card
      className="rounded p-0 w-36 h-18 shadow-xs overflow-hidden relative"
      style={{ backgroundColor: getColorForLevel(nivel) }}
    >
      <div className="absolute text-xs flex w-full justify-end right-1">
        {creditos}
      </div>
      <CardContent className="p-0 flex items-center h-full">
        <div className="flex flex-col flex-1">
          <div className="px-2 flex flex-col justify-center items-center">
            <p className="text-sm text-center text-wrap">{asignatura}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
