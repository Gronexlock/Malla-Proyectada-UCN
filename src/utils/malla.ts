export function getColorForLevel(
  colorStart: string,
  colorEnd: string,
  nivel: number,
  totalNiveles: number
): string {
  const startMatch = colorStart.match(
    /hsl\((\d+), (\d+(\.\d+)?)%, (\d+(\.\d+)?)%\)/
  )!;
  const endMatch = colorEnd.match(
    /hsl\((\d+), (\d+(\.\d+)?)%, (\d+(\.\d+)?)%\)/
  )!;

  const [hStart, sStart, lStart] = [
    startMatch[1],
    startMatch[2],
    startMatch[4],
  ].map(Number);
  const [hEnd, sEnd, lEnd] = [endMatch[1], endMatch[2], endMatch[4]].map(
    Number
  );

  const ratio = (nivel - 1) / (totalNiveles - 1);

  const h = hStart + (hEnd - hStart) * ratio;
  const s = Math.min(100, Math.max(0, sStart + (sEnd - sStart) * ratio));
  const l = Math.min(100, Math.max(0, lStart + (lEnd - lStart) * ratio));

  return `hsl(${h}, ${s}%, ${l}%)`;
}

export const colorsByMajor = {
  "8606": {
    start: "hsl(209, 88.7%, 54.9%)",
    end: "hsl(209, 92.7%, 32.4%)",
    totalNiveles: 10,
  },
  "8616": {
    start: "hsl(18, 87%, 51.8%)",
    end: "hsl(18, 61.1%, 41.4%)",
    totalNiveles: 10,
  },
  "8266": {
    start: "hsl(121, 30.7%, 50.2%)",
    end: "hsl(121, 44.3%, 34.5%)",
    totalNiveles: 8,
  },
};
