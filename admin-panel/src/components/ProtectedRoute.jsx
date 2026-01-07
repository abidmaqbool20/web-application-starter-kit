"use client";

import { usePermission } from "@/hooks/usePermission";
import { useNavigate } from "@/hooks/use-navigate";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, permission, anyPermissions, allPermissions }) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission();
  const { push } = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const requesting = useSelector((state) => state.auth.requesting);

  useEffect(() => {
    // Wait for user data to load before checking permissions
    if (requesting || !user) return;

    let isAuthorized = true;

    if (permission) {
      isAuthorized = hasPermission(permission);
    } else if (anyPermissions) {
      isAuthorized = hasAnyPermission(anyPermissions);
    } else if (allPermissions) {
      isAuthorized = hasAllPermissions(allPermissions);
    }

    if (!isAuthorized) {
      push("/unauthorized");
    }
  }, [permission, anyPermissions, allPermissions, hasPermission, hasAnyPermission, hasAllPermissions, push, user, requesting]);

  // Show nothing while loading user data
  if (requesting || !user) {
    return null;
  }

  // Check authorization after user data is loaded
  let isAuthorized = true;
  if (permission) {
    isAuthorized = hasPermission(permission);
  } else if (anyPermissions) {
    isAuthorized = hasAnyPermission(anyPermissions);
  } else if (allPermissions) {
    isAuthorized = hasAllPermissions(allPermissions);
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
