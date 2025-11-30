// TODO: Pregunar al profe cuál es la mejor manera de implementar esto
export function getSemestreActual(): string {
  return "2025-2";
}

export function getSemestreSiguiente(semestre: string): string {
  const [year, term] = semestre.split("-");
  const yearInt = parseInt(year, 10);
  return term === "1" ? `${yearInt}-2` : `${yearInt + 1}-1`;
}

export function formatPeriod(period: string): string {
  const year = period.slice(0, 4);
  const term = period.slice(4);
  let termFormatted;

  if (term === "15") {
    termFormatted = "W"; // Invierno
  } else if (term === "25") {
    termFormatted = "V"; // Verano
  } else {
    termFormatted = term.slice(0, 1);
  }

  return `${year}-${termFormatted}`;
}
