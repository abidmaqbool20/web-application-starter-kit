import { createSlice } from "@reduxjs/toolkit";

// Menu configuration with required permissions
const menuConfig = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: "LayoutDashboardIcon",
    permission: "dashboard-view",
    items: [{ title: "Dashboard", url: "/dashboard", permission: "dashboard-view" }],
  },
  {
    title: "User Management",
    icon: "UserRoundCog",
    permission: "user-management-view",
    items: [
      { title: "Permissions", url: "/user-management/permissions", permission: "permission-view" },
      { title: "Roles", url: "/user-management/roles", permission: "role-view" },
      { title: "Users", url: "/user-management/users", permission: "user-view" },
    ],
  },
  {
    title: "System Options",
    url: "/system",
    icon: "MonitorCog",
    permission: "system-view",
    items: [
      { title: "Countries", url: "/system/countries", permission: "country-view" },
      { title: "States", url: "/system/states", permission: "state-view" },
      { title: "Cities", url: "/system/cities", permission: "city-view" },
      { title: "Master Data", url: "/system/master-data", permission: "master-data-view" },
    ],
  },
  {
    title: "Settings",
    url: "/settings",
    icon: "Settings2",
    permission: "settings-view",
    items: [
      { title: "Security", url: "/settings/security", permission: "settings-security" },
    ],
  },
];

const initialState = {
  menuConfig, // Store the full menu config
  menu: [], // Filtered menu based on permissions
  activeMenu: {},
};

// Helper function to check if user has permission
const hasPermission = (userPermissions, requiredPermission) => {
  if (!requiredPermission) return true; // No permission required
  if (!userPermissions || userPermissions.length === 0) return false;

  // Check if user has the exact permission
  return userPermissions.some(perm => perm.key === requiredPermission);
};

// Helper function to filter menu items based on permissions
const filterMenuItems = (items, userPermissions) => {
  if (!items) return [];

  return items
    .filter(item => hasPermission(userPermissions, item.permission))
    .map(item => {
      if (item.items && item.items.length > 0) {
        const filteredSubItems = filterMenuItems(item.items, userPermissions);
        return filteredSubItems.length > 0
          ? { ...item, items: filteredSubItems }
          : null;
      }
      return item;
    })
    .filter(Boolean);
};

// Helper function to get all user permissions (from roles + additional permissions)
const getUserPermissions = (user) => {
  if (!user) return [];

  const permissions = [];

  // Get permissions from roles
  if (user.roles && Array.isArray(user.roles)) {
    user.roles.forEach(role => {
      if (role.permissions && Array.isArray(role.permissions)) {
        permissions.push(...role.permissions);
      }
    });
  }

  // Get additional permissions
  if (user.additional_permissions && Array.isArray(user.additional_permissions)) {
    permissions.push(...user.additional_permissions);
  }

  // Remove duplicates based on permission key
  const uniquePermissions = permissions.filter((perm, index, self) =>
    index === self.findIndex(p => p.key === perm.key)
  );

  return uniquePermissions;
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setActiveMenu: (state, action) => {
      state.activeMenu = action.payload;
    },
    buildMenu: (state, action) => {
      const user = action.payload;

      // Check if user has admin role - show all menus
      const isAdmin = user?.roles?.some(role => role.name?.toLowerCase() === 'admin');

      if (isAdmin) {
        // Admin gets all menus
        state.menu = menuConfig;
      } else {
        const userPermissions = getUserPermissions(user);

        // If user has no permissions at all, show all menus (fallback for development)
        if (userPermissions.length === 0) {
          state.menu = menuConfig;
        } else {
          // Filter menu based on user permissions
          state.menu = filterMenuItems(menuConfig, userPermissions);
        }
      }
    },
    resetMenu: (state) => {
      state.menu = [];
      state.activeMenu = {};
    },
  },
});

export const { setActiveMenu, buildMenu, resetMenu } = sidebarSlice.actions;
export default sidebarSlice.reducer;
