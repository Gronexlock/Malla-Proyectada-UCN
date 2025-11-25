"use client";

import { ProyeccionDetail } from "@/components/proyeccion/proyeccion-detail";
import { ProyeccionesList } from "@/components/proyeccion/proyecciones-list";
import { Proyeccion } from "@/src/types/proyeccion";
import { FolderSearch } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";

type ProyeccionesViewProps = {
  proyecciones: Proyeccion[];
};

export default function ProyeccionesView({
  proyecciones,
}: ProyeccionesViewProps) {
  const [selectedProjection, setSelectedProjection] = useState<
    Proyeccion | undefined
  >(proyecciones[0]);

  if (!proyecciones || proyecciones.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <FolderSearch className="w-16 h-16 text-muted-foreground mb-4" />

        <h2 className="text-xl font-semibold">
          No tienes proyecciones guardadas
        </h2>

        <p className="text-muted-foreground mt-2 mb-6 max-w-sm">
          ¡Comienza a planificar tu futuro académico! Crea tu primera proyección
          para organizar tus semestres.
        </p>

        <Button asChild>
          <Link href="/proyecciones/nueva">Crear nueva proyección</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto">
        <div className="lg:col-span-1">
          <ProyeccionesList
            proyecciones={proyecciones}
            selectedId={String(selectedProjection?.id)}
            onSelect={setSelectedProjection}
          />
        </div>
        <div className="lg:col-span-2">
          {selectedProjection && (
            <ProyeccionDetail proyeccion={selectedProjection} />
          )}
        </div>
      </div>
    </div>
  );
}
