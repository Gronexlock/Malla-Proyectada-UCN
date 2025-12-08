import { CursoAvance } from "@/src/schemas/avanceSchema";
import { CursoMalla } from "@/src/schemas/mallaSchema";
import { Curso, CursoStatus } from "@/src/types/curso";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getAvanceAgrupado,
  getAvanceCronologico,
  getAvanceCurricular,
  getCursoStatus,
  getCursosPorNivel,
  getCursosPorPeriodo,
  getMalla,
} from "../cursosUtils";

vi.mock("@/src/actions/avanceActions", () => ({
  fetchAvance: vi.fn(),
}));

vi.mock("@/src/actions/mallaActions", () => ({
  fetchMalla: vi.fn(),
}));

describe("cursosUtils", () => {
  const mockCurso1: Curso = {
    codigo: "TEST-001",
    asignatura: "Curso Test 1",
    creditos: 6,
    nivel: 1,
    prerrequisitos: [],
    nrc: "12345",
    periodo: "2024-1",
    status: [CursoStatus.PENDIENTE],
  };

  const mockCurso2: Curso = {
    codigo: "TEST-002",
    asignatura: "Curso Test 2",
    creditos: 4,
    nivel: 1,
    prerrequisitos: [],
    nrc: "12346",
    periodo: "2024-1",
    status: [CursoStatus.APROBADO],
  };

  const mockCurso3: Curso = {
    codigo: "TEST-003",
    asignatura: "Curso Test 3",
    creditos: 5,
    nivel: 2,
    prerrequisitos: [],
    nrc: "12347",
    periodo: "2024-2",
    status: [CursoStatus.INSCRITO],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCursoStatus", () => {
    it("debe retornar APROBADO si el curso tiene ese estado", () => {
      const curso: Curso = {
        ...mockCurso1,
        status: [CursoStatus.APROBADO, CursoStatus.INSCRITO],
      };
      const result = getCursoStatus(curso);
      expect(result).toBe(CursoStatus.APROBADO);
    });

    it("debe retornar INSCRITO si no está aprobado pero está inscrito", () => {
      const curso: Curso = {
        ...mockCurso1,
        status: [CursoStatus.INSCRITO, CursoStatus.REPROBADO],
      };
      const result = getCursoStatus(curso);
      expect(result).toBe(CursoStatus.INSCRITO);
    });

    it("debe retornar REPROBADO si solo tiene ese estado", () => {
      const curso: Curso = {
        ...mockCurso1,
        status: [CursoStatus.REPROBADO],
      };
      const result = getCursoStatus(curso);
      expect(result).toBe(CursoStatus.REPROBADO);
    });

    it("debe retornar PENDIENTE por defecto", () => {
      const curso: Curso = {
        ...mockCurso1,
        status: [CursoStatus.PENDIENTE],
      };
      const result = getCursoStatus(curso);
      expect(result).toBe(CursoStatus.PENDIENTE);
    });

    it("debe priorizar APROBADO sobre otros estados", () => {
      const curso: Curso = {
        ...mockCurso1,
        status: [
          CursoStatus.REPROBADO,
          CursoStatus.INSCRITO,
          CursoStatus.APROBADO,
        ],
      };
      const result = getCursoStatus(curso);
      expect(result).toBe(CursoStatus.APROBADO);
    });
  });

  describe("getCursosPorNivel", () => {
    it("debe agrupar cursos por nivel correctamente", () => {
      const cursos = [mockCurso1, mockCurso2, mockCurso3];
      const result = getCursosPorNivel(cursos);

      expect(result[1]).toHaveLength(2);
      expect(result[2]).toHaveLength(1);
      expect(result[1]).toContain(mockCurso1);
      expect(result[1]).toContain(mockCurso2);
      expect(result[2]).toContain(mockCurso3);
    });

    it("debe manejar un array vacío", () => {
      const result = getCursosPorNivel([]);
      expect(result).toEqual({});
    });

    it("debe crear un nuevo nivel si no existe", () => {
      const cursos = [mockCurso1];
      const result = getCursosPorNivel(cursos);

      expect(result[1]).toBeDefined();
      expect(result[1]).toHaveLength(1);
    });

    it("debe manejar cursos con el mismo nivel", () => {
      const cursos = [mockCurso1, mockCurso2];
      const result = getCursosPorNivel(cursos);

      expect(Object.keys(result)).toHaveLength(1);
      expect(result[1]).toHaveLength(2);
    });
  });

  describe("getCursosPorPeriodo", () => {
    it("debe agrupar cursos por periodo correctamente", () => {
      const cursos = [mockCurso1, mockCurso2, mockCurso3];
      const result = getCursosPorPeriodo(cursos);

      expect(result["2024-1"]).toHaveLength(2);
      expect(result["2024-2"]).toHaveLength(1);
      expect(result["2024-1"]).toContain(mockCurso1);
      expect(result["2024-1"]).toContain(mockCurso2);
      expect(result["2024-2"]).toContain(mockCurso3);
    });

    it("debe manejar un array vacío", () => {
      const result = getCursosPorPeriodo([]);
      expect(result).toEqual({});
    });

    it("debe crear un nuevo periodo si no existe", () => {
      const cursos = [mockCurso1];
      const result = getCursosPorPeriodo(cursos);

      expect(result["2024-1"]).toBeDefined();
      expect(result["2024-1"]).toHaveLength(1);
    });

    it("debe manejar cursos con periodos vacíos", () => {
      const cursoSinPeriodo: Curso = {
        ...mockCurso1,
        periodo: "",
      };
      const result = getCursosPorPeriodo([cursoSinPeriodo]);

      expect(result[""]).toBeDefined();
      expect(result[""]).toHaveLength(1);
    });
  });

  describe("getMalla", () => {
    it("debe obtener y transformar la malla curricular", async () => {
      const { fetchMalla } = await import("@/src/actions/mallaActions");
      const mockMallaData: CursoMalla[] = [
        {
          codigo: "TEST-001",
          asignatura: "Curso Test",
          creditos: 6,
          nivel: 1,
          prereq: "",
        },
        {
          codigo: "TEST-002",
          asignatura: "Curso Test 2",
          creditos: 4,
          nivel: 2,
          prereq: "TEST-001",
        },
      ];

      (fetchMalla as any).mockResolvedValue(mockMallaData);

      const result = await getMalla({
        codigo: "ICI-2019",
        nombre: "Ingeniería Civil Informática",
        catalogo: "2019",
      });

      expect(result).toHaveLength(2);
      expect(result[0].codigo).toBe("TEST-001");
      expect(result[0].status).toEqual([CursoStatus.PENDIENTE]);
      expect(result[1].prerrequisitos).toHaveLength(1);
      expect(result[1].prerrequisitos[0].codigo).toBe("TEST-001");
    });

    it("debe manejar cursos sin prerrequisitos", async () => {
      const { fetchMalla } = await import("@/src/actions/mallaActions");
      const mockMallaData: CursoMalla[] = [
        {
          codigo: "TEST-001",
          asignatura: "Curso Sin Prereq",
          creditos: 6,
          nivel: 1,
          prereq: "",
        },
      ];

      (fetchMalla as any).mockResolvedValue(mockMallaData);

      const result = await getMalla({
        codigo: "ICI-2019",
        nombre: "Ingeniería Civil Informática",
        catalogo: "2019",
      });

      expect(result[0].prerrequisitos).toHaveLength(0);
    });

    it("debe manejar múltiples prerrequisitos separados por comas", async () => {
      const { fetchMalla } = await import("@/src/actions/mallaActions");
      const mockMallaData: CursoMalla[] = [
        {
          codigo: "TEST-001",
          asignatura: "Prereq 1",
          creditos: 6,
          nivel: 1,
          prereq: "",
        },
        {
          codigo: "TEST-002",
          asignatura: "Prereq 2",
          creditos: 4,
          nivel: 1,
          prereq: "",
        },
        {
          codigo: "TEST-003",
          asignatura: "Curso Con Dos Prereqs",
          creditos: 5,
          nivel: 2,
          prereq: "TEST-001,TEST-002",
        },
      ];

      (fetchMalla as any).mockResolvedValue(mockMallaData);

      const result = await getMalla({
        codigo: "ICI-2019",
        nombre: "Ingeniería Civil Informática",
        catalogo: "2019",
      });

      expect(result[2].prerrequisitos).toHaveLength(2);
      expect(result[2].prerrequisitos[0].codigo).toBe("TEST-001");
      expect(result[2].prerrequisitos[1].codigo).toBe("TEST-002");
    });
  });

  describe("getAvanceCurricular", () => {
    it("debe combinar malla con avance del estudiante", async () => {
      const { fetchMalla } = await import("@/src/actions/mallaActions");
      const { fetchAvance } = await import("@/src/actions/avanceActions");

      const mockMallaData: CursoMalla[] = [
        {
          codigo: "TEST-001",
          asignatura: "Curso 1",
          creditos: 6,
          nivel: 1,
          prereq: "",
        },
        {
          codigo: "TEST-002",
          asignatura: "Curso 2",
          creditos: 4,
          nivel: 2,
          prereq: "",
        },
      ];

      const mockAvanceData: CursoAvance[] = [
        {
          nrc: "12345",
          period: "2024-1",
          student: "12345678",
          course: "TEST-001",
          excluded: false,
          inscriptionType: "NORMAL",
          status: "APROBADO",
        },
      ];

      (fetchMalla as any).mockResolvedValue(mockMallaData);
      (fetchAvance as any).mockResolvedValue(mockAvanceData);

      const result = await getAvanceCurricular({
        codigo: "ICI-2019",
        nombre: "Ingeniería Civil Informática",
        catalogo: "2019",
      });

      expect(result).toHaveLength(2);
      expect(result[0].status).toEqual([CursoStatus.APROBADO]);
      expect(result[1].status).toEqual([CursoStatus.PENDIENTE]);
    });

    it("debe manejar múltiples estados del mismo curso (REPROBADO < INSCRITO < APROBADO)", async () => {
      const { fetchMalla } = await import("@/src/actions/mallaActions");
      const { fetchAvance } = await import("@/src/actions/avanceActions");

      const mockMallaData: CursoMalla[] = [
        {
          codigo: "TEST-001",
          asignatura: "Curso Reprobado y Aprobado",
          creditos: 6,
          nivel: 1,
          prereq: "",
        },
      ];

      const mockAvanceData: CursoAvance[] = [
        {
          nrc: "12345",
          period: "2023-1",
          student: "12345678",
          course: "TEST-001",
          excluded: false,
          inscriptionType: "NORMAL",
          status: "REPROBADO",
        },
        {
          nrc: "12346",
          period: "2024-1",
          student: "12345678",
          course: "TEST-001",
          excluded: false,
          inscriptionType: "NORMAL",
          status: "APROBADO",
        },
      ];

      (fetchMalla as any).mockResolvedValue(mockMallaData);
      (fetchAvance as any).mockResolvedValue(mockAvanceData);

      const result = await getAvanceCurricular({
        codigo: "ICI-2019",
        nombre: "Ingeniería Civil Informática",
        catalogo: "2019",
      });

      expect(result[0].status).toEqual([CursoStatus.APROBADO]);
    });

    it("debe priorizar INSCRITO sobre REPROBADO", async () => {
      const { fetchMalla } = await import("@/src/actions/mallaActions");
      const { fetchAvance } = await import("@/src/actions/avanceActions");

      const mockMallaData: CursoMalla[] = [
        {
          codigo: "TEST-001",
          asignatura: "Curso",
          creditos: 6,
          nivel: 1,
          prereq: "",
        },
      ];

      const mockAvanceData: CursoAvance[] = [
        {
          nrc: "12345",
          period: "2023-1",
          student: "12345678",
          course: "TEST-001",
          excluded: false,
          inscriptionType: "NORMAL",
          status: "REPROBADO",
        },
        {
          nrc: "12346",
          period: "2024-1",
          student: "12345678",
          course: "TEST-001",
          excluded: false,
          inscriptionType: "NORMAL",
          status: "INSCRITO",
        },
      ];

      (fetchMalla as any).mockResolvedValue(mockMallaData);
      (fetchAvance as any).mockResolvedValue(mockAvanceData);

      const result = await getAvanceCurricular({
        codigo: "ICI-2019",
        nombre: "Ingeniería Civil Informática",
        catalogo: "2019",
      });

      expect(result[0].status).toEqual([CursoStatus.INSCRITO]);
    });
  });

  describe("getAvanceAgrupado", () => {
    it("debe agrupar todos los estados de un curso", async () => {
      const { fetchMalla } = await import("@/src/actions/mallaActions");
      const { fetchAvance } = await import("@/src/actions/avanceActions");

      const mockMallaData: CursoMalla[] = [
        {
          codigo: "TEST-001",
          asignatura: "Curso",
          creditos: 6,
          nivel: 1,
          prereq: "",
        },
      ];

      const mockAvanceData: CursoAvance[] = [
        {
          nrc: "12345",
          period: "2023-1",
          student: "12345678",
          course: "TEST-001",
          excluded: false,
          inscriptionType: "NORMAL",
          status: "REPROBADO",
        },
        {
          nrc: "12346",
          period: "2024-1",
          student: "12345678",
          course: "TEST-001",
          excluded: false,
          inscriptionType: "NORMAL",
          status: "APROBADO",
        },
      ];

      (fetchMalla as any).mockResolvedValue(mockMallaData);
      (fetchAvance as any).mockResolvedValue(mockAvanceData);

      const result = await getAvanceAgrupado({
        codigo: "ICI-2019",
        nombre: "Ingeniería Civil Informática",
        catalogo: "2019",
      });

      expect(result[0].status).toHaveLength(2);
      expect(result[0].status).toContain(CursoStatus.REPROBADO);
      expect(result[0].status).toContain(CursoStatus.APROBADO);
    });

    it("debe asignar PENDIENTE si el curso no está en el avance", async () => {
      const { fetchMalla } = await import("@/src/actions/mallaActions");
      const { fetchAvance } = await import("@/src/actions/avanceActions");

      const mockMallaData: CursoMalla[] = [
        {
          codigo: "TEST-001",
          asignatura: "Curso",
          creditos: 6,
          nivel: 1,
          prereq: "",
        },
      ];

      (fetchMalla as any).mockResolvedValue(mockMallaData);
      (fetchAvance as any).mockResolvedValue([]);

      const result = await getAvanceAgrupado({
        codigo: "ICI-2019",
        nombre: "Ingeniería Civil Informática",
        catalogo: "2019",
      });

      expect(result[0].status).toEqual([CursoStatus.PENDIENTE]);
    });
  });

  describe("getAvanceCronologico", () => {
    it("debe retornar historial de cursos en orden", async () => {
      const { fetchMalla } = await import("@/src/actions/mallaActions");
      const { fetchAvance } = await import("@/src/actions/avanceActions");

      const mockMallaData: CursoMalla[] = [
        {
          codigo: "TEST-001",
          asignatura: "Curso 1",
          creditos: 6,
          nivel: 1,
          prereq: "",
        },
      ];

      const mockAvanceData: CursoAvance[] = [
        {
          nrc: "12345",
          period: "2023-1",
          student: "12345678",
          course: "TEST-001",
          excluded: false,
          inscriptionType: "NORMAL",
          status: "APROBADO",
        },
      ];

      (fetchMalla as any).mockResolvedValue(mockMallaData);
      (fetchAvance as any).mockResolvedValue(mockAvanceData);

      const result = await getAvanceCronologico({
        codigo: "ICI-2019",
        nombre: "Ingeniería Civil Informática",
        catalogo: "2019",
      });

      expect(result).toHaveLength(1);
      expect(result[0].codigo).toBe("TEST-001");
      expect(result[0].asignatura).toBe("Curso 1");
      expect(result[0].creditos).toBe(6);
      expect(result[0].periodo).toBe("2023-1");
    });

    it("debe manejar cursos no encontrados en la malla", async () => {
      const { fetchMalla } = await import("@/src/actions/mallaActions");
      const { fetchAvance } = await import("@/src/actions/avanceActions");

      const mockMallaData: CursoMalla[] = [];

      const mockAvanceData: CursoAvance[] = [
        {
          nrc: "12345",
          period: "2023-1",
          student: "12345678",
          course: "TEST-999",
          excluded: false,
          inscriptionType: "NORMAL",
          status: "APROBADO",
        },
      ];

      (fetchMalla as any).mockResolvedValue(mockMallaData);
      (fetchAvance as any).mockResolvedValue(mockAvanceData);

      const result = await getAvanceCronologico({
        codigo: "ICI-2019",
        nombre: "Ingeniería Civil Informática",
        catalogo: "2019",
      });

      expect(result).toHaveLength(1);
      expect(result[0].asignatura).toBe("TEST-999");
      expect(result[0].creditos).toBe(0);
    });
  });
});
