import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Carrera } from "../types/carrera";

interface UserState {
  rut: string;
  carreras: Carrera[];
  selectedCarrera: Carrera;
  setRut: (rut: string) => void;
  setCarreras: (carreras: Carrera[]) => void;
  setSelectedCarrera: (selectedCarrera: Carrera) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      rut: "",
      carreras: [],
      selectedCarrera: {} as Carrera,
      setRut: (rut) => set({ rut }),
      setCarreras: (carreras) => set({ carreras }),
      setSelectedCarrera: (selectedCarrera) => set({ selectedCarrera }),
    }),
    { name: "user-store" }
  )
);
