"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useLaunch } from "@/lib/context/LaunchContext";
import { AssetSection } from "@/components/assets/AssetSection";

export default function LaunchAssetsPage() {
  const params = useParams();
  const id = params.id as string;
  const { getLaunchById, updateAsset } = useLaunch();
  const launch = getLaunchById(id);

  if (!launch) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <p className="text-gray-600">Launch not found.</p>
        <Link href="/" className="mt-4 text-blue-600 hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-xl font-semibold text-gray-900">
            Launch
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href={`/launch/${launch.id}`}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Launch plan
            </Link>
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900">Generated Assets</h1>
        <p className="mt-1 text-gray-600">
          AI-generated content for {launch.name}. Edit as needed, then push to your systems.
        </p>
        <div className="mt-8 space-y-8">
          {launch.assets.map((asset) => (
            <AssetSection
              key={asset.id}
              asset={asset}
              onContentChange={(content) => updateAsset(launch.id, asset.id, content)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
