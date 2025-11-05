/*
  Warnings:

  - You are about to drop the column `proyeccionId` on the `ProyeccionSemestre` table. All the data in the column will be lost.
  - You are about to drop the `Proyeccion` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `proyeccionTotalId` to the `ProyeccionSemestre` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ProyeccionSemestre" DROP CONSTRAINT "ProyeccionSemestre_proyeccionId_fkey";

-- AlterTable
ALTER TABLE "ProyeccionSemestre" DROP COLUMN "proyeccionId",
ADD COLUMN     "proyeccionTotalId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."Proyeccion";

-- CreateTable
CREATE TABLE "ProyeccionTotal" (
    "id" SERIAL NOT NULL,
    "estudianteRut" TEXT NOT NULL,
    "carreraCodigo" TEXT NOT NULL,

    CONSTRAINT "ProyeccionTotal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProyeccionSemestre" ADD CONSTRAINT "ProyeccionSemestre_proyeccionTotalId_fkey" FOREIGN KEY ("proyeccionTotalId") REFERENCES "ProyeccionTotal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
