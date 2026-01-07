"use client";

import { useNavigate } from "@/hooks/use-navigate";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  const { push, back } = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-destructive/20 blur-3xl rounded-full" />
            <ShieldAlert className="w-32 h-32 text-destructive relative" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-destructive">403</h1>
          <h2 className="text-2xl font-semibold">Access Denied</h2>
          <p className="text-muted-foreground max-w-md">
            You don't have permission to access this page. Please contact your administrator if you believe this is a mistake.
          </p>
        </div>

        <div className="flex gap-4 justify-center pt-4">
          <Button variant="outline" onClick={() => back()}>
            Go Back
          </Button>
          <Button onClick={() => push("/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
