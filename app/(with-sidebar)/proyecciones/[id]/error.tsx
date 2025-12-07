"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full">
            <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Algo salió mal</h1>
          <p className="text-muted-foreground">
            Ocurrió un error al cargar la proyección. Por favor, intenta de
            nuevo.
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Button onClick={reset} variant="default">
            Intentar de nuevo
          </Button>
          <Link href="/proyecciones">
            <Button variant="outline">Volver a proyecciones</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
