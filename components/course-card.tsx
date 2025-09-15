import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Lock, Info } from "lucide-react";

type CourseCardProps = {
  name: string;
  code: string;
  sct: number;
  status?: "aprobado" | "pendiente" | "cursando" | "bloqueado";
  prereqsCount?: number;
};

export function CourseCard({
  name,
  code,
  sct,
  status = "pendiente",
  prereqsCount = 0,
}: CourseCardProps) {
  const statusColor = {
    aprobado: "bg-green-500",
    cursando: "bg-yellow-500",
    pendiente: "bg-gray-300",
    bloqueado: "bg-red-500",
  }[status];

  return (
    <Card className="relative w-36 mb-4 shadow-sm overflow-hidden">
      <div
        className={cn("absolute left-0 top-0 h-full", statusColor, "w-2")}
        aria-hidden="true"
      />
      <CardContent className="ml-2 pl-12 p-3 flex flex-col gap-1 relative">
        <div className="text-xs text-muted-foreground flex justify-between">
          <span>{code}</span>
          <span>{sct} SCT</span>
        </div>

        <h3 className="font-semibold text-sm text-center leading-tight">
          {name}
        </h3>

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
