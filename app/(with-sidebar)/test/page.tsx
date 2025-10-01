"use client";

import { useUserStore } from "@/src/store/useUserStore";

export default function Page() {
  const { rut, carreras, cursosProyeccion } = useUserStore();
  return (
    <div>
      <p>RUT: {rut}</p>
      <p>
        Carreras:{" "}
        {carreras
          .map((c) => `${c.nombre}-${c.codigo}-${c.catalogo}`)
          .join(", ")}
      </p>
      <p>
        Cursos Proyección:{" "}
        {cursosProyeccion.map((c) => `${c.codigo}`).join(", ")}
      </p>
    </div>
  );
}
