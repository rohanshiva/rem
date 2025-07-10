import { Link } from "next-view-transitions";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import Orb from "./orb";

export const NewRecording = () => {
  const BackButton = () => (
    <div className="p-4">
      <Link href="/">
        <Button className="flex flex-row gap-1.5" size="sm">
          <MoveLeft />
          Back
        </Button>
      </Link>
    </div>
  );

  const RecordingInterface = () => (
    <div className="relative flex-1 flex items-center justify-center">
      <Orb />
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <BackButton />
      <RecordingInterface />
    </div>
  );
}; 