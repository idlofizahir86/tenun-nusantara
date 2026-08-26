import { getIsland } from "@/config/islands";
import { IslandGame } from "@/components/game/island-game";
import { AppNavbar } from "@/components/layout/app-navbar";
import { redirect } from "next/navigation";

export default function IslandPage({ params }: { params: { id: string } }) {
  const island = getIsland(params.id);

  if (!island) {
    redirect("/map");
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <AppNavbar hideMenu />
      <div className="min-h-0 flex-1">
        <IslandGame island={island} />
      </div>
    </div>
  );
}
