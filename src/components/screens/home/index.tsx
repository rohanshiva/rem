import type { Recording } from "@/types";

import { Link } from "next-view-transitions";
import { Button } from "@/components/ui/button";
import { Card } from "./card";
import { SceneLayout } from "@/components/layout/scene-layout";
import { Title } from "@/components/layout/title";
import Nav from "@/components/layout/nav";

interface Props {
  recordings: Recording[];
}

export const Home = ({ recordings }: Props) => {
  const NoRecordings = () => (
    <SceneLayout>
      <Title />
      <Link href="/new">
        <Button className="fixed bottom-0 mb-8 left-1/2 -translate-x-1/2 max-w-xs w-full text-3xl font-serif">
          New Recording
        </Button>
      </Link>
    </SceneLayout>
  );

  const RecordingsList = () => (
    <div className="pb-32">
      <Nav className="mb-8" />
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
        {recordings.map((recording) => (
          <Card key={recording.id} recording={recording} />
        ))}
      </div>
      <Link href="/new">
        <Button className="fixed bottom-0 mb-8 left-1/2 -translate-x-1/2 max-w-xs w-full text-3xl font-serif">
          New Recording
        </Button>
      </Link>
    </div>
  );

  if (!recordings || recordings.length === 0) {
    return <NoRecordings />;
  }

  return <RecordingsList />;
};
