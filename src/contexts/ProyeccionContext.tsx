"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type ProyeccionContextType = {
  ignorarRestricciones: boolean;
  setIgnorarRestricciones: (value: boolean) => void;
};

const ProyeccionContext = createContext<ProyeccionContextType | undefined>(
  undefined
);

export function ProyeccionProvider({ children }: { children: ReactNode }) {
  const [ignorarRestricciones, setIgnorarRestricciones] = useState(false);

  return (
    <ProyeccionContext.Provider
      value={{ ignorarRestricciones, setIgnorarRestricciones }}
    >
      {children}
    </ProyeccionContext.Provider>
  );
}

export function useProyeccion() {
  const context = useContext(ProyeccionContext);
  if (!context) {
    throw new Error("useProyeccion must be used within a ProyeccionProvider");
  }
  return context;
}
