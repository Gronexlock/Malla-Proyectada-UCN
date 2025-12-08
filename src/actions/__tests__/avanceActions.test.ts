import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchAvance } from "../avanceActions";

global.fetch = vi.fn();

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

describe("avanceActions", () => {
  const mockAvanceData = [
    {
      nrc: "12345",
      period: "2024-1",
      student: "12345678",
      course: "DCCB-00142",
      excluded: false,
      inscriptionType: "NORMAL",
      status: "APROBADO",
    },
    {
      nrc: "12346",
      period: "2024-1",
      student: "12345678",
      course: "DCCB-00141",
      excluded: false,
      inscriptionType: "NORMAL",
      status: "INSCRITO",
    },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("fetchAvance", () => {
    it("debe retornar el avance cuando la respuesta es exitosa", async () => {
      (fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockAvanceData,
      });

      const result = await fetchAvance();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[0].nrc).toBe("12345");
      expect(result[0].status).toBe("APROBADO");
    });

    it("debe retornar array vacío cuando no hay carrera seleccionada", async () => {
      const { getUser } = await import("../cookiesActions");
      (getUser as any).mockResolvedValue({
        selectedCarrera: null,
      });

      const result = await fetchAvance();

      expect(result).toEqual([]);
    });

    it("debe retornar array vacío cuando la API falla", async () => {
      (fetch as any).mockResolvedValue({
        ok: false,
        statusText: "Internal Server Error",
      });

      const result = await fetchAvance();

      expect(result).toEqual([]);
    });

    it("debe retornar array vacío cuando no se encuentra avance", async () => {
      (fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ error: "Not found" }),
      });

      const result = await fetchAvance();

      expect(result).toEqual([]);
    });

    it("debe retornar array vacío cuando los datos no cumplen el schema", async () => {
      (fetch as any).mockResolvedValue({
        ok: true,
        json: async () => [
          {
            nrc: "12345",
            period: "2024-1",
            student: "12345678",
            course: "DCCB-00142",
            excluded: false,
            inscriptionType: "NORMAL",
            status: "ESTADO_INVALIDO",
          },
        ],
      });

      const result = await fetchAvance();

      expect(result).toEqual([]);
    });

    it("debe retornar array vacío cuando la carrera no pertenece al usuario", async () => {
      const { verifyToken } = await import("../authActions");
      (verifyToken as any).mockResolvedValue({
        rut: "12345678",
        carreras: [
          {
            codigo: "OTRA-CARRERA",
            nombre: "Otra Carrera",
            catalogo: "2020",
          },
        ],
      });

      const result = await fetchAvance();

      expect(result).toEqual([]);
    });

    it("debe hacer fetch con la URL correcta", async () => {
      (fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockAvanceData,
      });

      await fetchAvance();

      expect(fetch).toHaveBeenCalledWith(
        "https://puclaro.ucn.cl/eross/avance/avance.php?rut=12345678&codcarrera=ICI-2019"
      );
    });
  });
});
