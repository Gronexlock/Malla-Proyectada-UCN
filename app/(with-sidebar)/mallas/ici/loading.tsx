import { MallaSkeleton } from "@/components/skeletons/malla-skeleton";

export default function Loading() {
  return (
    <div className="p-4">
      <MallaSkeleton nombreCarrera="ici" />
    </div>
  );
}
