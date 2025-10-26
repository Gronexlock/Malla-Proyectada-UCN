import prisma from "@/src/lib/prisma";

export async function GET() {
  try {
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
    const cursos = data.flat().map((curso) => {
      return { codigo: curso.codigo };
    });

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
