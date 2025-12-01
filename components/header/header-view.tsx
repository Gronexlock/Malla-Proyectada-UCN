import { Carrera } from "@/src/types/carrera";

type ProyeccionHeaderViewProps = {
  selectedCarrera?: Carrera;
};

export function ProyeccionHeaderView({ selectedCarrera }: ProyeccionHeaderViewProps) {
  return (
    <header className="site-header mb-8">  
        <div className="container flex items-center justify-center">
            {selectedCarrera?.nombre === "ITI" && (
                <h1 className="text-white-2xl font-mono font-semibold">
                    Ingeniería en Tecnologías de la Información
                </h1>
            )}
            {selectedCarrera?.nombre === "ICI" && (
                <h1 className="text-white-2xl font-mono font-semibold">
                    Ingeniería Civil Industrial
                </h1>
            )}
            {selectedCarrera?.nombre === "ICCI" && (
                <h1 className="text-white-2xl font-mono font-semibold">
                    Ingeniería Civil en Computación e Informática
                </h1>
            )}
            {!selectedCarrera && (
                <h1 className="text-white-2xl font-mono font-semibold">
                    Carrera no definida
                </h1>
            )}
        </div>
    </header>
    );
}