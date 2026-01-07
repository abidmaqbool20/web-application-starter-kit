"use client"

import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      <h1 className="text-6xl font-bold text-gray-900 dark:text-white">404</h1>
      <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
        Oops! Page not found.
      </p>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-block px-6 py-3 text-white bg-black hover:bg-gray-800 rounded-lg transition"
      >
        Go back Home
      </Link>
    </div>
  )
}
