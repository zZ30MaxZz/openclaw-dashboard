import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";

export const metadata: Metadata = {
  title: "OpenClaw Mission Control",
  description: "Cyberpunk dashboard for AI agent orchestration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>
          
          {/* Mobile Top Bar */}
          <MobileNav />
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto pt-16 lg:pt-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
