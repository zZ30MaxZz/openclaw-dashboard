import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { Terminal, Menu } from 'lucide-react';

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} antialiased`}>
        <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>
          
          {/* Mobile Top Bar */}
          <div className="lg:hidden glass-panel border-b border-border/50 p-4 w-full fixed top-0 z-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-primary-foreground" />
                </div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  OPENCLAW
                </h1>
              </div>
              <button className="p-2 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto pt-16 lg:pt-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
