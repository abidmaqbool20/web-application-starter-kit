import { useSelector } from "react-redux";
import { useMemo } from "react";

export function usePermission() {
  const user = useSelector((state) => state.auth.user);

  const permissions = useMemo(() => {
    if (!user) return [];

    const perms = [];

    // Get permissions from roles
    if (user.roles && Array.isArray(user.roles)) {
      user.roles.forEach(role => {
        if (role.permissions && Array.isArray(role.permissions)) {
          perms.push(...role.permissions);
        }
      });
    }

    // Get additional permissions
    if (user.additional_permissions && Array.isArray(user.additional_permissions)) {
      perms.push(...user.additional_permissions);
    }

    // Remove duplicates
    return perms.filter((perm, index, self) =>
      index === self.findIndex(p => p.key === perm.key)
    );
  }, [user]);

  const isAdmin = useMemo(() => {
    return user?.roles?.some(role => role.name?.toLowerCase() === 'admin');
  }, [user]);

  const hasPermission = (permissionKey) => {
    if (!permissionKey) return true;
    if (isAdmin) return true;
    return permissions.some(perm => perm.key === permissionKey);
  };

  const hasAnyPermission = (permissionKeys) => {
    if (!permissionKeys || permissionKeys.length === 0) return true;
    if (isAdmin) return true;
    return permissionKeys.some(key => hasPermission(key));
  };

  const hasAllPermissions = (permissionKeys) => {
    if (!permissionKeys || permissionKeys.length === 0) return true;
    if (isAdmin) return true;
    return permissionKeys.every(key => hasPermission(key));
  };

  return {
    permissions,
    isAdmin,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
