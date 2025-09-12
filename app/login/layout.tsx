// app/login/layout.tsx
import { cn } from "@/lib/utils";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col items-center justify-center",
        "bg-background" // o cualquier estilo de fondo que uses
      )}
    >
      {children}
    </div>
  );
}
