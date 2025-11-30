import { ProyeccionProvider } from "@/src/contexts/ProyeccionContext";

export default function NuevaProyeccionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProyeccionProvider>{children}</ProyeccionProvider>;
}
