import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Carrera } from "../types/carrera";
import { Proyeccion } from "../types/proyeccion";

interface UserState {
  rut: string;
  carreras: Carrera[];
  selectedCarrera: Carrera;
  proyecciones: Proyeccion[];
  setRut: (rut: string) => void;
  setCarreras: (carreras: Carrera[]) => void;
  setSelectedCarrera: (selectedCarrera: Carrera) => void;
  setProyecciones: (proyecciones: Proyeccion[]) => void;
  clearProyecciones: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      rut: "",
      carreras: [],
      selectedCarrera: {} as Carrera,
      proyecciones: [],
      setRut: (rut) => set({ rut }),
      setCarreras: (carreras) => set({ carreras }),
      setSelectedCarrera: (selectedCarrera) => set({ selectedCarrera }),
      setProyecciones: (proyecciones) => set({ proyecciones }),
      clearProyecciones: () => set({ proyecciones: [] }),
    }),
    { name: "user-storage" }
  )
);
