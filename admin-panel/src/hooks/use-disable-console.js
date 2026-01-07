"use client";

import { useEffect } from 'react';

export function useDisableConsoleInProduction() {
    useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            // Disable all console logs in production
            for (const method of ['log', 'warn', 'error', 'info', 'debug']) {
                // eslint-disable-next-line no-console
                console[method] = () => { };
            }
        }
    }, []);
}