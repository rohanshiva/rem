import Orb from "@/app/new/orb";
import { Scene } from "@/components/scene";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import Link from "next/link";

export default function NewRecording() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <Link href="/">
          <Button className="flex flex-row gap-1.5" size="sm">
            <MoveLeft />
            Back
          </Button>
        </Link>
      </div>

      <div className="relative flex-1 flex items-center justify-center">
        <Scene />
        <Orb />
      </div>
    </div>
  );
}
