import Nav from "@/components/layout/nav";

export default function Loading() {
  return (
    <div>
      <Nav  />
      <div className="flex flex-col items-center justify-center">
        <div className="text-xl font-mono-accent shimmer">Loading...</div>
      </div>
    </div>
  );
}
