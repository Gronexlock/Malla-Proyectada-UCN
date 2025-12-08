import { User } from "@/src/schemas/userSchema";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getUser,
  hasSeenTutorial,
  setSeenTutorial,
  setSelectedCarrera,
  setUser,
} from "../cookiesActions";

let mockCookies: any;

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookies)),
}));

describe("cookiesActions", () => {
  const mockUser: User = {
    rut: "12345678",
    carreras: [
      {
        codigo: "ICI-2019",
        nombre: "Ingeniería Civil Informática",
        catalogo: "2019",
      },
      {
        codigo: "ICI-2020",
        nombre: "Ingeniería Civil Informática",
        catalogo: "2020",
      },
    ],
    selectedCarrera: {
      codigo: "ICI-2019",
      nombre: "Ingeniería Civil Informática",
      catalogo: "2019",
    },
  };

  beforeEach(() => {
    vi.resetAllMocks();

    mockCookies = {
      set: vi.fn(),
      get: vi.fn(),
      has: vi.fn(),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("setUser", () => {
    it("debe guardar el usuario en cookies cuando es válido", async () => {
      await setUser(mockUser);

      expect(mockCookies.set).toHaveBeenCalledWith(
        "user",
        JSON.stringify(mockUser),
        expect.objectContaining({
          path: "/",
          httpOnly: true,
        })
      );
    });

    it("debe lanzar error cuando el usuario no cumple el schema", async () => {
      const invalidUser = {
        rut: "123",
        carreras: [],
      } as any;

      await expect(setUser(invalidUser)).rejects.toThrow(
        "El usuario no cumple con el esquema esperado"
      );
    });

    it("debe lanzar error cuando el usuario no tiene carreras", async () => {
      const userSinCarreras = {
        rut: "12345678",
        carreras: [],
      } as any;

      await expect(setUser(userSinCarreras)).rejects.toThrow(
        "El usuario no cumple con el esquema esperado"
      );
    });
  });

  describe("getUser", () => {
    it("debe retornar el usuario cuando existe la cookie", async () => {
      mockCookies.get.mockReturnValue({ value: JSON.stringify(mockUser) });

      const result = await getUser();

      expect(result).toEqual(mockUser);
      expect(result.rut).toBe("12345678");
    });

    it("debe lanzar error cuando no existe la cookie", async () => {
      mockCookies.get.mockReturnValue(undefined);

      await expect(getUser()).rejects.toThrow(
        "No se encontró la cookie de usuario"
      );
    });
  });

  describe("setSelectedCarrera", () => {
    it("debe actualizar la carrera seleccionada cuando es válida", async () => {
      mockCookies.get.mockReturnValue({ value: JSON.stringify(mockUser) });

      const result = await setSelectedCarrera("ICI-2020");

      expect(result.success).toBe(true);
      expect(result.carrera?.codigo).toBe("ICI-2020");
    });

    it("debe retornar error cuando la carrera no existe", async () => {
      mockCookies.get.mockReturnValue({ value: JSON.stringify(mockUser) });

      const result = await setSelectedCarrera("CARRERA-INEXISTENTE");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Carrera no encontrada");
    });

    it("debe retornar error cuando no hay usuario en cookie", async () => {
      mockCookies.get.mockReturnValue(undefined);

      const result = await setSelectedCarrera("ICI-2019");

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("hasSeenTutorial", () => {
    it("debe retornar true cuando existe la cookie", async () => {
      mockCookies.has.mockReturnValue(true);

      const result = await hasSeenTutorial();

      expect(result).toBe(true);
    });

    it("debe retornar false cuando no existe la cookie", async () => {
      mockCookies.has.mockReturnValue(false);

      const result = await hasSeenTutorial();

      expect(result).toBe(false);
    });
  });

  describe("setSeenTutorial", () => {
    it("debe crear la cookie de tutorial visto", async () => {
      await setSeenTutorial();

      expect(mockCookies.set).toHaveBeenCalledWith(
        "seenTutorial",
        "true",
        expect.objectContaining({
          path: "/",
          httpOnly: true,
        })
      );
    });
  });
});
