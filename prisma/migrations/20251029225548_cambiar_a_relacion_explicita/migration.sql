/*
  Warnings:

  - You are about to drop the `_CursoToProyeccion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_CursoToProyeccion" DROP CONSTRAINT "_CursoToProyeccion_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_CursoToProyeccion" DROP CONSTRAINT "_CursoToProyeccion_B_fkey";

-- DropTable
DROP TABLE "public"."_CursoToProyeccion";

-- CreateTable
CREATE TABLE "ProyeccionOnCurso" (
    "cursoCodigo" TEXT NOT NULL,
    "proyeccionId" INTEGER NOT NULL,
    "semestre" TEXT NOT NULL,

    CONSTRAINT "ProyeccionOnCurso_pkey" PRIMARY KEY ("cursoCodigo","proyeccionId")
);

-- AddForeignKey
ALTER TABLE "ProyeccionOnCurso" ADD CONSTRAINT "ProyeccionOnCurso_cursoCodigo_fkey" FOREIGN KEY ("cursoCodigo") REFERENCES "Curso"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProyeccionOnCurso" ADD CONSTRAINT "ProyeccionOnCurso_proyeccionId_fkey" FOREIGN KEY ("proyeccionId") REFERENCES "Proyeccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
