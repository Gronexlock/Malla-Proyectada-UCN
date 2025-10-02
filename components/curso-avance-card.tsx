import { Card, CardContent } from "@/components/ui/card";

type CursoAvanceCardProps = {
  codigo: string;
  asignatura: string;
  creditos: number;
  status: "APROBADO" | "REPROBADO" | "INSCRITO" | "PENDIENTE";
  onClick?: () => void;
};

const statusColors: Record<string, string> = {
  APROBADO: "bg-green-400",
  REPROBADO: "bg-red-400",
  INSCRITO: "bg-yellow-400",
  PENDIENTE: "border-b",
};

export function CursoAvanceCard({
  codigo,
  asignatura,
  creditos,
  status,
  onClick,
}: CursoAvanceCardProps) {
  return (
    <Card
      className="rounded-md p-0 w-36 h-20 shadow-sm overflow-hidden"
      onClick={onClick}
    >
      <CardContent className="p-0 flex flex-col justify-start h-full">
        <div
          className={`h-8 flex ${statusColors[status]} justify-between p-1 items-center`}
        >
          <div className="w-5 h-5 bg-zinc-900 text-white rounded-full font-semibold flex justify-center items-center text-xs">
            {creditos}
          </div>
          <span className="font-semibold pr-1 text-xs">{codigo}</span>
        </div>
        <div className="px-1 flex flex-col justify-center items-center h-full">
          <p className="text-sm text-center text-wrap">{asignatura}</p>
        </div>
      </CardContent>
    </Card>
  );
}
