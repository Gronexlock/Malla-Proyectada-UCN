"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Curso } from "@/src/types/curso";
import { Plus, Search } from "lucide-react";

type ListaCursosDisponiblesProps = {
  cursos: Curso[];
  onAgregarCurso: (curso: Curso) => void;
};

export function ListaCursosDisponibles({
  cursos,
  onAgregarCurso,
}: ListaCursosDisponiblesProps) {
  return (
    <div className="dark:bg-zinc-900 bg-muted shadow-sm border dark:border-zinc-700 rounded-lg flex flex-col gap-2 min-h-0 py-8">
      <header className="px-3">Buscar Cursos Disponibles</header>
      <div className="px-3 pt-2">
        <InputGroup>
          <InputGroupAddon>
            <Search size={16} />
          </InputGroupAddon>
          <InputGroupInput placeholder="Buscar curso por código o nombre..." />
        </InputGroup>
      </div>
      <div className="flex-1 overflow-y-auto pt-2 gap-2 flex flex-col px-3 min-h-0">
        {cursos.map((curso) => (
          <div
            key={curso.codigo}
            className="flex border items-center rounded-lg p-2 justify-between hover:bg-zinc-200 dark:hover:bg-secondary transition-all hover:cursor-pointer dark:hover:border-green-500/50 hover:border-green-500/70"
            onClick={() => onAgregarCurso(curso)}
          >
            <div className="flex flex-col">
              <span className="font-mono text-xs text-muted-foreground">
                {curso.codigo}
              </span>
              <span className="">{curso.asignatura}</span>
              <div className="flex mt-1 gap-1">
                <div className="flex border border-zinc-300 dark:border-zinc-700 h-5 px-2 items-center justify-center rounded-full">
                  <span className="text-[10px] font-semibold">
                    {curso.creditos} SCT
                  </span>
                </div>
              </div>
            </div>
            <div className="mr-1 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded p-1 transition-all">
              <Plus size={18} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
