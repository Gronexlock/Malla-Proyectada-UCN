/*
  Warnings:

  - You are about to drop the column `asignatura` on the `Curso` table. All the data in the column will be lost.
  - You are about to drop the column `creditos` on the `Curso` table. All the data in the column will be lost.
  - You are about to drop the column `semestre` on the `Curso` table. All the data in the column will be lost.
  - You are about to drop the `Carrera` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Estudiante` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CarreraToEstudiante` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Proyeccion" DROP CONSTRAINT "Proyeccion_carreraCodigo_fkey";

-- DropForeignKey
ALTER TABLE "public"."Proyeccion" DROP CONSTRAINT "Proyeccion_estudianteRut_fkey";

-- DropForeignKey
ALTER TABLE "public"."_CarreraToEstudiante" DROP CONSTRAINT "_CarreraToEstudiante_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_CarreraToEstudiante" DROP CONSTRAINT "_CarreraToEstudiante_B_fkey";

-- AlterTable
ALTER TABLE "Curso" DROP COLUMN "asignatura",
DROP COLUMN "creditos",
DROP COLUMN "semestre";

-- DropTable
DROP TABLE "public"."Carrera";

-- DropTable
DROP TABLE "public"."Estudiante";

-- DropTable
DROP TABLE "public"."_CarreraToEstudiante";
