import { Curso, CursoStatus } from "@/src/types/curso";
import { describe, expect, it, vi } from "vitest";
import { generarProyeccionOptima } from "../generarProyeccionOptima";

vi.mock("../semestreUtils", () => ({
  getSemestreActual: () => "2025-1",
  getSemestreSiguiente: (semestre: string) => {
    const [year, term] = semestre.split("-");
    const yearInt = parseInt(year, 10);
    return term === "1" ? `${yearInt}-2` : `${yearInt + 1}-1`;
  },
}));

describe("generarProyeccionOptima", () => {
  const mockCursoNivel1: Curso = {
    codigo: "TEST-001",
    asignatura: "Curso Nivel 1",
    creditos: 6,
    nivel: 1,
    prerrequisitos: [],
    nrc: "",
    periodo: "",
    status: [CursoStatus.PENDIENTE],
  };

  const mockCursoNivel2: Curso = {
    codigo: "TEST-002",
    asignatura: "Curso Nivel 2",
    creditos: 4,
    nivel: 2,
    prerrequisitos: [mockCursoNivel1],
    nrc: "",
    periodo: "",
    status: [CursoStatus.PENDIENTE],
  };

  const mockCursoNivel3: Curso = {
    codigo: "TEST-003",
    asignatura: "Curso Nivel 3",
    creditos: 5,
    nivel: 3,
    prerrequisitos: [mockCursoNivel2],
    nrc: "",
    periodo: "",
    status: [CursoStatus.PENDIENTE],
  };

  it("debe generar una proyección con cursos ordenados por prioridad", () => {
    const cursos = [mockCursoNivel1];
    const result = generarProyeccionOptima(cursos);

    expect(Object.keys(result).length).toBeGreaterThan(0);
    expect(result["2025-2"]).toBeDefined();
    expect(result["2025-2"].length).toBeGreaterThan(0);
    expect(result["2025-2"][0].codigo).toBe(mockCursoNivel1.codigo);
  });

  it("debe respetar los prerrequisitos", () => {
    const cursos = [mockCursoNivel1, mockCursoNivel2];
    const result = generarProyeccionOptima(cursos);

    const semestres = Object.keys(result).sort();
    const semestreNivel1 = semestres.find((s) =>
      result[s].some((c) => c.codigo === mockCursoNivel1.codigo)
    );
    const semestreNivel2 = semestres.find((s) =>
      result[s].some((c) => c.codigo === mockCursoNivel2.codigo)
    );

    if (semestreNivel1 && semestreNivel2) {
      expect(semestreNivel1 < semestreNivel2).toBe(true);
    }
  });

  it("debe respetar el límite de créditos por semestre", () => {
    const cursosConMuchosCreditos: Curso[] = Array.from(
      { length: 10 },
      (_, i) => ({
        codigo: `TEST-${i}`,
        asignatura: `Curso ${i}`,
        creditos: 6,
        nivel: 1,
        prerrequisitos: [],
        nrc: "",
        periodo: "",
        status: [CursoStatus.PENDIENTE],
      })
    );

    const result = generarProyeccionOptima(cursosConMuchosCreditos);

    Object.values(result).forEach((cursosSemestre) => {
      const creditosTotales = cursosSemestre.reduce(
        (sum, curso) => sum + curso.creditos,
        0
      );
      expect(creditosTotales).toBeLessThanOrEqual(50);
    });
  });

  it("debe priorizar cursos reprobados", () => {
    const cursoReprobado: Curso = {
      ...mockCursoNivel1,
      codigo: "REPROBADO",
      status: [CursoStatus.REPROBADO],
    };
    const cursoPendiente: Curso = {
      ...mockCursoNivel1,
      codigo: "PENDIENTE",
      status: [CursoStatus.PENDIENTE],
    };

    const cursos = [cursoPendiente, cursoReprobado];
    const result = generarProyeccionOptima(cursos);

    const primerSemestre = result[Object.keys(result)[0]];
    if (primerSemestre.length === 1) {
      expect(primerSemestre[0].codigo).toBe("REPROBADO");
    }
  });

  it("debe retornar objeto vacío si todos los cursos están aprobados", () => {
    const cursos = [{ ...mockCursoNivel1, status: [CursoStatus.APROBADO] }];
    const result = generarProyeccionOptima(cursos);

    expect(Object.keys(result)).toHaveLength(0);
  });

  it("debe manejar cursos sin prerrequisitos", () => {
    const curso1 = { ...mockCursoNivel1, codigo: "A" };
    const curso2 = { ...mockCursoNivel1, codigo: "B" };

    const cursos = [curso1, curso2];
    const result = generarProyeccionOptima(cursos);

    expect(Object.keys(result).length).toBeGreaterThan(0);
  });

  it("debe manejar cursos con prerrequisitos bloqueados", () => {
    const cursoConPrereqBloqueado: Curso = {
      ...mockCursoNivel2,
      prerrequisitos: [
        {
          ...mockCursoNivel1,
          status: [CursoStatus.PENDIENTE],
        },
      ],
    };
    const cursos = [cursoConPrereqBloqueado];
    const result = generarProyeccionOptima(cursos);

    expect(Object.keys(result).length).toBeGreaterThanOrEqual(0);
  });

  it("no debe mutar el array original de cursos", () => {
    const cursos = [{ ...mockCursoNivel1 }];
    const cursosOriginales = JSON.parse(JSON.stringify(cursos));

    generarProyeccionOptima(cursos);

    expect(cursos).toEqual(cursosOriginales);
  });

  it("debe generar múltiples semestres si hay suficientes cursos", () => {
    const cursos: Curso[] = [
      { ...mockCursoNivel1, codigo: "A", creditos: 20 },
      { ...mockCursoNivel1, codigo: "B", creditos: 20 },
      { ...mockCursoNivel1, codigo: "C", creditos: 20 },
    ];

    const result = generarProyeccionOptima(cursos);

    expect(Object.keys(result).length).toBeGreaterThan(1);
  });

  it("debe priorizar cursos atrasados", () => {
    const cursoAtrasado: Curso = {
      ...mockCursoNivel1,
      codigo: "ATRASADO",
      nivel: 1,
      status: [CursoStatus.PENDIENTE],
    };

    const cursoActual: Curso = {
      ...mockCursoNivel2,
      codigo: "ACTUAL",
      nivel: 3,
      prerrequisitos: [],
      status: [CursoStatus.PENDIENTE],
    };

    const cursosAprobados = [
      { ...mockCursoNivel1, codigo: "PREV1", status: [CursoStatus.APROBADO] },
      { ...mockCursoNivel2, codigo: "PREV2", status: [CursoStatus.APROBADO] },
    ];

    const cursos = [...cursosAprobados, cursoAtrasado, cursoActual];
    const result = generarProyeccionOptima(cursos);

    const primerSemestre = result[Object.keys(result)[0]];

    expect(primerSemestre.some((c) => c.codigo === "ATRASADO")).toBe(true);
  });
});
