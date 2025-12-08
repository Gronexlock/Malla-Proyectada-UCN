"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CornerDownLeft,
  Layers,
  Lock,
  MousePointerClick,
  XCircle,
} from "lucide-react";
import { useState } from "react";

interface TutorialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const tutorialSteps = [
  {
    title: (
      <span>
        Bienvenido a{" "}
        <span className="bg-gradient-to-r from-zinc-500 to-zinc-800 dark:from-zinc-500 dark:to-zinc-200 bg-clip-text text-transparent font-mono">
          PICHIDANGUI
        </span>
      </span>
    ),
    description:
      "Este tutorial te guiará paso a paso para crear tu proyección curricular personalizada.",
    icon: Layers,
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          La proyección curricular te permite planificar los cursos que tomarás
          en los próximos semestres hasta completar tu carrera.
        </p>
        <div className="rounded-lg bg-muted/50 p-4">
          <h4 className="font-medium mb-2">
            La interfaz se divide en 3 secciones:
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              • <strong>Izquierda:</strong> Tu avance curricular actual
            </li>
            <li>
              • <strong>Derecha:</strong> Vista previa de tu proyección
            </li>
            <li>
              • <strong>Abajo:</strong> Panel de edición de la proyección
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: "Entendiendo el Avance Curricular",
    description:
      "Los cursos están organizados por niveles y coloreados según su estado.",
    icon: Calendar,
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Cada columna representa un nivel de tu carrera y los cursos tienen
          colores según su estado:
        </p>
        <div className="grid gap-3">
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-500/50">
              <CheckCircle2 className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-sm">Aprobado</p>
              <p className="text-xs text-muted-foreground">
                Cursos que ya aprobaste
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-red-500/50">
              <XCircle className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-sm">Reprobado</p>
              <p className="text-xs text-muted-foreground">
                Cursos que debes repetir
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-500/50">
              <Clock className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-sm">Pendiente</p>
              <p className="text-xs text-muted-foreground">
                Cursos disponibles para tomar
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-orange-500/50">
              <Lock className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-sm">Bloqueado</p>
              <p className="text-xs text-muted-foreground">
                Cursos no disponibles por prerrequisitos o dispersión
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Seleccionar Cursos",
    description:
      "Haz clic en los cursos pendientes para agregarlos a tu proyección.",
    icon: MousePointerClick,
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Para agregar cursos a tu proyección:
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
              1
            </div>
            <p className="text-sm">
              Haz clic en cualquier curso{" "}
              <strong className="text-blue-500/80">azul (pendiente)</strong> del
              avance curricular
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
              2
            </div>
            <p className="text-sm">
              El curso aparecerá en el panel inferior de edición
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
              3
            </div>
            <p className="text-sm">
              Asegúrate de no sobrepasar el límite de créditos por semestre
            </p>
          </div>
        </div>
        <div className="rounded-lg bg-amber-50 dark:bg-orange-500/20 border border-orange-200 dark:border-orange-500/50 p-3">
          <p className="text-sm text-amber-800 dark:text-amber-300/80">
            <strong>Tip:</strong> Pasa el cursor sobre cursos bloqueados
            (naranja) para ver qué prerrequisitos necesitas aprobar.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Avanzar al Siguiente Semestre",
    description:
      "Confirma los cursos seleccionados y añádelos al semestre correspondiente.",
    icon: CheckCircle2,
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Una vez que hayas seleccionado los cursos deseados:
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
              1
            </div>
            <p className="text-sm">
              Haz clic en <strong>Siguiente Semestre</strong>
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
              2
            </div>
            <p className="text-sm">
              Los cursos seleccionados aparecerán en la columna correspondiente
              en el panel derecho
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
              3
            </div>
            <p className="text-sm">
              Vuelve a repetir el proceso para los siguientes semestres hasta
              completar tu carrera
            </p>
          </div>
        </div>
        <div className="rounded-lg bg-amber-50 dark:bg-orange-500/20 border border-orange-200 dark:border-orange-500/50 p-3">
          <p className="text-sm text-amber-800 dark:text-amber-300/80">
            <strong>Tip:</strong> ¿Necesitas tomar algún ramo que no puedes o
            sobrepasar el límite de créditos? Usa la opción{" "}
            <strong>Ignorar Restricciones</strong> en el panel de edición.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Retrocedera a Semestres Anteriores",
    description:
      "Puedes regresar a semestres previos para ajustar tu proyección.",
    icon: CornerDownLeft,
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Si necesitas modificar cursos en semestres anteriores:
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
              1
            </div>
            <p className="text-sm">
              Haz clic en el semestre deseado en el selector de semestres
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
              2
            </div>
            <p className="text-sm">
              Todos los cursos seleccionados para ese semestre aparecerán en el
              panel de edición
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
              3
            </div>
            <p className="text-sm">
              Los cursos proyectados para semestres posteriores al semestre
              seleccionado se eliminarán automáticamente
            </p>
          </div>
        </div>
        <div className="rounded-lg bg-amber-50 dark:bg-purple-500/20 border border-orange-200 dark:border-purple-500/50 p-3">
          <p className="text-sm text-amber-800 dark:text-purple-300/80">
            <strong>Tip:</strong> Haz clic en <strong>Proyección Óptima</strong>{" "}
            para generar automáticamente una proyección ideal basada en tu
            avance curricular.
          </p>
        </div>
      </div>
    ),
  },
];

export function TutorialDialog({ open, onOpenChange }: TutorialDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onOpenChange(false);
      setCurrentStep(0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setCurrentStep(0);
  };

  const step = tutorialSteps[currentStep];
  const Icon = step.icon;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="space-y-1">
              <DialogTitle>{step.title}</DialogTitle>
              <DialogDescription>{step.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">{step.content}</div>

        {/* Progress indicators */}
        <div className="flex items-center justify-center gap-1.5 py-2">
          {tutorialSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? "w-6 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            Saltar tutorial
          </Button>
          <Button size="sm" onClick={handleNext} className="gap-1">
            {currentStep === tutorialSteps.length - 1
              ? "Finalizar"
              : "Siguiente"}
            {currentStep < tutorialSteps.length - 1 && (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
