import * as jose from "jose";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { login, logout, verifyToken } from "../authActions";

global.fetch = vi.fn();
vi.mock("next/headers", () => ({
  cookies: vi.fn(() =>
    Promise.resolve({
      set: vi.fn(),
      get: vi.fn(),
      has: vi.fn(),
    })
  ),
}));

vi.mock("../cookiesActions", () => ({
  setUser: vi.fn(),
  getUser: vi.fn(),
}));

describe("authActions", () => {
  const mockUserData = {
    rut: "12345678",
    carreras: [
      {
        codigo: "ICI-2019",
        nombre: "Ingeniería Civil Informática",
        catalogo: "2019",
      },
    ],
  };

  beforeEach(() => {
    vi.resetAllMocks();
    process.env.JWT_SECRET = "test-secret-key";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("login", () => {
    it("debe retornar éxito cuando las credenciales son válidas", async () => {
      (fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockUserData,
      });

      const result = await login("test@ucn.cl", "password123");

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.rut).toBe("12345678");
    });

    it("debe retornar error cuando las credenciales son inválidas", async () => {
      (fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ error: "Invalid credentials" }),
      });

      const result = await login("test@ucn.cl", "wrongpassword");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Credenciales inválidas");
    });

    it("debe lanzar error cuando falla la solicitud", async () => {
      (fetch as any).mockResolvedValue({
        ok: false,
        statusText: "Internal Server Error",
      });

      await expect(login("test@ucn.cl", "password123")).rejects.toThrow(
        "Error en la solicitud de login"
      );
    });

    it("debe lanzar error cuando los datos no cumplen el schema", async () => {
      (fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({
          rut: "123",
          carreras: [],
        }),
      });

      await expect(login("test@ucn.cl", "password123")).rejects.toThrow(
        "Los datos recibidos no cumplen con el esquema esperado"
      );
    });

    it("debe llamar a fetch con la URL correcta", async () => {
      (fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockUserData,
      });

      await login("test@ucn.cl", "password123");

      expect(fetch).toHaveBeenCalledWith(
        "https://puclaro.ucn.cl/eross/avance/login.php?email=test@ucn.cl&password=password123"
      );
    });
  });

  describe("logout", () => {
    it("debe limpiar todas las cookies al hacer logout", async () => {
      const { cookies } = await import("next/headers");
      const mockCookies = {
        set: vi.fn(),
      };
      (cookies as any).mockResolvedValue(mockCookies);

      await logout();

      expect(mockCookies.set).toHaveBeenCalledWith(
        "token",
        "",
        expect.any(Object)
      );
      expect(mockCookies.set).toHaveBeenCalledWith(
        "user",
        "",
        expect.any(Object)
      );
      expect(mockCookies.set).toHaveBeenCalledWith(
        "tutorial-seen",
        "",
        expect.any(Object)
      );
    });
  });

  describe("verifyToken", () => {
    it("debe retornar el usuario cuando el token es válido", async () => {
      const token = await new jose.SignJWT({ user: mockUserData })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1h")
        .sign(new TextEncoder().encode("test-secret-key"));

      const result = await verifyToken(token);

      expect(result).toBeDefined();
      expect(result.rut).toBe("12345678");
    });

    it("debe lanzar error cuando no hay token", async () => {
      await expect(verifyToken(undefined)).rejects.toThrow("No autenticado");
    });

    it("debe lanzar error cuando el token es inválido", async () => {
      await expect(verifyToken("token-invalido")).rejects.toThrow(
        "Token inválido"
      );
    });

    it("debe lanzar error cuando el token está expirado", async () => {
      const expiredToken = await new jose.SignJWT({ user: mockUserData })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("0s")
        .sign(new TextEncoder().encode("test-secret-key"));

      await new Promise((resolve) => setTimeout(resolve, 100));

      await expect(verifyToken(expiredToken)).rejects.toThrow("Token inválido");
    });
  });
});
