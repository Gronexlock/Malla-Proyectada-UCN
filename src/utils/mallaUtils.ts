/**
 * Obtiene un color interpolado entre startColor y endColor basado en el nivel dado.
 * @param level El nivel del curso
 * @param totalLevels El total de niveles en la malla
 * @param startColor El color inicial en formato HSL
 * @param endColor El color final en formato HSL
 */
export function getLevelColor(
  level: number,
  totalLevels: number,
  startColor: string,
  endColor: string
): string {
  const regex = /hsl\((\d+)\s+([\d.]+)%\s+([\d.]+)%\)/;
  const startMatch = startColor.match(regex);
  const endMatch = endColor.match(regex);

  if (!startMatch || !endMatch) {
    return startColor;
  }

  const startHue = Number(startMatch[1]);
  const startSaturation = Number(startMatch[2]);
  const startLightness = Number(startMatch[3]);

  const endHue = Number(endMatch[1]);
  const endSaturation = Number(endMatch[2]);
  const endLightness = Number(endMatch[3]);

  const t = (level - 1) / (totalLevels - 1);
  const interpolatedHue = startHue + t * (endHue - startHue);
  const interpolatedSaturation =
    startSaturation + t * (endSaturation - startSaturation);
  const interpolatedLightness =
    startLightness + t * (endLightness - startLightness);

  return `hsl(${Math.round(interpolatedHue)} ${interpolatedSaturation.toFixed(
    1
  )}% ${interpolatedLightness.toFixed(1)}%)`;
}
