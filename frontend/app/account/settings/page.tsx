"use client";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function Settings() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Settings</h1>

            <Button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                Toggle {theme === "light" ? "Dark" : "Light"} Mode
            </Button>
        </div>
    );
}
