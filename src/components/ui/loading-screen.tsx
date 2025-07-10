import { Link } from "next-view-transitions";
import Console from "@/components/screens/recording/console";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="p-4">
        <Link href="/">Rem</Link>
      </nav>
      <div className="flex-1 flex items-center justify-center">
        <div className="relative flex justify-center items-center w-full">
          {/* Screen Overlay */}
          <div className="absolute z-10 flex h-full w-full items-center justify-center bg-transparent px-[20%] py-[3%] mt-[2%]">
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-md bg-black">
              <div className="relative h-full w-full flex items-center justify-center">
                <div className="text-xl font-mono-accent text-white">
                  Loading...
                </div>
              </div>
            </div>
          </div>
          <Console />
        </div>
      </div>
    </div>
  );
} 