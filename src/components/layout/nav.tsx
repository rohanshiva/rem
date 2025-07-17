import { Link } from "next-view-transitions";
import AnimatedOrb from "@/components/ui/animated-orb";
import { cn } from "@/lib/utils";

export default function Nav({className}: {className?: string}) {
  return (
    <nav className={cn("flex flex-row gap-2 align-center items-center", className)}>
      <Link href="/" className="font-mono">REM</Link>
    </nav>
  );
}
