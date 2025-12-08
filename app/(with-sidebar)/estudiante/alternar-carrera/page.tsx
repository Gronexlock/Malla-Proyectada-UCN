import CarreraSelectorForm from "@/components/carrera-selector-form";
import { getUser } from "@/src/actions/cookiesActions";

export default async function AlternarCarreraPage() {
  const user = await getUser();

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-6">
        <div className="flex flex-col items-center">
          <CarreraSelectorForm user={user} />
        </div>
      </div>
    </main>
  );
}
