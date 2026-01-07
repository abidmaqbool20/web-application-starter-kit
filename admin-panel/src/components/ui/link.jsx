"use client";

import NextLink from "next/link";
import { useRouteLoading } from "@/components/RouteLoadingProvider";
import { usePathname } from "next/navigation";

/**
 * Custom Link component that shows loading state during navigation
 */
export default function Link({ href, children, onClick, ...props }) {
    const { setIsLoading } = useRouteLoading();
    const pathname = usePathname();

    const handleClick = (e) => {
        // Don't show loader for same-page links or external links
        const targetPath = typeof href === "string" ? href : href?.pathname;
        const isExternalLink = targetPath?.startsWith("http") || targetPath?.startsWith("//");
        const isSamePage = targetPath === pathname;
        const isAnchorLink = targetPath?.startsWith("#");

        if (!isExternalLink && !isSamePage && !isAnchorLink) {
            setIsLoading(true);
        }

        // Call original onClick if provided
        if (onClick) {
            onClick(e);
        }
    };

    return (
        <NextLink href={href} onClick={handleClick} {...props}>
            {children}
        </NextLink>
    );
}
