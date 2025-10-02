"use client";

import { useUserStore } from "@/src/store/useUserStore";

export default function Page() {
  const { rut, carreras, proyecciones } = useUserStore();
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
        {proyecciones.map((p) =>
          p.proyecciones
            .map(
              (ps) =>
                `${ps.semestre}: [${ps.cursos
                  .map((c) => c.codigo)
                  .join(", ")}] `
            )
            .join("; ")
        )}
      </p>
    </div>
  );
}
