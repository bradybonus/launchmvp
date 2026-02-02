import { LaunchLogo } from "./LaunchLogo";

interface AppHeaderProps {
  rightAction?: React.ReactNode;
}

export function AppHeader({ rightAction }: AppHeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <LaunchLogo />
        {rightAction ? (
          <div className="shrink-0">{rightAction}</div>
        ) : (
          <div className="h-8 w-8 shrink-0 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
            PM
          </div>
        )}
      </div>
    </header>
  );
}
