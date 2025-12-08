import { AvanceSkeleton } from "@/components/skeletons/avance-skeleton";
import { getUser } from "@/src/actions/cookiesActions";

export default async function Loading() {
  const { selectedCarrera } = await getUser();
  return (
    <div className="p-4">
      <AvanceSkeleton carrera={selectedCarrera} />
    </div>
  );
}
