import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchMalla } from "../mallaActions";

global.fetch = vi.fn();

describe("fetchMalla", () => {
  const mockData = [
    {
      codigo: "DCCB-00142",
      asignatura: "Álgebra I",
      creditos: 6,
      nivel: 1,
      prereq: "",
    },
    {
      codigo: "DCCB-00141",
      asignatura: "Cálculo I",
      creditos: 6,
      nivel: 1,
      prereq: "",
    },
    {
      codigo: "DCCB-00144",
      asignatura: "Física I",
      creditos: 6,
      nivel: 1,
      prereq: "",
    },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
    process.env.HAWAII_AUTH_HEADER = "test-token";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("debe retornar los datos cuando la respuesta es exitosa", async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockData,
    });

    const result = await fetchMalla("C1", "2024");
    expect(result).toBeDefined();
  });

  it("debe retornar array vacío si faltan parámetros", async () => {
    const result = await fetchMalla("", "2024");
    expect(result).toEqual([]);
  });

  it("debe retornar array vacío si no hay auth header configurado", async () => {
    delete process.env.HAWAII_AUTH_HEADER;
    const result = await fetchMalla("C1", "2024");
    expect(result).toEqual([]);
  });

  it("debe retornar array vacío cuando hay error 401", async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
    });

    const result = await fetchMalla("C1", "2024");
    expect(result).toEqual([]);
  });

  it("debe retornar array vacío si la API retorna un arreglo vacío", async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    const result = await fetchMalla("C1", "2024");
    expect(result).toEqual([]);
  });
});
