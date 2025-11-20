import { nombresCompletos } from "@/src/constants/carreras";
import { Proyeccion } from "@/src/types/proyeccion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type ProyeccionDetailProps = {
  proyeccion: Proyeccion;
};

export function ProyeccionDetail({ proyeccion }: ProyeccionDetailProps) {
  const totalCreditos = proyeccion.semestres.reduce(
    (total, semestre) =>
      total +
      semestre.cursos.reduce((total, curso) => total + curso.creditos, 0),
    0
  );
  const totalCursos = proyeccion.semestres.reduce(
    (total, semestre) => total + semestre.cursos.length,
    0
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {nombresCompletos[proyeccion.carrera]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total de Cursos</p>
              <p className="text-2xl font-bold text-foreground">
                {totalCursos}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Créditos</p>
              <p className="text-2xl font-bold text-foreground">
                {totalCreditos}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {proyeccion.semestres.map((semester, idx) => (
          <Card key={idx}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{semester.semestre}</CardTitle>
                <span className="text-sm text-muted-foreground">
                  {semester.cursos.length} curso
                  {semester.cursos.length !== 1 ? "s" : ""}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {semester.cursos.map((curso, cursoIdx) => (
                  <div
                    key={cursoIdx}
                    className="flex justify-between items-center p-3 bg-muted rounded-md"
                  >
                    <span className="font-medium text-foreground">
                      {curso.asignatura}
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {curso.creditos} cred.
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Créditos del semestre:{" "}
                  <span className="font-bold text-foreground">
                    {semester.cursos.reduce((sum, c) => sum + c.creditos, 0)}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
