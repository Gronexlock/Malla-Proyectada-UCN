import { AvanceCronoSkeleton } from "@/components/skeletons/avance-crono-skeleton";
import { carreras } from "@/src/constants/carrerasInfo";

export default async function TestPage() {
  const carrera = carreras["icci"];

  return (
    <div className="p-4 flex justify-center">
      <AvanceCronoSkeleton />
    </div>
  );
}
