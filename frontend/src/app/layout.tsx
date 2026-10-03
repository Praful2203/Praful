import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { EmergencyProvider } from "@/context/EmergencyContext";
import { NavigationBar } from "@/components/common/NavigationBar";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ResQNet | Autonomous Hyperlocal Emergency Response Platform",
  description: "Mission-critical agentic emergency coordination swarm with autonomous replanning and real-time telemetry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#07111F] text-slate-100 min-h-screen flex flex-col selection:bg-blue-600 selection:text-white`}>
        <EmergencyProvider>
          <NavigationBar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <footer className="border-t border-slate-800/80 bg-[#07111F] py-4 px-6 text-center text-xs text-slate-500 font-mono">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <span>ResQNet Multi-Agent Swarm Platform • Hackathon Demo Build</span>
              <span className="text-slate-400">Status: Autonomous Coordination Core Active</span>
            </div>
          </footer>
        </EmergencyProvider>
      </body>
    </html>
  );
}
