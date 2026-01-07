"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";
import Image from "next/image";
import Link from "@/components/ui/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function Header() {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Link href="/dashboard" passHref>
              <SidebarMenuButton
                size="lg"
                className="cursor-pointer justify-center bg-[var(--primary)] hover:bg-[var(--primary)] transition-colors"
              >
                <div className="flex items-center justify-center w-30">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    className="h-auto w-auto object-contain max-h-12 dark:brightness-90"
                    width={150}
                    height={150}
                    priority
                  />
                </div>
              </SidebarMenuButton>
            </Link>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
