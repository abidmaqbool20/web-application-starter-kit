"use client";

import * as React from "react";
import { LayoutDashboardIcon, UserRoundCog, MonitorCog, Settings2, HammerIcon, BarChartIcon, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import Link from "@/components/ui/link";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
const iconMap = {
  LayoutDashboardIcon,
  Settings2,
  HammerIcon,
  BarChartIcon,
  ChevronRight,
  UserRoundCog,
  MonitorCog,
};
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveMenu,
} from "@/slices/sidebarSlice";



export function AppSidebar(props) {

  const pathname = usePathname();
  const dispatch = useDispatch();
  const menu = useSelector((state) => state.sidebar.menu);
  const user = useSelector((state) => state.sidebar.user);
  const activeMenu = useSelector((state) => state.sidebar.activeMenu);
  const { open, setOpen } = useSidebar();

  const [hasMounted, setHasMounted] = React.useState(false);
  const [showRightSidebar, setShowRightSidebar] = React.useState(true);
  const [stickSidebar, setStickSidebar] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  React.useEffect(() => {
    if (menu.length && pathname) {
      const found = findMenuByUrl(menu, pathname);
      if (found) {
        dispatch(setActiveMenu(found));
      }
    }
  }, [pathname, menu, dispatch]);

  React.useEffect(() => {
    if (open) {
      setShowRightSidebar(true);
      setOpen(true);
    } else {
      setShowRightSidebar(false);
      setOpen(false);
    }
  }, [open]);


  const findMenuByUrl = (items, pathname) => {
    for (const item of items) {
      if (item.url === pathname) {
        return item; // Found match directly
      }
      if (item.items) {
        const found = findMenuByUrl(item.items, pathname);
        if (found) {
          return item; // Return parent if nested match
        }
      }
    }
    return null; // Not found
  };

  const handleMainMenuClick = (item) => {
    dispatch(setActiveMenu(item));
    setOpen(true);
    setShowRightSidebar(true);
  };

  const handleSubmenuClick = () => {
    if (!stickSidebar) {
      setShowRightSidebar(false);
      setOpen(false);
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
      {...props}
    >
      {/* Left Sidebar */}
      <Sidebar
        collapsible="none"
        className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
      >
        <SidebarHeader className="flex items-center justify-center h-25 px-0 bg-[var(--primary)] border-b" style={{ margin: "0px -10px" }}>
          <Link href="/dashboard" className="flex items-center">
            <span className="rotate-90 text-2xl font-medium  dark:brightness-90">Logo</span>
            {/* <Image
              src="/logo.png"
              alt="Logo"
              width={150}
              height={150}
              className="rotate-90 h-auto w-auto object-contain max-h-12 dark:brightness-90"
            /> */}
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {menu.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{ children: item.title, hidden: false }}
                      onClick={() => handleMainMenuClick(item)}
                      isActive={activeMenu?.title === item.title}
                      className="px-2.5 md:px-2"
                    >
                      {iconMap[item.icon] && React.createElement(iconMap[item.icon], { className: "mr-2 h-4 w-4" })}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>

      {/* Right Sidebar: Controlled strictly by state */}
      {hasMounted && (stickSidebar || showRightSidebar) && (
        <Sidebar collapsible="none" className="hidden flex-1 md:flex">
          <SidebarHeader className="gap-3.5 border-b p-3">
            <div className="flex w-full items-center justify-between">
              <div className="text-base font-medium text-foreground">
                {activeMenu?.title}
              </div>
              <Label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={stickSidebar}
                  onCheckedChange={(checked) => {
                    setStickSidebar(checked); // controls sticky toggle
                    if (!checked) {
                      setShowRightSidebar(false); // collapse if toggled OFF
                    }
                  }}
                  className="shadow-none"
                />
              </Label>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Module Menu</SidebarGroupLabel>
              <SidebarMenu>
                {(activeMenu?.items || []).map((item) => {
                  const hasNested = Array.isArray(item.items);

                  return hasNested ? (
                    <Collapsible
                      key={item.title}
                      asChild
                      defaultOpen={false}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.title}>
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((sub) => (
                              <SidebarMenuSubItem key={sub.title}>
                                <SidebarMenuSubButton asChild>
                                  <Link
                                    href={sub.url}
                                    onClick={handleSubmenuClick}
                                  >
                                    <span>{sub.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <Link
                          href={item.url}
                          onClick={handleSubmenuClick}
                          className="flex w-full items-center"
                        >
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      )}
    </Sidebar>
  );
}
