interface SceneLayoutProps {
  children: React.ReactNode;
}

export function SceneLayout({ children }: SceneLayoutProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden gap-6">
      {children}
    </div>
  );
} 