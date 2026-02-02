import Link from "next/link";

export function LaunchLogo() {
  return (
    <Link
      href="/"
      className="flex shrink-0 items-center gap-2 text-gray-900 hover:text-gray-700"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2L14 8l-2 2-2-2 2-6z" />
          <path d="M12 10v10" />
          <path d="m8 20 4-4 4 4" />
          <path d="M6 12a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4" />
        </svg>
      </span>
      <span className="text-xl font-semibold">Launch</span>
    </Link>
  );
}
