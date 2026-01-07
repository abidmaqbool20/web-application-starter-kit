"use client";

import { createContext, useContext, useState, useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import FullPageLoader from "@/components/ui/full-page-loader";

const RouteLoadingContext = createContext({
    isLoading: false,
    setIsLoading: () => { },
});

export function useRouteLoading() {
    return useContext(RouteLoadingContext);
}

// Inner component that uses useSearchParams (must be wrapped in Suspense)
function RouteLoadingInner({ children, isLoading, setIsLoading }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [mounted, setMounted] = useState(false);

    // Track when component is mounted on client
    useEffect(() => {
        setMounted(true);
    }, []);

    // Reset loading state when route changes complete
    useEffect(() => {
        if (mounted) {
            setIsLoading(false);
        }
    }, [pathname, searchParams, mounted, setIsLoading]);

    return (
        <>
            {mounted && isLoading && <FullPageLoader message="Navigating..." />}
            {children}
        </>
    );
}

export function RouteLoadingProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <RouteLoadingContext.Provider value={{ isLoading, setIsLoading }}>
            <Suspense fallback={null}>
                <RouteLoadingInner isLoading={isLoading} setIsLoading={setIsLoading}>
                    {children}
                </RouteLoadingInner>
            </Suspense>
        </RouteLoadingContext.Provider>
    );
}
