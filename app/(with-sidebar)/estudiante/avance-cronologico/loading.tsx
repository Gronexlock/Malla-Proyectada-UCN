import { AvanceCronoSkeleton } from "@/components/skeletons/avance-crono-skeleton";
import { getUser } from "@/src/actions/cookiesActions";

export default async function Loading() {
  const { selectedCarrera } = await getUser();
  return (
    <div className="p-4">
      <AvanceCronoSkeleton />
    </div>
  );
}
