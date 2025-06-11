import Link from "next/link";

export default function Loading() {
  return (
    <div>
      <nav>
        <Link href="/">Rem</Link>
      </nav>
      <div className="flex flex-col items-center justify-center">
        <div className="text-xl font-mono-accent shimmer">Loading memory...</div>
      </div>
    </div>
  );
}
