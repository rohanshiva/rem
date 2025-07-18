import Link from "next/link";
import AnimatedOrb from "@/components/ui/animated-orb";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

export default function Nav({className}: {className?: string}) {
  return (
    <nav className={cn("flex flex-row gap-2 align-center items-center justify-between", className)}>
      <Link href="/" className="font-mono">REM</Link>
      <ThemeToggle />
    </nav>
  );
}
