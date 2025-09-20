"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface MallaSkeletonProps {
  nombreCarrera: string;
}

export function MallaSkeleton({ nombreCarrera }: MallaSkeletonProps) {
  const semestresPorAño = 2;
  const cursosPorSemestre = 6;
  const años = nombreCarrera === "iti" ? 4 : 5;

  return (
    <div className="flex justify-center min-w-max p-4 gap-4">
      {Array.from({ length: años }).map((_, añoIndex) => (
        <div key={añoIndex} className="flex flex-col gap-2">
          <Skeleton className="rounded-sm h-6 w-full bg-zinc-800 mb-2" />
          <div className="flex gap-4">
            {Array.from({ length: semestresPorAño }).map((_, semIndex) => {
              const isLastSemester =
                añoIndex === años - 1 && semIndex === semestresPorAño - 1;
              const cursosEnEsteSemestre = isLastSemester
                ? 1
                : cursosPorSemestre;
              return (
                <div key={semIndex} className="flex flex-col gap-2">
                  <Skeleton className="rounded-sm w-full h-6 bg-zinc-400 mb-2" />
                  {Array.from({ length: cursosEnEsteSemestre }).map(
                    (_, cursoIndex) => (
                      <Skeleton
                        key={cursoIndex}
                        className="rounded-md w-36 h-20 bg-zinc-300 shadow-sm"
                      />
                    )
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
