
type contadorCreditosProps = {
    proyeccion: {creditos: number} []
};

export function ContadorCreditos({proyeccion}: contadorCreditosProps) {

    const totalCreditos = proyeccion.reduce(
        (suma, curso) => suma + (curso.creditos || 0),
        0
    );

    return(
        <div className="p-4 text-black text-center">
            <h2 className="text-xs font-bold">Total de Créditos:</h2>
            <p className="text-xs font-semibold">{totalCreditos}</p>
        </div>
    );
}