import { Curso, CursoStatus } from "@/src/types/curso";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  eliminarProyeccion,
  fetchProyeccionById,
  fetchProyecciones,
  guardarProyeccion,
} from "../proyeccionActions";

vi.mock("next/headers", () => ({
  cookies: vi.fn(() =>
    Promise.resolve({
      get: vi.fn((key: string) => {
        if (key === "token") return { value: "mock-token" };
        return undefined;
      }),
    })
  ),
}));

vi.mock("../authActions", () => ({
  verifyToken: vi.fn(() =>
    Promise.resolve({
      rut: "12345678",
      carreras: [
        {
          codigo: "ICI-2019",
          nombre: "Ingeniería Civil Informática",
          catalogo: "2019",
        },
      ],
    })
  ),
}));

vi.mock("../cookiesActions", () => ({
  getUser: vi.fn(() =>
    Promise.resolve({
      selectedCarrera: {
        codigo: "ICI-2019",
        nombre: "Ingeniería Civil Informática",
        catalogo: "2019",
      },
    })
  ),
}));

vi.mock("@/src/lib/prisma", () => ({
  default: {
    proyeccion: {
      findMany: vi.fn(),
      create: vi.fn(),
      deleteMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/src/utils/proyeccionUtils", () => ({
  comprobarProyeccionValida: vi.fn(() => true),
}));

describe("proyeccionActions", () => {
  const mockCurso: Curso = {
    codigo: "DCCB-00142",
    asignatura: "Álgebra I",
    creditos: 6,
    nivel: 1,
    prerrequisitos: [],
    nrc: "",
    periodo: "2023-1",
    status: [CursoStatus.PENDIENTE],
  };

  const mockProyeccionData = {
    id: 1,
    estudianteRut: "12345678",
    carreraCodigo: "ICI-2019",
    fechaCreacion: new Date(),
    cursos: [
      {
        id: 1,
        proyeccionId: 1,
        cursoCodigo: "DCCB-00142",
        semestre: "2025-1",
      },
    ],
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("fetchProyecciones", () => {
    it("debe retornar proyecciones cuando existen datos", async () => {
      const prisma = (await import("@/src/lib/prisma")).default;
      (prisma.proyeccion.findMany as any).mockResolvedValue([
        mockProyeccionData,
      ]);

      const result = await fetchProyecciones(1, 10);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
      expect(result[0].estudianteRut).toBe("12345678");
    });

    it("debe manejar correctamente la paginación", async () => {
      const prisma = (await import("@/src/lib/prisma")).default;
      (prisma.proyeccion.findMany as any).mockResolvedValue([]);

      await fetchProyecciones(2, 5);

      expect(prisma.proyeccion.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 5,
          take: 5,
        })
      );
    });

    it("debe retornar array vacío cuando no hay carrera seleccionada", async () => {
      const { getUser } = await import("../cookiesActions");
      (getUser as any).mockResolvedValue({
        selectedCarrera: null,
      });

      const result = await fetchProyecciones();

      expect(result).toEqual([]);
    });

    // I.A.3 Fronteras: Error de base de datos
    it("debe retornar array vacío cuando hay error en BD", async () => {
      const prisma = (await import("@/src/lib/prisma")).default;
      (prisma.proyeccion.findMany as any).mockRejectedValue(
        new Error("Database error")
      );

      const result = await fetchProyecciones();

      expect(result).toEqual([]);
    });
  });

  describe("guardarProyeccion", () => {
    const mockProyeccion = {
      "2025-1": [mockCurso],
      "2025-2": [mockCurso],
    };

    const mockCursosIniciales = [mockCurso];

    it("debe guardar una proyección válida", async () => {
      const prisma = (await import("@/src/lib/prisma")).default;
      (prisma.proyeccion.create as any).mockResolvedValue(mockProyeccionData);

      const result = await guardarProyeccion(
        mockProyeccion,
        mockCursosIniciales
      );

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(prisma.proyeccion.create).toHaveBeenCalled();
    });

    it("debe lanzar error cuando la proyección está vacía", async () => {
      await expect(guardarProyeccion({}, mockCursosIniciales)).rejects.toThrow(
        "Error al guardar la proyección"
      );
    });

    it("debe lanzar error cuando la proyección no es válida", async () => {
      const { comprobarProyeccionValida } = await import(
        "@/src/utils/proyeccionUtils"
      );
      (comprobarProyeccionValida as any).mockReturnValue(false);

      await expect(
        guardarProyeccion(mockProyeccion, mockCursosIniciales)
      ).rejects.toThrow("Error al guardar la proyección");
    });

    it("debe lanzar error cuando no hay carrera seleccionada", async () => {
      const { getUser } = await import("../cookiesActions");
      (getUser as any).mockResolvedValue({
        selectedCarrera: null,
      });

      await expect(
        guardarProyeccion(mockProyeccion, mockCursosIniciales)
      ).rejects.toThrow();
    });

    it("debe lanzar error cuando falla la operación en BD", async () => {
      const prisma = (await import("@/src/lib/prisma")).default;
      (prisma.proyeccion.create as any).mockRejectedValue(
        new Error("Database error")
      );

      await expect(
        guardarProyeccion(mockProyeccion, mockCursosIniciales)
      ).rejects.toThrow("Error al guardar la proyección");
    });
  });

  describe("eliminarProyeccion", () => {
    it("debe eliminar una proyección correctamente", async () => {
      const prisma = (await import("@/src/lib/prisma")).default;
      (prisma.proyeccion.deleteMany as any).mockResolvedValue({ count: 1 });

      const result = await eliminarProyeccion(1);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Proyección eliminada correctamente");
      expect(prisma.proyeccion.deleteMany).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("debe manejar ID de proyección inexistente", async () => {
      const prisma = (await import("@/src/lib/prisma")).default;
      (prisma.proyeccion.deleteMany as any).mockResolvedValue({ count: 0 });

      const result = await eliminarProyeccion(9999);

      expect(result.success).toBe(true);
    });

    it("debe lanzar error cuando falla la operación en BD", async () => {
      const prisma = (await import("@/src/lib/prisma")).default;
      (prisma.proyeccion.deleteMany as any).mockRejectedValue(
        new Error("Database error")
      );

      await expect(eliminarProyeccion(1)).rejects.toThrow(
        "Error al eliminar la proyección"
      );
    });
  });

  describe("fetchProyeccionById", () => {
    it("debe retornar una proyección cuando existe", async () => {
      const prisma = (await import("@/src/lib/prisma")).default;
      (prisma.proyeccion.findUnique as any).mockResolvedValue(
        mockProyeccionData
      );

      const result = await fetchProyeccionById(1);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.estudianteRut).toBe("12345678");
    });

    it("debe lanzar error cuando la proyección no existe", async () => {
      const prisma = (await import("@/src/lib/prisma")).default;
      (prisma.proyeccion.findUnique as any).mockResolvedValue(null);

      await expect(fetchProyeccionById(9999)).rejects.toThrow(
        "Error al obtener la proyección"
      );
    });

    it("debe lanzar error cuando la proyección no pertenece al usuario", async () => {
      const prisma = (await import("@/src/lib/prisma")).default;
      (prisma.proyeccion.findUnique as any).mockResolvedValue({
        ...mockProyeccionData,
        estudianteRut: "87654321",
      });

      await expect(fetchProyeccionById(1)).rejects.toThrow(
        "Error al obtener la proyección"
      );
    });

    it("debe lanzar error cuando falla la operación en BD", async () => {
      const prisma = (await import("@/src/lib/prisma")).default;
      (prisma.proyeccion.findUnique as any).mockRejectedValue(
        new Error("Database error")
      );

      await expect(fetchProyeccionById(1)).rejects.toThrow(
        "Error al obtener la proyección"
      );
    });
  });
});
