import { describe, expect, it } from "vitest";
import { getLevelColor } from "../mallaUtils";

describe("mallaUtils", () => {
  describe("getLevelColor", () => {
    it("debe retornar el color inicial para el primer nivel", () => {
      const startColor = "hsl(210 50% 60%)";
      const endColor = "hsl(270 50% 60%)";
      const result = getLevelColor(1, 10, startColor, endColor);
      expect(result).toBe("hsl(210 50.0% 60.0%)");
    });

    it("debe retornar el color final para el último nivel", () => {
      const startColor = "hsl(210 50% 60%)";
      const endColor = "hsl(270 50% 60%)";
      const result = getLevelColor(10, 10, startColor, endColor);
      expect(result).toBe("hsl(270 50.0% 60.0%)");
    });

    it("debe interpolar correctamente en el nivel medio", () => {
      const startColor = "hsl(0 0% 0%)";
      const endColor = "hsl(100 100% 100%)";
      const result = getLevelColor(2, 3, startColor, endColor);
      expect(result).toBe("hsl(50 50.0% 50.0%)");
    });

    it("debe manejar colores con formato inválido retornando el color inicial", () => {
      const startColor = "invalid-color";
      const endColor = "hsl(270 50% 60%)";
      const result = getLevelColor(5, 10, startColor, endColor);
      expect(result).toBe(startColor);
    });

    it("debe interpolar valores decimales correctamente", () => {
      const startColor = "hsl(200 40% 50%)";
      const endColor = "hsl(300 60% 70%)";
      const result = getLevelColor(3, 5, startColor, endColor);
      expect(result).toMatch(/^hsl\(\d+ \d+\.\d+% \d+\.\d+%\)$/);
    });

    it("debe manejar un solo nivel correctamente", () => {
      const startColor = "hsl(180 50% 50%)";
      const endColor = "hsl(180 50% 50%)";
      const result = getLevelColor(1, 1, startColor, endColor);
      expect(result).toMatch(/^hsl\(/);
    });
  });
});
