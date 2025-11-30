/*
  Warnings:

  - You are about to drop the `ProyeccionSemestre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProyeccionTotal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CursoToProyeccionSemestre` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ProyeccionSemestre" DROP CONSTRAINT "ProyeccionSemestre_proyeccionTotalId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_CursoToProyeccionSemestre" DROP CONSTRAINT "_CursoToProyeccionSemestre_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_CursoToProyeccionSemestre" DROP CONSTRAINT "_CursoToProyeccionSemestre_B_fkey";

-- DropTable
DROP TABLE "public"."ProyeccionSemestre";

-- DropTable
DROP TABLE "public"."ProyeccionTotal";

-- DropTable
DROP TABLE "public"."_CursoToProyeccionSemestre";

-- CreateTable
CREATE TABLE "Proyeccion" (
    "id" SERIAL NOT NULL,
    "estudianteRut" TEXT NOT NULL,
    "carreraCodigo" TEXT NOT NULL,

    CONSTRAINT "Proyeccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CursoToProyeccion" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CursoToProyeccion_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CursoToProyeccion_B_index" ON "_CursoToProyeccion"("B");

-- AddForeignKey
ALTER TABLE "_CursoToProyeccion" ADD CONSTRAINT "_CursoToProyeccion_A_fkey" FOREIGN KEY ("A") REFERENCES "Curso"("codigo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CursoToProyeccion" ADD CONSTRAINT "_CursoToProyeccion_B_fkey" FOREIGN KEY ("B") REFERENCES "Proyeccion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
