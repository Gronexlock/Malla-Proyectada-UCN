import * as proyeccionActions from "@/src/actions/proyeccionActions";
import { Curso, CursoStatus } from "@/src/types/curso";
import { describe, expect, it, vi } from "vitest";
import * as cursosUtils from "../cursosUtils";
import {
  aplicarEstadosProyeccion,
  aprobarCursosInscritos,
  calcularPorcentajeAvance,
  comprobarProyeccionValida,
  desinscribirCursos,
  getCantidadCreditosRestantes,
  getCantidadCursosPendientes,
  getCantidadSemestresProyeccion,
  getCreditosProyeccion,
  getCreditosProyeccionTotal,
  getCursosBloqueantes,
  getCursosDisponibles,
  getNivelEstudiante,
  getProyeccionById,
  getProyecciones,
  getUltimoSemestreProyeccion,
  irSemestreAnterior,
  isDisperso,
  isProyeccionCompleta,
  limpiarProyeccionActual,
  toggleCursoProyeccionActual,
  toggleEstadoCurso,
} from "../proyeccionUtils";

vi.mock("@/src/actions/proyeccionActions");
vi.mock("../cursosUtils", async () => {
  const actual = await vi.importActual<typeof import("../cursosUtils")>(
    "../cursosUtils"
  );
  return {
    ...actual,
    getMalla: vi.fn(),
  };
});

describe("proyeccionUtils", () => {
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
    status: [CursoStatus.INSCRITO],
  };

  const mockCurso3: Curso = {
    codigo: "TEST-003",
    asignatura: "Curso Test 3",
    creditos: 5,
    nivel: 3,
    prerrequisitos: [],
    nrc: "",
    periodo: "",
    status: [CursoStatus.APROBADO],
  };

  describe("aprobarCursosInscritos", () => {
    it("debe agregar estado APROBADO a cursos inscritos", () => {
      const cursos = [mockCurso1, mockCurso2];
      const result = aprobarCursosInscritos(cursos);

      expect(result[1].status).toContain(CursoStatus.APROBADO);
      expect(result[1].status).toContain(CursoStatus.INSCRITO);
    });

    it("no debe modificar cursos que no están inscritos", () => {
      const cursos = [mockCurso1];
      const result = aprobarCursosInscritos(cursos);

      expect(result[0].status).not.toContain(CursoStatus.APROBADO);
    });
  });

  describe("toggleEstadoCurso", () => {
    it("debe agregar INSCRITO si el curso no lo está", () => {
      const result = toggleEstadoCurso([mockCurso1], mockCurso1);

      expect(result[0].status).toContain(CursoStatus.INSCRITO);
    });

    it("debe remover INSCRITO si el curso ya lo está", () => {
      const result = toggleEstadoCurso([mockCurso2], mockCurso2);

      expect(result[0].status).not.toContain(CursoStatus.INSCRITO);
    });

    it("no debe modificar cursos ya aprobados", () => {
      const result = toggleEstadoCurso([mockCurso3], mockCurso3);

      expect(result[0].status).toEqual([CursoStatus.APROBADO]);
    });
  });

  describe("toggleCursoProyeccionActual", () => {
    it("debe agregar curso si no está en la proyección", () => {
      const result = toggleCursoProyeccionActual(mockCurso1, []);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockCurso1);
    });

    it("debe remover curso si ya está en la proyección", () => {
      const result = toggleCursoProyeccionActual(mockCurso1, [mockCurso1]);

      expect(result).toHaveLength(0);
    });

    it("debe mantener otros cursos en la proyección", () => {
      const result = toggleCursoProyeccionActual(mockCurso2, [mockCurso1]);

      expect(result).toHaveLength(2);
      expect(result).toContain(mockCurso1);
      expect(result).toContain(mockCurso2);
    });
  });

  describe("getCreditosProyeccion", () => {
    it("debe calcular créditos correctamente", () => {
      const result = getCreditosProyeccion([mockCurso1, mockCurso2]);
      expect(result).toBe(10); 
    });

    it("debe retornar 0 para array vacío", () => {
      const result = getCreditosProyeccion([]);
      expect(result).toBe(0);
    });
  });

  describe("getCreditosProyeccionTotal", () => {
    it("debe calcular créditos totales de todos los semestres", () => {
      const proyeccion = {
        "2025-1": [mockCurso1],
        "2025-2": [mockCurso2, mockCurso3],
      };
      const result = getCreditosProyeccionTotal(proyeccion);
      expect(result).toBe(15); 
    });

    it("debe retornar 0 para proyección vacía", () => {
      const result = getCreditosProyeccionTotal({});
      expect(result).toBe(0);
    });
  });

  describe("getCantidadSemestresProyeccion", () => {
    it("debe contar semestres correctamente", () => {
      const proyeccion = {
        "2025-1": [mockCurso1],
        "2025-2": [mockCurso2],
      };
      const result = getCantidadSemestresProyeccion(proyeccion);
      expect(result).toBe(2);
    });

    it("debe retornar 0 para proyección vacía", () => {
      const result = getCantidadSemestresProyeccion({});
      expect(result).toBe(0);
    });
  });

  describe("getCursosBloqueantes", () => {
    it("debe retornar prerrequisitos no aprobados", () => {
      const cursoConPrereq: Curso = {
        ...mockCurso1,
        prerrequisitos: [mockCurso2],
      };
      const result = getCursosBloqueantes(cursoConPrereq, [
        cursoConPrereq,
        mockCurso2,
      ]);

      expect(result).toHaveLength(1);
      expect(result[0].codigo).toBe(mockCurso2.codigo);
    });

    it("debe retornar array vacío si el curso está aprobado", () => {
      const result = getCursosBloqueantes(mockCurso3, [mockCurso3]);
      expect(result).toHaveLength(0);
    });

    it("debe retornar array vacío si todos los prerrequisitos están aprobados", () => {
      const cursoConPrereq: Curso = {
        ...mockCurso1,
        prerrequisitos: [mockCurso3],
      };
      const result = getCursosBloqueantes(cursoConPrereq, [
        cursoConPrereq,
        mockCurso3,
      ]);

      expect(result).toHaveLength(0);
    });
  });

  describe("getNivelEstudiante", () => {
    it("debe retornar el primer nivel no completado", () => {
      const cursos = [
        { ...mockCurso1, nivel: 1, status: [CursoStatus.APROBADO] },
        { ...mockCurso2, nivel: 2, status: [CursoStatus.PENDIENTE] },
      ];
      const result = getNivelEstudiante(cursos);
      expect(result).toBe(2);
    });

    it("debe retornar 0 si todos los niveles están completos", () => {
      const cursos = [
        { ...mockCurso1, nivel: 1, status: [CursoStatus.APROBADO] },
        { ...mockCurso2, nivel: 2, status: [CursoStatus.APROBADO] },
      ];
      const result = getNivelEstudiante(cursos);
      expect(result).toBe(0);
    });
  });

  describe("isDisperso", () => {
    it("debe retornar true si el curso está más de 2 niveles adelante", () => {
      const curso = { ...mockCurso1, nivel: 5 };
      const result = isDisperso(curso, 2);
      expect(result).toBe(true);
    });

    it("debe retornar false si el curso está dentro del rango permitido", () => {
      const curso = { ...mockCurso1, nivel: 3 };
      const result = isDisperso(curso, 2);
      expect(result).toBe(false);
    });

    it("debe retornar false si el curso está aprobado", () => {
      const curso = { ...mockCurso3, nivel: 10 };
      const result = isDisperso(curso, 1);
      expect(result).toBe(false);
    });
  });

  describe("calcularPorcentajeAvance", () => {
    it("debe calcular porcentaje correctamente", () => {
      const cursos = [
        { ...mockCurso1, status: [CursoStatus.APROBADO] },
        { ...mockCurso2, status: [CursoStatus.PENDIENTE] },
        { ...mockCurso3, status: [CursoStatus.APROBADO] },
      ];
      const result = calcularPorcentajeAvance(cursos);
      expect(result).toBe(66); 
    });

    it("debe retornar 0 si no hay cursos aprobados", () => {
      const cursos = [mockCurso1, mockCurso2];
      const result = calcularPorcentajeAvance(cursos);
      expect(result).toBe(0);
    });

    it("debe retornar 100 si todos están aprobados", () => {
      const cursos = [mockCurso3];
      const result = calcularPorcentajeAvance(cursos);
      expect(result).toBe(100);
    });
  });

  describe("getUltimoSemestreProyeccion", () => {
    it("debe retornar el último semestre", () => {
      const proyeccion = {
        "2025-1": [mockCurso1],
        "2025-2": [mockCurso2],
      };
      const result = getUltimoSemestreProyeccion(proyeccion);
      expect(result).toBe("2025-2");
    });

    it("debe retornar undefined para proyección vacía", () => {
      const result = getUltimoSemestreProyeccion({});
      expect(result).toBeUndefined();
    });
  });

  describe("getCantidadCursosPendientes", () => {
    it("debe contar cursos no aprobados", () => {
      const cursos = [mockCurso1, mockCurso2, mockCurso3];
      const result = getCantidadCursosPendientes(cursos);
      expect(result).toBe(2);
    });

    it("debe retornar 0 si todos están aprobados", () => {
      const cursos = [mockCurso3];
      const result = getCantidadCursosPendientes(cursos);
      expect(result).toBe(0);
    });
  });

  describe("getCantidadCreditosRestantes", () => {
    it("debe calcular créditos restantes", () => {
      const cursos = [mockCurso1, mockCurso2, mockCurso3];
      const result = getCantidadCreditosRestantes(cursos);
      expect(result).toBe(10); 
    });

    it("debe retornar 0 si todos están aprobados", () => {
      const cursos = [mockCurso3];
      const result = getCantidadCreditosRestantes(cursos);
      expect(result).toBe(0);
    });
  });

  describe("getCursosDisponibles", () => {
    it("debe retornar cursos disponibles para inscribir", () => {
      const cursos = [
        { ...mockCurso1, nivel: 1, status: [CursoStatus.PENDIENTE] },
        { ...mockCurso3, nivel: 1, status: [CursoStatus.APROBADO] },
      ];
      const result = getCursosDisponibles(cursos);
      expect(result).toHaveLength(1);
      expect(result[0].codigo).toBe(mockCurso1.codigo);
    });

    it("no debe incluir cursos inscritos", () => {
      const cursos = [mockCurso2];
      const result = getCursosDisponibles(cursos);
      expect(result).toHaveLength(0);
    });
  });

  describe("isProyeccionCompleta", () => {
    it("debe retornar true si todos están aprobados", () => {
      const cursos = [mockCurso3];
      const result = isProyeccionCompleta(cursos);
      expect(result).toBe(true);
    });

    it("debe retornar false si hay cursos pendientes", () => {
      const cursos = [mockCurso1, mockCurso3];
      const result = isProyeccionCompleta(cursos);
      expect(result).toBe(false);
    });
  });

  describe("desinscribirCursos", () => {
    it("debe remover estado INSCRITO de todos los cursos", () => {
      const cursos = [mockCurso2];
      const result = desinscribirCursos(cursos);
      expect(result[0].status).not.toContain(CursoStatus.INSCRITO);
    });

    it("no debe modificar otros estados", () => {
      const curso = {
        ...mockCurso2,
        status: [CursoStatus.INSCRITO, CursoStatus.REPROBADO],
      };
      const result = desinscribirCursos([curso]);
      expect(result[0].status).toContain(CursoStatus.REPROBADO);
    });
  });

  describe("limpiarProyeccionActual", () => {
    it("debe eliminar el último semestre", () => {
      const proyeccion = {
        "2025-1": [mockCurso1],
        "2025-2": [mockCurso2],
      };
      const result = limpiarProyeccionActual(proyeccion);
      expect(result["2025-1"]).toBeDefined();
      expect(result["2025-2"]).toBeUndefined();
    });

    it("debe retornar objeto vacío si solo hay un semestre", () => {
      const proyeccion = {
        "2025-1": [mockCurso1],
      };
      const result = limpiarProyeccionActual(proyeccion);
      expect(Object.keys(result)).toHaveLength(0);
    });
  });

  describe("aplicarEstadosProyeccion", () => {
    it("debe marcar cursos proyectados como APROBADO", () => {
      const proyeccion = {
        "2025-1": [mockCurso1],
      };
      const result = aplicarEstadosProyeccion(
        [mockCurso1, mockCurso2],
        proyeccion
      );
      expect(result[0].status).toEqual([CursoStatus.APROBADO]);
    });

    it("no debe modificar cursos no proyectados", () => {
      const proyeccion = {
        "2025-1": [mockCurso1],
      };
      const result = aplicarEstadosProyeccion(
        [mockCurso1, mockCurso2],
        proyeccion
      );
      expect(result[1].status).toEqual(mockCurso2.status);
    });
  });

  describe("comprobarProyeccionValida", () => {
    it("debe retornar true para proyección válida", () => {
      const proyeccion = {
        "2025-1": [mockCurso1],
      };
      const cursosIniciales = [mockCurso1];
      const result = comprobarProyeccionValida(proyeccion, cursosIniciales);
      expect(result).toBe(true);
    });

    it("debe retornar false para proyección vacía", () => {
      const result = comprobarProyeccionValida({}, [mockCurso1]);
      expect(result).toBe(false);
    });

    it("debe retornar false si faltan cursos pendientes", () => {
      const proyeccion = {
        "2025-1": [mockCurso1],
      };
      const cursosIniciales = [mockCurso1, mockCurso2];
      const result = comprobarProyeccionValida(proyeccion, cursosIniciales);
      expect(result).toBe(false);
    });

    it("debe retornar false si incluye cursos ya aprobados", () => {
      const proyeccion = {
        "2025-1": [mockCurso3],
      };
      const cursosIniciales = [mockCurso1, mockCurso3];
      const result = comprobarProyeccionValida(proyeccion, cursosIniciales);
      expect(result).toBe(false);
    });
  });

  describe("getProyecciones", () => {
    it("debe obtener y formatear proyecciones del estudiante", async () => {
      const mockMalla = [mockCurso1, mockCurso2, mockCurso3];
      const mockProyeccionesDB = [
        {
          id: 1,
          estudianteRut: "12345678-9",
          carreraCodigo: "ICI-2019",
          cursos: [
            { cursoCodigo: "TEST-001", semestre: "2025-1", proyeccionId: 1 },
            { cursoCodigo: "TEST-002", semestre: "2025-2", proyeccionId: 1 },
          ],
        },
      ];

      vi.mocked(cursosUtils.getMalla).mockResolvedValue(mockMalla);
      vi.mocked(proyeccionActions.fetchProyecciones).mockResolvedValue(
        mockProyeccionesDB as any
      );

      const result = await getProyecciones({
        codigo: "ICI-2019",
        nombre: "Ingeniería Civil Informática",
        catalogo: "2019",
      });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(result[0].semestres).toHaveLength(2);
      expect(result[0].semestres[0].semestre).toBe("2025-1");
      expect(result[0].semestres[0].cursos).toHaveLength(1);
    });

    it("debe manejar cursos no encontrados en la malla", async () => {
      const mockProyeccionesDB = [
        {
          id: 1,
          estudianteRut: "12345678-9",
          carreraCodigo: "ICI-2019",
          cursos: [
            { cursoCodigo: "TEST-999", semestre: "2025-1", proyeccionId: 1 },
          ],
        },
      ];

      vi.mocked(cursosUtils.getMalla).mockResolvedValue([mockCurso1]);
      vi.mocked(proyeccionActions.fetchProyecciones).mockResolvedValue(
        mockProyeccionesDB as any
      );

      const result = await getProyecciones({
        codigo: "ICI-2019",
        nombre: "Ingeniería Civil Informática",
        catalogo: "2019",
      });

      expect(result[0].semestres).toHaveLength(0);
    });

    it("debe ordenar semestres alfabéticamente", async () => {
      const mockMalla = [mockCurso1, mockCurso2];
      const mockProyeccionesDB = [
        {
          id: 1,
          estudianteRut: "12345678-9",
          carreraCodigo: "ICI-2019",
          cursos: [
            { cursoCodigo: "TEST-002", semestre: "2025-2", proyeccionId: 1 },
            { cursoCodigo: "TEST-001", semestre: "2025-1", proyeccionId: 1 },
          ],
        },
      ];

      vi.mocked(cursosUtils.getMalla).mockResolvedValue(mockMalla);
      vi.mocked(proyeccionActions.fetchProyecciones).mockResolvedValue(
        mockProyeccionesDB as any
      );

      const result = await getProyecciones({
        codigo: "ICI-2019",
        nombre: "Ingeniería Civil Informática",
        catalogo: "2019",
      });

      expect(result[0].semestres[0].semestre).toBe("2025-1");
      expect(result[0].semestres[1].semestre).toBe("2025-2");
    });
  });

  describe("getProyeccionById", () => {
    it("debe obtener y formatear una proyección específica", async () => {
      const mockMalla = [mockCurso1, mockCurso2];
      const mockProyeccionDB = {
        id: 1,
        estudianteRut: "12345678-9",
        carreraCodigo: "ICI-2019",
        cursos: [
          { cursoCodigo: "TEST-001", semestre: "2025-1", proyeccionId: 1 },
          { cursoCodigo: "TEST-002", semestre: "2025-1", proyeccionId: 1 },
        ],
      };

      vi.mocked(cursosUtils.getMalla).mockResolvedValue(mockMalla);
      vi.mocked(proyeccionActions.fetchProyeccionById).mockResolvedValue(
        mockProyeccionDB as any
      );

      const result = await getProyeccionById(1, {
        codigo: "ICI-2019",
        nombre: "Ingeniería Civil Informática",
        catalogo: "2019",
      });

      expect(result.id).toBe(1);
      expect(result.semestres).toHaveLength(1);
      expect(result.semestres[0].cursos).toHaveLength(2);
    });

    it("debe ordenar semestres correctamente", async () => {
      const mockMalla = [mockCurso1, mockCurso2, mockCurso3];
      const mockProyeccionDB = {
        id: 1,
        estudianteRut: "12345678-9",
        carreraCodigo: "ICI-2019",
        cursos: [
          { cursoCodigo: "TEST-003", semestre: "2025-2", proyeccionId: 1 },
          { cursoCodigo: "TEST-001", semestre: "2025-1", proyeccionId: 1 },
        ],
      };

      vi.mocked(cursosUtils.getMalla).mockResolvedValue(mockMalla);
      vi.mocked(proyeccionActions.fetchProyeccionById).mockResolvedValue(
        mockProyeccionDB as any
      );

      const result = await getProyeccionById(1, {
        codigo: "ICI-2019",
        nombre: "Ingeniería Civil Informática",
        catalogo: "2019",
      });

      expect(result.semestres[0].semestre).toBe("2025-1");
      expect(result.semestres[1].semestre).toBe("2025-2");
    });
  });

  describe("irSemestreAnterior", () => {
    it("debe retroceder al semestre objetivo y limpiar posteriores", () => {
      const curso1 = {
        ...mockCurso1,
        status: [CursoStatus.APROBADO, CursoStatus.INSCRITO],
      };
      const curso2 = {
        ...mockCurso2,
        status: [CursoStatus.APROBADO],
      };

      const semestres = ["2025-1", "2025-2"];
      const proyecciones = {
        "2025-1": [curso1],
        "2025-2": [curso2],
      };

      const result = irSemestreAnterior(
        "2025-1",
        semestres,
        [curso1, curso2],
        proyecciones
      );

      expect(result.nuevosSemestres).toHaveLength(1);
      expect(result.nuevosSemestres[0]).toBe("2025-1");
      expect(result.nuevasProyecciones["2025-2"]).toBeUndefined();
    });

    it("debe mantener INSCRITO en el semestre objetivo", () => {
      const curso1 = {
        ...mockCurso1,
        status: [CursoStatus.APROBADO, CursoStatus.INSCRITO],
      };
      const curso2 = {
        ...mockCurso2,
        status: [CursoStatus.INSCRITO],
      };

      const semestres = ["2025-1", "2025-2"];
      const proyecciones = {
        "2025-1": [curso1],
        "2025-2": [curso2],
      };

      const result = irSemestreAnterior(
        "2025-1",
        semestres,
        [curso1, curso2],
        proyecciones
      );

      expect(curso1.status).toContain(CursoStatus.INSCRITO);
    });

    it("debe remover APROBADO de cursos en semestres eliminados", () => {
      const curso1 = {
        ...mockCurso1,
        status: [CursoStatus.APROBADO],
      };
      const curso2 = {
        ...mockCurso2,
        status: [CursoStatus.APROBADO, CursoStatus.INSCRITO],
      };

      const semestres = ["2025-1", "2025-2"];
      const proyecciones = {
        "2025-1": [curso1],
        "2025-2": [curso2],
      };

      const result = irSemestreAnterior(
        "2025-1",
        semestres,
        [curso1, curso2],
        proyecciones
      );

      expect(curso2.status).not.toContain(CursoStatus.APROBADO);
      expect(curso2.status).not.toContain(CursoStatus.INSCRITO);
    });

    it("debe agregar INSCRITO a cursos del semestre objetivo si no lo tienen", () => {
      const curso1 = {
        ...mockCurso1,
        status: [CursoStatus.APROBADO],
      };

      const semestres = ["2025-1", "2025-2"];
      const proyecciones = {
        "2025-1": [curso1],
        "2025-2": [],
      };

      const result = irSemestreAnterior(
        "2025-1",
        semestres,
        [curso1],
        proyecciones
      );

      expect(curso1.status).toContain(CursoStatus.INSCRITO);
    });
  });
});
