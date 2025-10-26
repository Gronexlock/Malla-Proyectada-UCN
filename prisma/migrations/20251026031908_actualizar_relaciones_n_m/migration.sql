/*
  Warnings:

  - You are about to drop the column `estudianteRut` on the `Carrera` table. All the data in the column will be lost.
  - You are about to drop the column `proyeccionSemestreId` on the `Curso` table. All the data in the column will be lost.
  - Made the column `proyeccionId` on table `ProyeccionSemestre` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Carrera" DROP CONSTRAINT "Carrera_estudianteRut_fkey";

-- DropForeignKey
ALTER TABLE "public"."Curso" DROP CONSTRAINT "Curso_proyeccionSemestreId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProyeccionSemestre" DROP CONSTRAINT "ProyeccionSemestre_proyeccionId_fkey";

-- AlterTable
ALTER TABLE "Carrera" DROP COLUMN "estudianteRut";

-- AlterTable
ALTER TABLE "Curso" DROP COLUMN "proyeccionSemestreId";

-- AlterTable
ALTER TABLE "ProyeccionSemestre" ALTER COLUMN "proyeccionId" SET NOT NULL;

-- CreateTable
CREATE TABLE "_CursoToProyeccionSemestre" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CursoToProyeccionSemestre_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CarreraToEstudiante" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CarreraToEstudiante_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CursoToProyeccionSemestre_B_index" ON "_CursoToProyeccionSemestre"("B");

-- CreateIndex
CREATE INDEX "_CarreraToEstudiante_B_index" ON "_CarreraToEstudiante"("B");

-- AddForeignKey
ALTER TABLE "ProyeccionSemestre" ADD CONSTRAINT "ProyeccionSemestre_proyeccionId_fkey" FOREIGN KEY ("proyeccionId") REFERENCES "Proyeccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CursoToProyeccionSemestre" ADD CONSTRAINT "_CursoToProyeccionSemestre_A_fkey" FOREIGN KEY ("A") REFERENCES "Curso"("codigo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CursoToProyeccionSemestre" ADD CONSTRAINT "_CursoToProyeccionSemestre_B_fkey" FOREIGN KEY ("B") REFERENCES "ProyeccionSemestre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CarreraToEstudiante" ADD CONSTRAINT "_CarreraToEstudiante_A_fkey" FOREIGN KEY ("A") REFERENCES "Carrera"("codigo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CarreraToEstudiante" ADD CONSTRAINT "_CarreraToEstudiante_B_fkey" FOREIGN KEY ("B") REFERENCES "Estudiante"("rut") ON DELETE CASCADE ON UPDATE CASCADE;
