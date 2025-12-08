"use client";

import { Skeleton } from "../ui/skeleton";

export default function ProyeccionesViewSkeleton() {
  const proyecciones = Array.from({ length: 3 }, (_, i) => ({ index: i + 1 }));

  return (
    <div className="flex flex-col w-full gap-8 max-w-7xl">
      <div className="grid grid-cols-3 grid-rows-1 gap-4">
        <Skeleton className="shadow-md bg-zinc-50 dark:bg-zinc-900 border rounded-lg h-32 flex items-center justify-center gap-3"></Skeleton>
        <Skeleton className="shadow-md bg-zinc-50 dark:bg-zinc-900 border rounded-lg h-32 flex items-center justify-center gap-3"></Skeleton>
        <Skeleton className="shadow-md bg-zinc-50 dark:bg-zinc-900 border rounded-lg h-32 flex items-center justify-center gap-3"></Skeleton>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {proyecciones.map((proyeccion) => {
          return (
            <Skeleton
              key={proyeccion.index}
              className="shadow-md rounded-lg border p-6 flex flex-col w-full h-100 bg-zinc-50 dark:bg-zinc-900"
            ></Skeleton>
          );
        })}
      </div>
    </div>
  );
}
