import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonHeader() {
  return (
    <div className="focus:outline-none">
      <div className="w-full text-md font-semibold justify-between px-3 flex items-center h-12  dark:border-neutral-800 border-b hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-4" />
      </div>
    </div>
  );
}
