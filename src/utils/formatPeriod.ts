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
