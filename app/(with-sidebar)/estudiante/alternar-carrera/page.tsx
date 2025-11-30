import CarreraSelectorForm from "@/components/carrera-selector-form";
import { getUser } from "@/src/actions/cookiesActions";

export default async function AlternarCarreraPage() {
  const user = await getUser();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex justify-center">
          <CarreraSelectorForm user={user} />
        </div>
      </div>
    </main>
  );
}
