import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Carrera } from "../types/carrera";
import { CursoProyeccion } from "../types/curso";

interface UserState {
  rut: string;
  carreras: Carrera[];
  selectedCarrera: Carrera;
  cursosProyeccion: CursoProyeccion[];
  setRut: (rut: string) => void;
  setCarreras: (carreras: Carrera[]) => void;
  setSelectedCarrera: (selectedCarrera: Carrera) => void;
  setCursosProyeccion: (cursosProyeccion: CursoProyeccion[]) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      rut: "",
      carreras: [],
      selectedCarrera: {} as Carrera,
      cursosProyeccion: [],
      setRut: (rut) => set({ rut }),
      setCarreras: (carreras) => set({ carreras }),
      setSelectedCarrera: (selectedCarrera) => set({ selectedCarrera }),
      setCursosProyeccion: (cursosProyeccion) => set({ cursosProyeccion }),
    }),
    { name: "user-storage" }
  )
);
