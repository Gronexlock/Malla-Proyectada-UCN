import { getUser } from "@/src/actions/cookiesActions";
import { ProyeccionProvider } from "@/src/contexts/ProyeccionContext";
import { getAvanceAgrupado } from "@/src/utils/cursosUtils";
import { aprobarCursosInscritos } from "@/src/utils/proyeccionUtils";

export default async function NuevaProyeccionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { selectedCarrera } = await getUser();
  const cursos = aprobarCursosInscritos(
    await getAvanceAgrupado(selectedCarrera)
  );

  return (
    <ProyeccionProvider cursosIniciales={cursos}>{children}</ProyeccionProvider>
  );
}
