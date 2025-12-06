"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center p-6 gap-6 flex-1">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Bienvenido al sistema
      </h1>
      <Link href="/test">
        <Button>Ver información del usuario</Button>
      </Link>
      <Select>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Selecciona una opción" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="opcion1">Opción 1</SelectItem>
          <SelectItem value="opcion2">Opción 2</SelectItem>
          <SelectItem value="opcion3">Opción 3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
