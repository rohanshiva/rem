import { Link } from "next-view-transitions";

export default function Loading() {
  return (
    <div>
      <nav>
        <Link href="/">Rem</Link>
      </nav>
      <div className="flex flex-col items-center justify-center">
        <div className="text-xl font-mono-accent shimmer">Loading...</div>
      </div>
    </div>
  );
}
