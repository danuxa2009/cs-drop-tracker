"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;
    if (!password) {
      setError(true);
      return;
    }

    setLoading(true);
    setError(false);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ password }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        router.back();
        router.refresh();
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-xs border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Admin login</CardTitle>
          <CardDescription>Enter your password to access admin features</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            {error && <p className="text-xs text-destructive">Incorrect password</p>}
          </div>
          <div className="flex gap-2">
            <Button className="flex-1" variant="outline" onClick={() => router.back()}>
              <ChevronLeft />
              Back
            </Button>
            <Button className="flex-3" onClick={handleSubmit} disabled={loading || !password}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
