import { getIsland } from "@/config/islands";
import { redirect } from "next/navigation";
import { ReflectionClient } from "@/components/game/reflection-client";
import { AppNavbar } from "@/components/layout/app-navbar";

export default function RefleksiPage({ params }: { params: { id: string } }) {
  const island = getIsland(params.id);

  if (!island) {
    redirect("/map");
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <AppNavbar hideMenu />
      <div className="min-h-0 flex-1">
        <ReflectionClient island={island} />
      </div>
    </div>
  );
}
