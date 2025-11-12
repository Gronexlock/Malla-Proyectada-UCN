"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Info, Plus } from "lucide-react";
import { Proyeccion, ProyeccionBySemestre } from "@/src/types/proyeccion";
import Link from "next/link";
import { groupProyeccionBySemestres } from "@/src/utils/proyeccion";

type ProyeccionesViewProps = {
  rut: string;
  carrera: string;
};

export default function ProyeccionesView({
  rut,
  carrera,
}: ProyeccionesViewProps) {
  const [proyecciones, setProyecciones] = useState<ProyeccionBySemestre[]>([]);
  const [selectedProyeccion, setSelectedProyeccion] =
    useState<ProyeccionBySemestre>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadProyeccionesFromDB();
  }, [carrera, rut]);

  async function handleDelete(id: number) {
    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar esta proyección?`
    );

    if (!confirmar) return;

    try {
      const response = await fetch(`/api/proyecciones/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("Error al eliminar proyección");
        return;
      }

      alert("Proyección eliminada correctamente");
      loadProyeccionesFromDB();
    } catch (error) {
      alert("Error al eliminar proyección");
    }
  }

  async function loadProyeccionesFromDB() {
    if (!rut || !carrera) return;
    setLoading(true);

    try {
      const response = await fetch(
        `/api/proyecciones?rut=${rut}&carrera=${carrera}&page=1`
      );

      if (!response.ok) {
        throw new Error("Error al cargar proyecciones");
      }

      const data = await response.json();
      const grouped = data.map(groupProyeccionBySemestres);

      setProyecciones(grouped);
    } catch (error) {
      throw new Error("Error al cargar proyecciones");
    } finally {
      setLoading(false);
    }
  }

  // TODO: hacer skeleton
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Cargando proyecciones...</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start h-screen gap-8 p-8">
      <div className="bg-white shadow-lg border rounded-lg w-80">
        <div className="p-4 border-b border-zinc-300 bg-blue-50 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-blue-800">
              Mis Proyecciones
            </h3>
            <Link href="/proyecciones/nueva">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors"
                title="Crear nueva proyección"
              >
                <Plus size={16} />
              </button>
            </Link>
          </div>
          <p className="text-sm text-blue-600 mt-1">
            {proyecciones.length === 1
              ? "1 proyección guardada"
              : `${proyecciones.length} proyecciones guardadas`}
          </p>
        </div>

        <ul>
          {proyecciones.length > 0 ? (
            proyecciones.map((proyeccion) => (
              <div
                key={proyeccion.id}
                onClick={() => setSelectedProyeccion(proyeccion)}
                className={`flex justify-between items-center border-b border-zinc-200 last:border-0 p-4 cursor-pointer transition-colors ${
                  selectedProyeccion?.id === proyeccion.id
                    ? "bg-blue-100 border-blue-300"
                    : "hover:bg-zinc-50"
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-lg font-medium text-gray-800">
                    Proyección #{proyeccion.id}
                  </span>
                  <span className="text-sm text-gray-600">
                    {proyeccion.semestres[proyeccion.semestres.length - 1]
                      ?.semestre ?? "Sin semestre definido"}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    {proyeccion.carreraCodigo} • {proyeccion.semestres.length}{" "}
                    semestres
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    className="hover:bg-blue-100 p-2 rounded-full transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/proyecciones/${proyeccion.id}`);
                    }}
                    title="Ver detalles completos"
                  >
                    <Info size={14} className="text-blue-600" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(proyeccion.id);
                    }}
                    className="hover:bg-red-100 p-2 rounded-full transition-colors"
                    title="Eliminar proyección"
                  >
                    <Trash2 size={14} className="text-red-600" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-6">
              <p className="text-zinc-500 italic mb-4">
                No hay proyecciones guardadas.
              </p>
              <Link href="/proyecciones/nueva">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                  Crear primera proyección
                </button>
              </Link>
            </div>
          )}
        </ul>
      </div>

      <div className="bg-white shadow-lg border rounded-lg w-96 min-h-[300px]">
        <div className="p-4 border-b border-zinc-300 bg-gray-50 rounded-t-lg">
          <h3 className="text-lg font-semibold text-gray-800">
            Detalles de la Proyección
          </h3>
        </div>

        <div className="p-6">
          {selectedProyeccion ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">ID</p>
                  <p className="text-lg font-semibold">
                    #{selectedProyeccion.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Carrera</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {selectedProyeccion.carreraCodigo}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">Estudiante</p>
                <p className="text-lg">{selectedProyeccion.estudianteRut}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total de Semestres
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {selectedProyeccion.semestres.length}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">
                  Resumen por Semestre
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedProyeccion.semestres.map((semestre, index) => (
                    <div
                      key={semestre.semestre}
                      className="bg-gray-50 p-3 rounded-lg border"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">
                          {semestre.semestre}
                        </span>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {semestre.cursos.length} cursos
                        </span>
                      </div>
                      {semestre.cursos.length > 0 && (
                        <p className="text-xs text-gray-600 mt-1">
                          {semestre.cursos.map((c) => c.cursoCodigo).join(", ")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <button
                  onClick={() =>
                    router.push(`/proyecciones/${selectedProyeccion.id}`)
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Ver detalles completos
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <Info size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 italic">
                Selecciona una proyección para ver sus detalles
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
