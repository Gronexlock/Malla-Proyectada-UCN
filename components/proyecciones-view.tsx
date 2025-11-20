"use client";

import { ProyeccionDetail } from "@/components/proyeccion-detail";
import { ProyeccionesList } from "@/components/proyecciones-list";
import { Proyeccion } from "@/src/types/proyeccion";
import { useState } from "react";

type ProyeccionesViewProps = {
  proyecciones: Proyeccion[];
};

export default function ProyeccionesView({
  proyecciones,
}: ProyeccionesViewProps) {
  const [selectedProjection, setSelectedProjection] = useState(proyecciones[0]);

  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto">
        <div className="lg:col-span-1">
          <ProyeccionesList
            proyecciones={proyecciones}
            selectedId={String(selectedProjection.id)}
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
