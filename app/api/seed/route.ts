// ! Solo para desarrollo / debugging
import prisma from "@/src/lib/prisma";
import { requireAuth } from "@/lib/apiAuth"; // 🔒 Autenticación

export async function GET(req: Request) {
  // Verificar autenticación
  const session = await requireAuth(req);
  if ("error" in session) return session;

  try {
    // ⚠️ Quita este return si quieres ejecutar realmente la siembra
    // return new Response("Desactivado en producción", { status: 403 });

    const [res1, res2, res3] = await Promise.all([
      fetch(`https://losvilos.ucn.cl/hawaii/api/mallas?8606-202320`, {
        headers: {
          "X-HAWAII-AUTH": process.env.HAWAII_AUTH_KEY ?? "",
        },
      }),
      fetch(`https://losvilos.ucn.cl/hawaii/api/mallas?8616-202310`, {
        headers: {
          "X-HAWAII-AUTH": process.env.HAWAII_AUTH_KEY ?? "",
        },
      }),
      fetch(`https://losvilos.ucn.cl/hawaii/api/mallas?8266-202410`, {
        headers: {
          "X-HAWAII-AUTH": process.env.HAWAII_AUTH_KEY ?? "",
        },
      }),
    ]);

    const data = await Promise.all([res1.json(), res2.json(), res3.json()]);
    const cursos = data.flat().map((curso: any) => ({
      codigo: curso.codigo,
    }));

    await prisma.curso.createMany({
      data: cursos,
      skipDuplicates: true,
    });

    console.log("Cursos sembrados correctamente");
    return new Response("Cursos sembrados correctamente", { status: 200 });
  } catch (error) {
    console.error("Error sembrando cursos:", error);
    return new Response("Error sembrando cursos", { status: 500 });
  }
}
