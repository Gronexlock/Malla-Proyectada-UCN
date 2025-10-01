export function getSemestreActual(): string {
  return "2025-2";
}

export function getSemestreSiguiente(semestre: string): string {
  const [year, term] = semestre.split("-");
  const nextTerm = term === "1" ? "2" : "1";
  const nextYear = term === "1" ? year : (parseInt(year) + 1).toString();
  return `${nextYear}-${nextTerm}`;
}
