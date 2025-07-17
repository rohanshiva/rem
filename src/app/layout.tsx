import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import localFont from 'next/font/local'
import "./globals.css";
import { Toaster } from "sonner";
import { ViewTransitions } from "next-view-transitions";
import { Loader } from "@/components/ui/loader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  subsets: ["latin"],
});

const departureMono = localFont({
  variable: "--font-mono-accent",
  src: "../../public/fonts/DepartureMono-Regular.woff2"
})

export const metadata: Metadata = {
  title: "Rem",
  description: "Remember your dreams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${departureMono.variable} antialiased`}
        >
          <div className="w-full max-w-xl mx-auto h-[100dvh] flex flex-col py-8 px-4">
            <Toaster
              richColors
              toastOptions={{
                style: {
                  backgroundColor: "var(--toast-background)",
                  border: `1px solid var(--toast-border)`,
                  backdropFilter: "blur(12px)",
                  color: "var(--foreground)",
                  boxShadow: "none",
                  cursor: "grab",
                },
              }}
              icons={{
                loading: <Loader />,
              }}
            />
            {children}
          </div>
        </body>
      </html>
    </ViewTransitions>
  );
}
