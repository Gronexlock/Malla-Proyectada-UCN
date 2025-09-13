import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils"; // util para combinar clases
import { Lock, Info } from "lucide-react"; // íconos opcionales

type CourseCardProps = {
  name: string;
  code: string;
  nf?: number; // nota final
  sct: number; // créditos
  status?: "aprobado" | "pendiente" | "cursando" | "bloqueado";
  prereqsCount?: number; // ej: cuántos requisitos tiene
};

export function CourseCard({
  name,
  code,
  nf,
  sct,
  status = "pendiente",
  prereqsCount = 0,
}: CourseCardProps) {
  // Color lateral según estado
  const statusColor = {
    aprobado: "border-l-green-500",
    cursando: "border-l-yellow-500",
    pendiente: "border-l-gray-300",
    bloqueado: "border-l-red-500",
  }[status];

  return (
    <Card
      className={cn("relative w-60 mb-4 border-l-4 shadow-sm", statusColor)}
    >
      <CardContent className="p-3 flex flex-col gap-1">
        {/* Código + Créditos */}
        <div className="text-xs text-muted-foreground flex justify-between">
          <span>{code}</span>
          <span>{sct} SCT</span>
        </div>

        {/* Nombre del curso */}
        <h3 className="font-semibold text-sm leading-tight">{name}</h3>

        {/* Nota final */}
        {nf !== undefined && (
          <Badge variant="outline" className="mt-1 w-fit">
            NF: {nf}
          </Badge>
        )}

        {/* Íconos opcionales */}
        <div className="absolute top-2 right-2 flex gap-1">
          {status === "bloqueado" && (
            <Lock className="h-4 w-4 text-muted-foreground" />
          )}
          {prereqsCount > 0 && (
            <Info className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
