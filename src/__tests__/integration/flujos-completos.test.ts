import * as authActions from "@/src/actions/authActions";
import { login } from "@/src/actions/authActions";
import { fetchAvance } from "@/src/actions/avanceActions";
import * as cookiesActions from "@/src/actions/cookiesActions";
import { getUser, setUser } from "@/src/actions/cookiesActions";
import { fetchMalla } from "@/src/actions/mallaActions";
import {
  fetchProyecciones,
  guardarProyeccion,
} from "@/src/actions/proyeccionActions";
import prisma from "@/src/lib/prisma";
import { Carrera } from "@/src/types/carrera";
import { CursoStatus } from "@/src/types/curso";
import { getAvanceCurricular, getMalla } from "@/src/utils/cursosUtils";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/src/lib/prisma", () => ({
  default: {
    proyeccion: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  })),
}));

vi.mock("@/src/actions/mallaActions");
vi.mock("@/src/actions/avanceActions");

global.fetch = vi.fn();

const mockedFetchMalla = fetchMalla as unknown as {
  mockResolvedValueOnce: (...args: any[]) => any;
};

const mockedFetchAvance = fetchAvance as unknown as {
  mockResolvedValueOnce: (...args: any[]) => any;
};

const mockCarrera: Carrera = {
  codigo: "ICCI",
  catalogo: "2024",
  nombre: "Ingeniería Civil en Computación e Informática",
};

const mockUser = {
  rut: "12345678",
  carreras: [mockCarrera],
  selectedCarrera: mockCarrera,
};

describe("II.A.5 - Flujos Transaccionales Backend", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.JWT_SECRET = "test-secret";
    vi.spyOn(authActions, "verifyToken").mockResolvedValue(mockUser as any);
    vi.spyOn(cookiesActions, "getUser").mockResolvedValue({
      ...mockUser,
      selectedCarrera: mockCarrera,
    } as any);
  });

  it("debe completar el flujo: Login → Obtener Usuario", async () => {
    const mockCookies = {
      get: vi.fn((name: string) => {
        if (name === "token") return { value: "mock-jwt-token" };
        if (name === "user") return { value: JSON.stringify(mockUser) };
        return undefined;
      }),
      set: vi.fn(),
      delete: vi.fn(),
    };

    (await import("next/headers")).cookies = vi.fn(() => mockCookies as any);

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        rut: mockUser.rut,
        carreras: mockUser.carreras,
      }),
    });

    const loginResult = await login("test@ucn.cl", "password");
    expect(loginResult.success).toBe(true);

    const user = await getUser();
    expect(user.rut).toBe(mockUser.rut);
    expect(user.selectedCarrera).toBeDefined();
  });

  it("debe completar el flujo: Obtener Malla → Ver Avance", async () => {
    const mockMalla = [
      {
        codigo: "DCCB-00141",
        asignatura: "Cálculo I",
        creditos: 6,
        nivel: 1,
        prereq: "",
      },
    ];

    const mockAvance = [
      {
        nrc: "12345",
        period: "2024-1",
        student: mockUser.rut,
        course: "DCCB-00141",
        excluded: false,
        inscriptionType: "NORMAL",
        status: CursoStatus.APROBADO,
      },
    ];

    mockedFetchMalla.mockResolvedValueOnce(mockMalla);
    mockedFetchMalla.mockResolvedValueOnce(mockMalla);
    mockedFetchAvance.mockResolvedValueOnce(mockAvance);

    const malla = await getMalla(mockCarrera);
    const avance = await getAvanceCurricular(mockCarrera);

    expect(malla.length).toBeGreaterThan(0);
    expect(avance.length).toBeGreaterThan(0);
    expect(avance[0].status).toContain(CursoStatus.APROBADO);
  });

  it("debe escribir y leer proyecciones en la base de datos", async () => {
    const mockCookies = {
      get: vi.fn((name: string) => {
        if (name === "token") return { value: "mock-jwt-token" };
        if (name === "user") return { value: JSON.stringify(mockUser) };
        return undefined;
      }),
      set: vi.fn(),
      delete: vi.fn(),
    };

    (await import("next/headers")).cookies = vi.fn(() => mockCookies as any);

    const mockMalla = [
      {
        codigo: "DCCB-00141",
        asignatura: "Cálculo I",
        creditos: 6,
        nivel: 1,
        prereq: "",
      },
    ];

    mockedFetchMalla.mockResolvedValueOnce(mockMalla);
    mockedFetchAvance.mockResolvedValueOnce([]);

    const cursosIniciales = await getAvanceCurricular(mockCarrera);

    const nuevaProyeccion = {
      id: 1,
      estudianteRut: mockUser.rut,
      carreraCodigo: mockCarrera.codigo,
      createdAt: new Date(),
      cursos: [],
    };

    (prisma.proyeccion.create as any).mockResolvedValueOnce(nuevaProyeccion);

    const proyeccionData = {
      "2024-2": [
        {
          ...cursosIniciales[0],
          status: [CursoStatus.INSCRITO],
        },
      ],
    };

    const resultadoGuardar = await guardarProyeccion(
      proyeccionData,
      cursosIniciales
    );
    expect(resultadoGuardar.success).toBe(true);

    (prisma.proyeccion.findMany as any).mockResolvedValueOnce([
      nuevaProyeccion,
    ]);

    const proyeccionesLeidas = await fetchProyecciones();
    expect(proyeccionesLeidas.length).toBe(1);
    expect(proyeccionesLeidas[0].estudianteRut).toBe(mockUser.rut);
  });
});

describe("II.B.1 - Flujos Críticos E2E", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.JWT_SECRET = "test-secret";
    vi.spyOn(authActions, "verifyToken").mockResolvedValue(mockUser as any);
    vi.spyOn(cookiesActions, "getUser").mockResolvedValue({
      selectedCarrera: mockCarrera,
    } as any);
  });

  it("Flujo E2E: Usuario visualiza su malla curricular", async () => {
    const mockCookies = {
      get: vi.fn(() => ({ value: JSON.stringify(mockUser) })),
      set: vi.fn(),
      delete: vi.fn(),
    };

    (await import("next/headers")).cookies = vi.fn(() => mockCookies as any);

    const mockMalla = [
      {
        codigo: "DCCB-00141",
        asignatura: "Cálculo I",
        creditos: 6,
        nivel: 1,
        prereq: "",
      },
    ];

    mockedFetchMalla.mockResolvedValueOnce(mockMalla);

    const user = await getUser();
    const malla = await getMalla(user.selectedCarrera);

    expect(malla.length).toBeGreaterThan(0);
    expect(malla[0].codigo).toBe("DCCB-00141");
  });

  it("Flujo E2E: Usuario visualiza su avance curricular", async () => {
    const mockMalla = [
      {
        codigo: "DCCB-00141",
        asignatura: "Cálculo I",
        creditos: 6,
        nivel: 1,
        prereq: "",
      },
    ];

    const mockAvance = [
      {
        nrc: "12345",
        period: "2024-1",
        student: mockUser.rut,
        course: "DCCB-00141",
        excluded: false,
        inscriptionType: "NORMAL",
        status: CursoStatus.APROBADO,
      },
    ];

    mockedFetchMalla.mockResolvedValueOnce(mockMalla);
    mockedFetchAvance.mockResolvedValueOnce(mockAvance);

    const avance = await getAvanceCurricular(mockCarrera);

    expect(avance.length).toBeGreaterThan(0);
    expect(avance[0].status).toContain(CursoStatus.APROBADO);
  });

  it("Flujo E2E: Usuario crea y guarda una proyección académica", async () => {
    const mockCookies = {
      get: vi.fn((name: string) => {
        if (name === "token") return { value: "mock-token" };
        if (name === "user") return { value: JSON.stringify(mockUser) };
        return undefined;
      }),
      set: vi.fn(),
      delete: vi.fn(),
    };

    (await import("next/headers")).cookies = vi.fn(() => mockCookies as any);

    const mockMalla = [
      {
        codigo: "DCCB-00141",
        asignatura: "Cálculo I",
        creditos: 6,
        nivel: 1,
        prereq: "",
      },
    ];

    mockedFetchMalla.mockResolvedValueOnce(mockMalla);
    mockedFetchAvance.mockResolvedValueOnce([]);

    const cursosIniciales = await getAvanceCurricular(mockCarrera);

    const proyeccionData = {
      "2025-1": [
        {
          ...cursosIniciales[0],
          status: [CursoStatus.INSCRITO],
        },
      ],
    };

    const mockProyeccionGuardada = {
      id: 1,
      estudianteRut: mockUser.rut,
      carreraCodigo: mockCarrera.codigo,
      createdAt: new Date(),
      cursos: [
        {
          cursoCodigo: "DCCB-00141",
          proyeccionId: 1,
          semestre: "2025-1",
        },
      ],
    };

    (prisma.proyeccion.create as any).mockResolvedValueOnce(
      mockProyeccionGuardada
    );
    (prisma.proyeccion.findMany as any).mockResolvedValueOnce([
      mockProyeccionGuardada,
    ]);

    const resultado = await guardarProyeccion(proyeccionData, cursosIniciales);
    expect(resultado.success).toBe(true);

    const proyecciones = await fetchProyecciones();
    expect(proyecciones.length).toBe(1);
  });
});

describe("II.B.2 - Cobertura de Requisitos Funcionales", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.JWT_SECRET = "test-secret";
    vi.spyOn(authActions, "verifyToken").mockResolvedValue(mockUser as any);
    vi.spyOn(cookiesActions, "getUser").mockResolvedValue({
      selectedCarrera: mockCarrera,
    } as any);
  });

  it("RF-001: Autenticación de usuarios", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        rut: mockUser.rut,
        carreras: mockUser.carreras,
      }),
    });

    const resultado = await login("test@ucn.cl", "password");
    expect(resultado.success).toBe(true);
  });

  it("RF-002: Visualización de malla curricular", async () => {
    const mockMalla = [
      {
        codigo: "DCCB-00141",
        asignatura: "Cálculo I",
        creditos: 6,
        nivel: 1,
        prereq: "",
      },
    ];

    mockedFetchMalla.mockResolvedValueOnce(mockMalla);

    const malla = await getMalla(mockCarrera);
    expect(malla.length).toBeGreaterThan(0);
    expect(malla[0]).toHaveProperty("codigo");
    expect(malla[0]).toHaveProperty("asignatura");
    expect(malla[0]).toHaveProperty("creditos");
  });

  it("RF-003: Visualización de avance curricular", async () => {
    const mockMalla = [
      {
        codigo: "DCCB-00141",
        asignatura: "Cálculo I",
        creditos: 6,
        nivel: 1,
        prereq: "",
      },
    ];

    const mockAvance = [
      {
        nrc: "12345",
        period: "2024-1",
        student: mockUser.rut,
        course: "DCCB-00141",
        excluded: false,
        inscriptionType: "NORMAL",
        status: CursoStatus.APROBADO,
      },
    ];

    mockedFetchMalla.mockResolvedValueOnce(mockMalla);
    mockedFetchAvance.mockResolvedValueOnce(mockAvance);

    const avance = await getAvanceCurricular(mockCarrera);
    expect(avance.length).toBeGreaterThan(0);
    expect(avance[0]).toHaveProperty("status");
  });

  it("RF-004: Creación de proyecciones académicas", async () => {
    const mockCookies = {
      get: vi.fn((name: string) => {
        if (name === "token") return { value: "mock-token" };
        if (name === "user") return { value: JSON.stringify(mockUser) };
        return undefined;
      }),
      set: vi.fn(),
      delete: vi.fn(),
    };

    (await import("next/headers")).cookies = vi.fn(() => mockCookies as any);

    const mockMalla = [
      {
        codigo: "DCCB-00141",
        asignatura: "Cálculo I",
        creditos: 6,
        nivel: 1,
        prereq: "",
      },
    ];

    mockedFetchMalla.mockResolvedValueOnce(mockMalla);
    mockedFetchAvance.mockResolvedValueOnce([]);

    const cursosIniciales = await getAvanceCurricular(mockCarrera);

    const proyeccionData = {
      "2025-1": [
        {
          ...cursosIniciales[0],
          status: [CursoStatus.INSCRITO],
        },
      ],
    };

    const mockProyeccionCreada = {
      id: 1,
      estudianteRut: mockUser.rut,
      carreraCodigo: mockCarrera.codigo,
      createdAt: new Date(),
      cursos: [],
    };

    (prisma.proyeccion.create as any).mockResolvedValueOnce(
      mockProyeccionCreada
    );

    const resultado = await guardarProyeccion(proyeccionData, cursosIniciales);
    expect(resultado.success).toBe(true);
    expect(prisma.proyeccion.create).toHaveBeenCalled();
  });

  it("RF-005: Almacenamiento de proyecciones", async () => {
    const mockCookies = {
      get: vi.fn((name: string) => {
        if (name === "token") return { value: "mock-token" };
        if (name === "user") return { value: JSON.stringify(mockUser) };
        return undefined;
      }),
      set: vi.fn(),
      delete: vi.fn(),
    };

    (await import("next/headers")).cookies = vi.fn(() => mockCookies as any);

    const mockMalla = [
      {
        codigo: "DCCB-00141",
        asignatura: "Cálculo I",
        creditos: 6,
        nivel: 1,
        prereq: "",
      },
    ];

    mockedFetchMalla.mockResolvedValueOnce(mockMalla);
    mockedFetchAvance.mockResolvedValueOnce([]);

    const cursosIniciales = await getAvanceCurricular(mockCarrera);

    const mockProyeccion = {
      id: 1,
      estudianteRut: mockUser.rut,
      carreraCodigo: mockCarrera.codigo,
      createdAt: new Date(),
      cursos: [],
    };

    (prisma.proyeccion.create as any).mockResolvedValueOnce(mockProyeccion);
    (prisma.proyeccion.findMany as any).mockResolvedValueOnce([mockProyeccion]);

    const proyeccionData = {
      "2025-1": [
        {
          ...cursosIniciales[0],
          status: [CursoStatus.INSCRITO],
        },
      ],
    };

    await guardarProyeccion(proyeccionData, cursosIniciales);

    const proyecciones = await fetchProyecciones();
    expect(proyecciones.length).toBeGreaterThan(0);
  });

  it("RF-006: Recuperación de proyecciones guardadas", async () => {
    const mockCookies = {
      get: vi.fn((name: string) => {
        if (name === "token") return { value: "mock-token" };
        if (name === "user") return { value: JSON.stringify(mockUser) };
        return undefined;
      }),
      set: vi.fn(),
      delete: vi.fn(),
    };

    (await import("next/headers")).cookies = vi.fn(() => mockCookies as any);

    const mockProyecciones = [
      {
        id: 1,
        estudianteRut: mockUser.rut,
        carreraCodigo: mockCarrera.codigo,
        createdAt: new Date(),
        cursos: [],
      },
      {
        id: 2,
        estudianteRut: mockUser.rut,
        carreraCodigo: mockCarrera.codigo,
        createdAt: new Date(),
        cursos: [],
      },
    ];

    (prisma.proyeccion.findMany as any).mockResolvedValueOnce(mockProyecciones);

    const proyecciones = await fetchProyecciones();
    expect(proyecciones.length).toBe(2);
  });

  it("RF-007: Selección de carrera", async () => {
    const mockCookies = {
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
    };

    (await import("next/headers")).cookies = vi.fn(() => mockCookies as any);

    await setUser({
      rut: mockUser.rut,
      carreras: mockUser.carreras,
      selectedCarrera: mockCarrera,
    });

    expect(mockCookies.set).toHaveBeenCalledWith(
      "user",
      expect.stringContaining(mockCarrera.codigo),
      expect.any(Object)
    );
  });

  it("RF-008: Validación de prerrequisitos", async () => {
    const mockMalla = [
      {
        codigo: "DCCB-00141",
        asignatura: "Cálculo I",
        creditos: 6,
        nivel: 1,
        prereq: "",
      },
      {
        codigo: "DCCB-00241",
        asignatura: "Cálculo II",
        creditos: 6,
        nivel: 2,
        prereq: "DCCB-00141",
      },
    ];

    mockedFetchMalla.mockResolvedValueOnce(mockMalla);
    mockedFetchAvance.mockResolvedValueOnce([]);

    const avance = await getAvanceCurricular(mockCarrera);
    const calculoII = avance.find((c) => c.codigo === "DCCB-00241");

    expect(calculoII).toBeDefined();
    expect(calculoII?.prerrequisitos).toBeDefined();
    expect(calculoII?.prerrequisitos.length).toBeGreaterThan(0);
  });
});
