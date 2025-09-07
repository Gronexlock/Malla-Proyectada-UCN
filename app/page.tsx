import LogoutButton from "@/components/logout-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen p-6 gap-6">
        <h1 className="text-3xl font-bold mb-6">Bienvenido al sistema</h1>
        <Link href="/usuario">
          <Button>Ver información del usuario</Button>
        </Link>
        <LogoutButton />
      </div>
    </div>
  );
}
