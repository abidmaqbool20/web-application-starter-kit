"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, User, LogOut, Check } from "lucide-react"; // Added Check icon
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "next-themes";
import { useNavigate } from "@/hooks/use-navigate";
import { logoutRequest } from "@/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { setCookie, getCookie } from "@/lib/cookies";

const colorThemes = [
  { name: "default", color: "#6366f1" },
  { name: "red", color: "#ef4444" },
  { name: "yellow", color: "#f59e0b" },
  { name: "green", color: "#10b981" },
  { name: "blue", color: "#3b82f6" },
  { name: "orange", color: "#f97316" },
];

export default function SiteHeader() {
  const dispatch = useDispatch();
  const { push } = useNavigate();
  const { theme, setTheme } = useTheme();
  const [selectedColor, setSelectedColor] = useState("default");
  const [mounted, setMounted] = useState(false);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    // Load color theme from cookie instead of localStorage
    const storedColor = getCookie("color-theme") || "default";
    setSelectedColor(storedColor);
    document.documentElement.setAttribute("data-theme", storedColor);
  }, []);

  useEffect(() => {
    setMounted(true);
    // Theme is already managed by next-themes via cookie
  }, []);

  const toggleDarkMode = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    // next-themes handles localStorage, but we'll also set a cookie
    setCookie("theme-mode", newTheme);
  };

  const handleColorChange = (themeColor) => {
    setSelectedColor(themeColor);
    // Save to cookie instead of localStorage
    setCookie("color-theme", themeColor);
    document.documentElement.setAttribute("data-theme", themeColor);
  };

  const handleLogout = async () => {
    await dispatch(logoutRequest());
    push("/login");
  };



  const userImage = "";

  const selectedTheme = colorThemes.find((theme) => theme.name === selectedColor);
  if (!mounted) return null;
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b">
      <div className="flex w-full items-center gap-1 px-4 lg:px-6">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <h1 className="text-base font-medium">Admin Panel</h1>
      </div>

      <div className="flex items-center gap-4 ml-auto pr-4">
        {/* Toggle Dark Mode */}
        <button
          onClick={toggleDarkMode}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 p-1"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {/* Color Theme Picker */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-1 rounded bg-gray-200 dark:bg-gray-700">
              {/* Small Circle showing current color */}
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: selectedTheme?.color }}
              ></span>
              <span className="text-sm capitalize">{selectedTheme?.name}</span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-48">
            {colorThemes.map((color) => (
              <DropdownMenuItem
                key={color.name}
                onClick={() => handleColorChange(color.name)}
                className="flex items-center gap-2"
              >
                {/* Circle Color Preview */}
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: color.color }}
                ></span>

                {/* Color Name */}
                <span className="text-sm capitalize">{color.name}</span>

                {/* Selected Tick */}
                {selectedColor === color.name && (
                  <Check className="ml-auto w-4 h-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              {userImage ? (
                <img src={userImage} alt="User Avatar" className="w-8 h-8 rounded-full" />
              ) : (
                <User className="w-8 h-8 text-gray-600" />
              )}
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            <DropdownMenuItem onClick={() => push("/profile")}>
              <User className="w-4 h-4 mr-2" />
              <span className="text-sm text-gray-800 cursor-pointer dark:text-gray-400">Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="text-sm text-gray-800 cursor-pointer dark:text-gray-400">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
