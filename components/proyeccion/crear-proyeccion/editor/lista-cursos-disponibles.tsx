"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Curso } from "@/src/types/curso";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

type ListaCursosDisponiblesProps = {
  cursos: Curso[];
  onAgregarCurso: (curso: Curso) => void;
};

export function ListaCursosDisponibles({
  cursos,
  onAgregarCurso,
}: ListaCursosDisponiblesProps) {
  const [busqueda, setBusqueda] = useState("");

  const normalizarTexto = (texto: string) =>
    texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const cursosFiltrados = useMemo(() => {
    if (!busqueda.trim()) return cursos;

    const terminoBusqueda = normalizarTexto(busqueda);
    return cursos.filter(
      (curso) =>
        normalizarTexto(curso.codigo).includes(terminoBusqueda) ||
        normalizarTexto(curso.asignatura).includes(terminoBusqueda)
    );
  }, [cursos, busqueda]);

  return (
    <div className="dark:bg-zinc-900 bg-muted shadow-md border dark:border-zinc-700 rounded-lg flex flex-col gap-2 min-h-0 py-4">
      <div className="flex justify-between items-center">
        <header className="px-3">Buscar Cursos Disponibles</header>
        <div className="px-3 w-1/2">
          <InputGroup>
            <InputGroupAddon>
              <Search size={16} />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Buscar curso por código o nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </InputGroup>
        </div>
      </div>
      <ScrollArea className="flex-1 min-h-0  flex flex-col">
        <div className="pt-2 gap-2 flex flex-col px-3 h-full flex-1">
          {cursosFiltrados.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No se encontraron cursos
            </div>
          ) : (
            cursosFiltrados.map((curso) => (
              <div
                key={curso.codigo}
                className="flex border items-center rounded-lg p-2 shadow-sm justify-between hover:bg-zinc-200 dark:hover:bg-secondary transition-all hover:cursor-pointer dark:hover:border-green-500/50 hover:border-green-500/70"
                onClick={() => onAgregarCurso(curso)}
              >
                <div className="flex flex-col">
                  <span className="font-mono text-xs text-muted-foreground">
                    {curso.codigo}
                  </span>
                  <span className="">{curso.asignatura}</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex mt-1 gap-1">
                    <div className="flex border border-zinc-300 dark:border-zinc-700 h-5 px-2 items-center justify-center rounded-full">
                      <span className="text-[10px] font-semibold">
                        {curso.creditos} SCT
                      </span>
                    </div>
                  </div>
                  <div className="mr-1 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded p-1 transition-all">
                    <Plus size={18} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
