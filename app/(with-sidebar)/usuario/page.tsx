"use client";

import { useUserStore } from "@/src/store/useUserStore";
import { formatRut } from "@/src/utils/formatRut";
import { nombresCompletos } from "@/src/constants/carreras";

export default function UsuarioPage() {
  const { rut, carreras } = useUserStore();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Información del usuario</h2>
      <p>
        <strong>RUT:</strong> {formatRut(rut)}
      </p>
      <p>
        <strong>Carreras:</strong>{" "}
        {carreras.map((c) => nombresCompletos[c.codigo] || c.nombre).join(", ")}
      </p>
    </div>
  );
}
