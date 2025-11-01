export function formatRut(rut: string): string {
  const clean = rut.replace(/\D/g, "");
  if (clean.length < 2) return rut;

  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);

  const formattedBody = body
    .split("")
    .reverse()
    .reduce((acc, digit, i) => {
      return digit + (i > 0 && i % 3 === 0 ? "." : "") + acc;
    }, "");

  return `${formattedBody}-${dv}`;
}
