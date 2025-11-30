import CarreraSelectorForm from "@/components/carrera-selector-form";
import { getUser } from "@/src/actions/cookiesActions";
import { nombresCompletos } from "@/src/constants/carrerasInfo";

export default async function AlternarCarreraPage() {
  const user = await getUser();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="space-y-2 text-center">
          {user.selectedCarrera && (
            <p className="text-sm text-green-600 dark:text-green-400">
              ✓ Carrera actual:{" "}
              {nombresCompletos[Number(user.selectedCarrera.codigo)]}
            </p>
          )}
        </div>

        <div className="flex justify-center">
          <CarreraSelectorForm user={user} />
        </div>
      </div>
    </main>
  );
}
