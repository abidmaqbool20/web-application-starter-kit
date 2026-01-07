import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const fetcher = async (url, options = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    cache: 'no-store', // Prevents caching for fresh data
    credentials: 'include', // For cookie/session auth if needed
  });
  if (!res.ok) {
    // Optionally handle global errors here
    throw new Error(await res.text());
  }
  return res.json();
};
