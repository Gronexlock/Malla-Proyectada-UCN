"use client";

import { useState } from "react";
import { useUserStore } from "@/src/store/useUserStore";
import { useRouter } from "next/navigation";
import { Trash2, Info } from "lucide-react";

export default function Page() {
  const { proyecciones, setProyecciones } = useUserStore();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const router = useRouter();

  const handleDelete = (index: number) => {
    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar la Proyección N°${index + 1}?`
    );

    if (!confirmar) return;

    const updated = proyecciones.filter((_, i) => i !== index);
    setProyecciones(updated);
    if (selectedIndex === index) setSelectedIndex(null);
  };

  return (
    <div className="flex justify-center items-center h-screen gap-8">
      {/*  Lista de proyecciones */}
      <div className="bg-zinc-100 shadow border rounded-md w-72">
        <ul>
          {proyecciones.length > 0 ? (
            proyecciones.map((p, index) => (
              <div
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`flex justify-between items-center border-b border-zinc-300 last:border-0 p-4 cursor-pointer transition-colors ${
                  selectedIndex === index
                    ? "bg-blue-100 hover:bg-blue-200"
                    : "hover:bg-zinc-200"
                }`}
              >
                <li className="flex flex-col">
                  <span className="text-lg font-medium">
                    Proyección N°{index + 1}
                  </span>
                  <span className="text-sm text-gray-600">
                    {p.proyecciones[p.proyecciones.length - 1]?.semestre ??
                      "Semestre no definido"}
                  </span>
                </li>

                <div className="flex items-center gap-2">
                  {/*  Ver detalle */}
                  <button
                    className="hover:bg-blue-200 p-2 rounded-full transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/proyecciones/${index}`);
                    }}
                    title="Ver detalles"
                  >
                    <Info size={16} className="text-blue-600" />
                  </button>

                  {/*  Eliminar */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(index);
                    }}
                    className="hover:bg-red-200 p-2 rounded-full transition-colors"
                    title="Eliminar proyección"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-zinc-500 italic p-4">
              No hay proyecciones guardadas.
            </p>
          )}
        </ul>
      </div>

      {/*  Detalles rápidos */}
      <div className="bg-zinc-100 shadow border rounded-md w-96 min-h-[200px] p-6">
        {selectedIndex !== null ? (
          <>
            <h2 className="text-lg font-semibold mb-4">
              Detalles de la Proyección N°{selectedIndex + 1}
            </h2>

            <div className="space-y-2">
              <p>
                <strong>Año de salida proyectado:</strong>{" "}
                {
                  proyecciones[selectedIndex].proyecciones[
                    proyecciones[selectedIndex].proyecciones.length - 1
                  ]?.semestre ?? "No definido"
                }
              </p>
              <p>
                <strong>Total de semestres:</strong>{" "}
                {proyecciones[selectedIndex].proyecciones.length}
              </p>
              <p>
                <strong>Restricciones:</strong> Ninguna registrada.
              </p>

              <div>
                <h3 className="font-semibold mt-4 mb-2">
                  Resumen de semestres:
                </h3>
                <ul className="list-disc list-inside text-sm text-zinc-700">
                  {proyecciones[selectedIndex].proyecciones.map((sem, i) => (
                    <li key={i}>
                      <strong>{sem.semestre}:</strong> {sem.cursos.length} cursos
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        ) : (
          <p className="text-zinc-500 italic text-center mt-10">
            Selecciona una proyección para ver sus detalles.
          </p>
        )}
      </div>
    </div>
  );
}
