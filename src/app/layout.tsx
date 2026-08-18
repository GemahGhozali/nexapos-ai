import "./globals.css";
import { cn } from "@/libs/shadcn";
import { Metadata } from "next";
import { Toaster } from "@/components/ui/toast";
import { ThemeProvider } from "@/providers/theme";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@/providers/query-client";
import { Geist, Geist_Mono, Figtree } from "next/font/google";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NexaPOS AI - AI Powered POS Application",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", figtree.variable)}
      suppressHydrationWarning
    >
      <body className="h-full">
        <QueryClientProvider>
          <Toaster />
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <TooltipProvider>{children}</TooltipProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
