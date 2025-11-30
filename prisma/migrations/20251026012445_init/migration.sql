-- CreateTable
CREATE TABLE "Curso" (
    "codigo" TEXT NOT NULL,
    "asignatura" TEXT NOT NULL,
    "creditos" INTEGER NOT NULL,
    "semestre" TEXT NOT NULL,
    "proyeccionSemestreId" INTEGER,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("codigo")
);

-- CreateTable
CREATE TABLE "ProyeccionSemestre" (
    "id" SERIAL NOT NULL,
    "semestre" TEXT NOT NULL,
    "proyeccionId" INTEGER,

    CONSTRAINT "ProyeccionSemestre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proyeccion" (
    "id" SERIAL NOT NULL,
    "estudianteRut" TEXT NOT NULL,
    "carreraCodigo" TEXT NOT NULL,

    CONSTRAINT "Proyeccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Carrera" (
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "catalogo" TEXT NOT NULL,
    "estudianteRut" TEXT,

    CONSTRAINT "Carrera_pkey" PRIMARY KEY ("codigo")
);

-- CreateTable
CREATE TABLE "Estudiante" (
    "rut" TEXT NOT NULL,

    CONSTRAINT "Estudiante_pkey" PRIMARY KEY ("rut")
);

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_proyeccionSemestreId_fkey" FOREIGN KEY ("proyeccionSemestreId") REFERENCES "ProyeccionSemestre"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProyeccionSemestre" ADD CONSTRAINT "ProyeccionSemestre_proyeccionId_fkey" FOREIGN KEY ("proyeccionId") REFERENCES "Proyeccion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proyeccion" ADD CONSTRAINT "Proyeccion_estudianteRut_fkey" FOREIGN KEY ("estudianteRut") REFERENCES "Estudiante"("rut") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proyeccion" ADD CONSTRAINT "Proyeccion_carreraCodigo_fkey" FOREIGN KEY ("carreraCodigo") REFERENCES "Carrera"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carrera" ADD CONSTRAINT "Carrera_estudianteRut_fkey" FOREIGN KEY ("estudianteRut") REFERENCES "Estudiante"("rut") ON DELETE SET NULL ON UPDATE CASCADE;
