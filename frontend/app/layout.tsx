import { Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cookies } from "next/headers";

const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CS2 Farm Tracker",
  description: "Track your CS2 farming profits, sessions, and weekly earnings.",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const sidebarState = cookieStore.get("sidebar_state")?.value;
  const defaultOpen = sidebarState !== "false";

  return (
    <html lang="en" className="dark bg-background">
      <body className={`${geistMono.className} font-sans antialiased`}>
        <TooltipProvider>
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <SidebarInset className="bg-background">{children}</SidebarInset>
          </SidebarProvider>
        </TooltipProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "oklch(0.17 0.006 240)",
              color: "oklch(0.97 0 0)",
              border: "1px solid oklch(0.26 0.008 240)",
              fontSize: "14px",
            },
            success: {
              iconTheme: {
                primary: "oklch(0.72 0.19 55)",
                secondary: "oklch(0.17 0.02 60)",
              },
            },
            error: {
              iconTheme: {
                primary: "oklch(0.65 0.22 25)",
                secondary: "oklch(0.97 0 0)",
              },
            },
          }}
        />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
