-- DropForeignKey
ALTER TABLE "public"."ProyeccionOnCurso" DROP CONSTRAINT "ProyeccionOnCurso_proyeccionId_fkey";

-- AddForeignKey
ALTER TABLE "ProyeccionOnCurso" ADD CONSTRAINT "ProyeccionOnCurso_proyeccionId_fkey" FOREIGN KEY ("proyeccionId") REFERENCES "Proyeccion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
