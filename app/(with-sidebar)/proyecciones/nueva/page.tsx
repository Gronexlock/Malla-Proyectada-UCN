"use client";

import { NuevaProyeccionView } from "@/components/proyeccion/crear-proyeccion/crear-proyeccion-view";
import { NuevaProyeccionSkeleton } from "@/components/skeletons/crear-proyeccion/crear-proyeccion-skeleton";
import { useProyeccion } from "@/src/contexts/ProyeccionContext";
import { useEffect, useState } from "react";

export default function NuevaProyeccionPage() {
  const { cursos, proyeccionesPreview, toggleCursoProyeccion } =
    useProyeccion();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (cursos && cursos.length > 0) {
      setIsLoading(false);
    }
  }, [cursos]);

  if (isLoading) {
    return <NuevaProyeccionSkeleton />;
  }

  return (
    <NuevaProyeccionView
      cursos={cursos}
      proyeccionesPreview={proyeccionesPreview}
      toggleCursoProyeccion={toggleCursoProyeccion}
    />
  );
}
