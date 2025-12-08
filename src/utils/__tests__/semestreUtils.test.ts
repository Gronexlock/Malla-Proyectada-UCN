import { describe, expect, it } from "vitest";
import {
  formatPeriod,
  getSemestreActual,
  getSemestreSiguiente,
} from "../semestreUtils";

describe("semestreUtils", () => {
  describe("getSemestreActual", () => {
    it("debe retornar un semestre en formato correcto", () => {
      const result = getSemestreActual();
      expect(result).toMatch(/^\d{4}-[12]$/);
    });

    it("debe retornar 2025-2 como semestre actual", () => {
      const result = getSemestreActual();
      expect(result).toBe("2025-2");
    });
  });

  describe("getSemestreSiguiente", () => {
    it("debe retornar el segundo semestre cuando se le pasa el primero", () => {
      const result = getSemestreSiguiente("2024-1");
      expect(result).toBe("2024-2");
    });

    it("debe retornar el primer semestre del siguiente año cuando se le pasa el segundo", () => {
      const result = getSemestreSiguiente("2024-2");
      expect(result).toBe("2025-1");
    });

    it("debe manejar correctamente años con múltiples dígitos", () => {
      const result = getSemestreSiguiente("2099-2");
      expect(result).toBe("2100-1");
    });

    it("debe funcionar con años de dos dígitos", () => {
      const result = getSemestreSiguiente("25-1");
      expect(result).toBe("25-2");
    });
  });

  describe("formatPeriod", () => {
    it("debe formatear periodo de primer semestre correctamente", () => {
      const result = formatPeriod("20241");
      expect(result).toBe("2024-1");
    });

    it("debe formatear periodo de segundo semestre correctamente", () => {
      const result = formatPeriod("20242");
      expect(result).toBe("2024-2");
    });

    it("debe formatear periodo de invierno con W", () => {
      const result = formatPeriod("202415");
      expect(result).toBe("2024-W");
    });

    it("debe formatear periodo de verano con V", () => {
      const result = formatPeriod("202425");
      expect(result).toBe("2024-V");
    });

    it("debe manejar periodos con formato no estándar", () => {
      const result = formatPeriod("20243");
      expect(result).toBe("2024-3");
    });
  });
});
