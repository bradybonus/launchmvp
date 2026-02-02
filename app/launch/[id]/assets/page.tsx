"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useLaunch } from "@/lib/context/LaunchContext";
import { AppHeader } from "@/components/shared/AppHeader";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
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
          Dashboard
        </Link>
      </div>
    );
  }

  const breadcrumb = [
    { label: "Dashboard", href: "/" },
    { label: launch.name, href: `/launch/${launch.id}` },
    { label: "Assets" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Breadcrumb items={breadcrumb} />
        <h1 className="mt-3 text-2xl font-bold text-gray-900">Generated Assets</h1>
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
