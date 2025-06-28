export default function AnimationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 w-full h-full">
      {children}
    </div>
  );
} 