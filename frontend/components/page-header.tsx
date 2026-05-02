"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  const router = useRouter();
  const { isGuest } = useAuth();

  const handleLogin = () => router.push("/login");

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  };
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur lg:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" />
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold">{title}</span>
        {description ? <span className="text-xs text-muted-foreground">{description}</span> : null}
      </div>
      {actions ? <div className="ml-auto flex items-center gap-2">{actions}</div> : null}
      <Button
        variant={isGuest ? "default" : "outline"}
        className="ml-auto"
        onClick={isGuest ? handleLogin : handleLogout}
      >
        {isGuest ? "Login" : "Logout"}
      </Button>
    </header>
  );
}
