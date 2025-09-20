import { Card, CardContent } from "@/components/ui/card";

type CursoAvanceCardProps = {
  nrc: string;
  codigo: string;
  asignatura: string;
  status: "APROBADO" | "REPROBADO" | "INSCRITO" | "PENDIENTE";
};

const statusColors: Record<string, string> = {
  APROBADO: "bg-green-400",
  REPROBADO: "bg-red-400",
  INSCRITO: "bg-yellow-400",
  PENDIENTE: "border-b",
};

export function CursoCronoCard({
  nrc,
  codigo,
  asignatura,
  status,
}: CursoAvanceCardProps) {
  return (
    <Card className="rounded-md p-0 w-36 h-20 shadow-sm overflow-hidden">
      <CardContent className="p-0 flex flex-col justify-start h-full">
        <div
          className={`h-8 flex ${statusColors[status]} justify-between p-1 items-center`}
        >
          <span className="font-semibold pr-1 text-xs">{nrc}</span>
          <span className="font-semibold pr-1 text-xs">{codigo}</span>
        </div>
        <div className="px-1 flex flex-col justify-center items-center h-full">
          <p className="text-sm text-center text-wrap">{asignatura}</p>
        </div>
      </CardContent>
    </Card>
  );
}
