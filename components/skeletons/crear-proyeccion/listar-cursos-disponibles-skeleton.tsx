"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

export function ListaCursosDisponiblesSkeleton() {
  const cursos = Array.from({ length: 5 }).map((_, index) => ({
    codigo: `CURSO-00${index + 1}`,
  }));

  return (
    <div className="dark:bg-zinc-900 bg-muted shadow-md border dark:border-zinc-700 rounded-lg flex flex-col gap-2 min-h-0 py-8">
      <header className="px-3">Buscar Cursos Disponibles</header>
      <div className="px-3 pt-2">
        <InputGroup>
          <InputGroupAddon>
            <Search size={16} />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Buscar curso por código o nombre..."
            value={""}
            onChange={() => {}}
            disabled={true}
          />
        </InputGroup>
      </div>
      <ScrollArea className="flex-1 min-h-0">
        <div className="pt-2 gap-2 flex flex-col px-3">
          {cursos.map((curso) => (
            <Skeleton
              key={curso.codigo}
              className="border rounded-lg p-2 shadow-sm h-[82px]"
            ></Skeleton>
          ))}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
