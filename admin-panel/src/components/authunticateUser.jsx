"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser, fetchCurrentUser } from "@/slices/authSlice";
import FullPageLoader from "@/components/ui/full-page-loader";

export default function AuthunticateUser({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [mounted, setMounted] = useState(false);
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Track when component is mounted on client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const verifyAuth = async () => {
      try {
        // Call GraphQL me query to verify if the HTTP-only cookie is valid
        const result = await dispatch(fetchCurrentUser()).unwrap();
        if (result) {
          setIsAuthenticated(true);
        } else {
          dispatch(clearUser());
          setIsAuthenticated(false);
          router.push("/login");
        }
      } catch (error) {
        // If 401 or any error, redirect to login
        dispatch(clearUser());
        setIsAuthenticated(false);
        router.push("/login");
      } finally {
        setChecking(false);
      }
    };

    // Only verify if we don't have a user in state
    if (!user) {
      verifyAuth();
    } else {
      setIsAuthenticated(true);
      setChecking(false);
    }
  }, [router, dispatch, user, mounted]);

  // During SSR or before mount, render nothing to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  // Show full-page loader while checking authentication
  if (checking) {
    return <FullPageLoader message="Authenticating..." />;
  }

  // Only render children if authenticated
  if (!isAuthenticated) {
    return <FullPageLoader message="Redirecting to login..." />;
  }

  return <>{children}</>;
}
