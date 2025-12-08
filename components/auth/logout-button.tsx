"use client";

import { logout } from "@/src/actions/authActions";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <Button onClick={handleLogout} className="hover:cursor-pointer">
      <LogOut />
      Cerrar sesión
    </Button>
  );
}
