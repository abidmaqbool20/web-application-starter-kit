"use client";

import { useRouter, usePathname } from "next/navigation";
import { useRouteLoading } from "@/components/RouteLoadingProvider";
import { useCallback } from "react";

/**
 * Custom hook for navigation with loading state
 * Use this instead of useRouter().push() to show loading during navigation
 */
export function useNavigate() {
    const router = useRouter();
    const pathname = usePathname();
    const { setIsLoading } = useRouteLoading();

    const navigate = useCallback(
        (href, options) => {
            const targetPath = typeof href === "string" ? href : href?.pathname;
            const isExternalLink = targetPath?.startsWith("http") || targetPath?.startsWith("//");
            const isSamePage = targetPath === pathname;

            if (!isExternalLink && !isSamePage) {
                setIsLoading(true);
            }

            router.push(href, options);
        },
        [router, pathname, setIsLoading]
    );

    const replace = useCallback(
        (href, options) => {
            const targetPath = typeof href === "string" ? href : href?.pathname;
            const isExternalLink = targetPath?.startsWith("http") || targetPath?.startsWith("//");
            const isSamePage = targetPath === pathname;

            if (!isExternalLink && !isSamePage) {
                setIsLoading(true);
            }

            router.replace(href, options);
        },
        [router, pathname, setIsLoading]
    );

    return {
        push: navigate,
        replace,
        back: router.back,
        forward: router.forward,
        refresh: router.refresh,
    };
}
