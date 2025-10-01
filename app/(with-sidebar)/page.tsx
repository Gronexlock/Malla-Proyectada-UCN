"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import CarreraSelect from "@/components/carrera-select";
import { useUserStore } from "@/src/store/useUserStore";

export default function HomePage() {
  const { selectedCarrera } = useUserStore();

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen p-6 gap-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Bienvenido al sistema
        </h1>
        <Link href="/test">
          <Button>Ver información del usuario</Button>
        </Link>
      </div>
    </div>
  );
}
