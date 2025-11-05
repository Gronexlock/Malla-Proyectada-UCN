export function getSemestreActual(): string {
  return "2025-2";
}

export function getSemestreSiguiente(semestre: string): string {
  const [year, term] = semestre.split("-");
  const nextTerm = term === "1" ? "2" : "1";
  const nextYear = term === "1" ? year : (parseInt(year) + 1).toString();
  return `${nextYear}-${nextTerm}`;
}

export function formatPeriod(period: string): string {
  const year = period.slice(0, 4);
  const term = period.slice(4);
  let termFormatted;

  if (term === "15") {
    termFormatted = "W";
  } else if (term === "25") {
    termFormatted = "V";
  } else {
    termFormatted = term.slice(0, 1);
  }

  return `${year}-${termFormatted}`;
}
