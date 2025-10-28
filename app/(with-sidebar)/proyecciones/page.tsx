"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Info, Plus, Download, Upload } from "lucide-react";

// Interfaz para la proyección desde la base de datos
interface ProyeccionFromDB {
  id: number;
  estudianteRut: string;
  carreraCodigo: string;
  semestres: {
    id: number;
    semestre: string;
    cursos: {
      codigo: string;
    }[];
  }[];
}

export default function Page() {
  const [proyecciones, setProyecciones] = useState<ProyeccionFromDB[]>([]);
  const [selectedProyeccion, setSelectedProyeccion] = useState<ProyeccionFromDB | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  // Cargar proyecciones desde la base de datos
  useEffect(() => {
    loadProyeccionesFromDB();
  }, []);

  const loadProyeccionesFromDB = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/proyecciones');
      if (response.ok) {
        const data = await response.json();
        setProyecciones(data.data || []);
      } else {
        throw new Error('Error al cargar proyecciones');
      }
    } catch (error) {
      console.error('Error cargando proyecciones:', error);
      alert('Error al cargar las proyecciones');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar proyección de la base de datos
  const handleDelete = async (id: number) => {
    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar esta proyección?`
    );

    if (!confirmar) return;

    try {
      const response = await fetch(`/api/proyecciones/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Proyección eliminada exitosamente');
        await loadProyeccionesFromDB(); // Recargar la lista
        if (selectedProyeccion?.id === id) setSelectedProyeccion(null);
      } else {
        throw new Error('Error al eliminar');
      }
    } catch (error) {
      console.error('Error eliminando proyección:', error);
      alert('Error al eliminar la proyección');
    }
  };

  // Crear nueva proyección
  const handleCreateNew = () => {
    router.push('/proyecciones/nueva');
  };

  // Exportar proyección (opcional)
  const handleExport = (proyeccion: ProyeccionFromDB) => {
    const dataStr = JSON.stringify(proyeccion, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `proyeccion-${proyeccion.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Cargando proyecciones...</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start h-screen gap-8 p-8">
      {/* Lista de proyecciones desde BD */}
      <div className="bg-white shadow-lg border rounded-lg w-80">
        <div className="p-4 border-b border-zinc-300 bg-blue-50 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-blue-800">Mis Proyecciones</h3>
            <button
              onClick={handleCreateNew}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors"
              title="Crear nueva proyección"
            >
              <Plus size={16} />
            </button>
          </div>
          <p className="text-sm text-blue-600 mt-1">
            {proyecciones.length} proyección(es) guardada(s)
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
                    {proyeccion.semestres[proyeccion.semestres.length - 1]?.semestre ??
                      "Sin semestre definido"}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    {proyeccion.carreraCodigo} • {proyeccion.semestres.length} semestres
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {/* Exportar */}
                  <button
                    className="hover:bg-green-100 p-2 rounded-full transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExport(proyeccion);
                    }}
                    title="Exportar proyección"
                  >
                    <Download size={14} className="text-green-600" />
                  </button>

                  {/* Ver detalle */}
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

                  {/* Eliminar */}
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
              <button
                onClick={handleCreateNew}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Crear primera proyección
              </button>
            </div>
          )}
        </ul>
      </div>

      {/* Detalles rápidos */}
      <div className="bg-white shadow-lg border rounded-lg w-96 min-h-[300px]">
        <div className="p-4 border-b border-zinc-300 bg-gray-50 rounded-t-lg">
          <h3 className="text-lg font-semibold text-gray-800">Detalles de la Proyección</h3>
        </div>
        
        <div className="p-6">
          {selectedProyeccion ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">ID</p>
                  <p className="text-lg font-semibold">#{selectedProyeccion.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Carrera</p>
                  <p className="text-lg font-semibold text-blue-600">{selectedProyeccion.carreraCodigo}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">Estudiante</p>
                <p className="text-lg">{selectedProyeccion.estudianteRut}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">Total de Semestres</p>
                <p className="text-2xl font-bold text-green-600">{selectedProyeccion.semestres.length}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Resumen por Semestre</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedProyeccion.semestres.map((semestre, index) => (
                    <div key={semestre.id} className="bg-gray-50 p-3 rounded-lg border">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">{semestre.semestre}</span>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {semestre.cursos.length} cursos
                        </span>
                      </div>
                      {semestre.cursos.length > 0 && (
                        <p className="text-xs text-gray-600 mt-1">
                          {semestre.cursos.map(c => c.codigo).join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <button
                  onClick={() => router.push(`/proyecciones/${selectedProyeccion.id}`)}
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