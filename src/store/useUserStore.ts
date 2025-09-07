import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Carrera } from "../types/carrera";

interface UserState {
  rut: string;
  carreras: Carrera[];
  selectedCarrera: string;
  setRut: (rut: string) => void;
  setCarreras: (carreras: Carrera[]) => void;
  setSelectedCarrera: (codigo: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      rut: "",
      carreras: [],
      selectedCarrera: "",
      setRut: (rut) => set({ rut }),
      setCarreras: (carreras) => set({ carreras }),
      setSelectedCarrera: (codigo) => set({ selectedCarrera: codigo }),
    }),
    { name: "user-storage" }
  )
);
