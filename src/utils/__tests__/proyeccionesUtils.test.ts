import { Curso, CursoStatus } from "@/src/types/curso";
import { Proyeccion } from "@/src/types/proyeccion";
import { describe, expect, it } from "vitest";
import {
  getCantidadCursosPendientes,
  getEgresoMasTemprano,
} from "../proyeccionesUtils";

describe("proyeccionesUtils", () => {
  const mockCurso1: Curso = {
    codigo: "TEST-001",
    asignatura: "Curso Test 1",
    creditos: 6,
    nivel: 1,
    prerrequisitos: [],
    nrc: "",
    periodo: "",
    status: [CursoStatus.PENDIENTE],
  };

  const mockCurso2: Curso = {
    codigo: "TEST-002",
    asignatura: "Curso Test 2",
    creditos: 4,
    nivel: 2,
    prerrequisitos: [],
    nrc: "",
    periodo: "",
    status: [CursoStatus.PENDIENTE],
  };

  describe("getEgresoMasTemprano", () => {
    it("debe retornar el semestre de egreso más temprano", () => {
      const proyecciones: Proyeccion[] = [
        {
          id: 1,
          carrera: "ICI-2019",
          semestres: [
            { semestre: "2025-1", cursos: [mockCurso1] },
            { semestre: "2025-2", cursos: [mockCurso2] },
          ],
        },
        {
          id: 2,
          carrera: "ICI-2019",
          semestres: [
            { semestre: "2025-1", cursos: [mockCurso1] },
            { semestre: "2026-1", cursos: [mockCurso2] },
          ],
        },
      ];

      const result = getEgresoMasTemprano(proyecciones);
      expect(result).toBe("2025-2");
    });

    it("debe retornar 9999-9 cuando no hay proyecciones", () => {
      const proyecciones: Proyeccion[] = [];
      const result = getEgresoMasTemprano(proyecciones);
      expect(result).toBe("9999-9");
    });

    it("debe manejar una sola proyección", () => {
      const proyecciones: Proyeccion[] = [
        {
          id: 1,
          carrera: "ICI-2019",
          semestres: [
            { semestre: "2024-1", cursos: [mockCurso1] },
            { semestre: "2024-2", cursos: [mockCurso2] },
          ],
        },
      ];

      const result = getEgresoMasTemprano(proyecciones);
      expect(result).toBe("2024-2");
    });

    it("debe comparar semestres alfabéticamente", () => {
      const proyecciones: Proyeccion[] = [
        {
          id: 1,
          carrera: "ICI-2019",
          semestres: [{ semestre: "2030-1", cursos: [mockCurso1] }],
        },
        {
          id: 2,
          carrera: "ICI-2019",
          semestres: [{ semestre: "2025-2", cursos: [mockCurso2] }],
        },
      ];

      const result = getEgresoMasTemprano(proyecciones);
      expect(result).toBe("2025-2");
    });
  });

  describe("getCantidadCursosPendientes", () => {
    it("debe retornar la cantidad total de cursos en una proyección", () => {
      const proyecciones: Proyeccion[] = [
        {
          id: 1,
          carrera: "ICI-2019",
          semestres: [
            { semestre: "2025-1", cursos: [mockCurso1, mockCurso2] },
            { semestre: "2025-2", cursos: [mockCurso1] },
          ],
        },
      ];

      const result = getCantidadCursosPendientes(proyecciones);
      expect(result).toBe(3);
    });

    it("debe retornar 0 cuando no hay proyecciones", () => {
      const proyecciones: Proyeccion[] = [];
      const result = getCantidadCursosPendientes(proyecciones);
      expect(result).toBe(0);
    });

    it("debe contar cursos solo de la primera proyección", () => {
      const proyecciones: Proyeccion[] = [
        {
          id: 1,
          carrera: "ICI-2019",
          semestres: [{ semestre: "2025-1", cursos: [mockCurso1] }],
        },
        {
          id: 2,
          carrera: "ICI-2019",
          semestres: [{ semestre: "2025-1", cursos: [mockCurso1, mockCurso2] }],
        },
      ];

      const result = getCantidadCursosPendientes(proyecciones);
      expect(result).toBe(1);
    });

    it("debe manejar proyecciones sin semestres", () => {
      const proyecciones: Proyeccion[] = [
        {
          id: 1,
          carrera: "ICI-2019",
          semestres: [],
        },
      ];

      const result = getCantidadCursosPendientes(proyecciones);
      expect(result).toBe(0);
    });
  });
});
