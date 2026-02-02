"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLaunch } from "@/lib/context/LaunchContext";
import type { FeatureSize } from "@/lib/types";

const FEATURE_SIZES: { value: FeatureSize; label: string; description: string }[] = [
  { value: "minor", label: "Minor", description: "Incremental update, light touch" },
  { value: "medium", label: "Medium", description: "Notable feature, cross-team coordination" },
  { value: "major", label: "Major", description: "Major milestone, full launch plan" },
];

const TARGET_AUDIENCES = [
  "All customers",
  "Enterprise only",
  "SMB segment",
  "Specific segment",
];

export default function NewLaunchPage() {
  const router = useRouter();
  const { createLaunch } = useLaunch();
  const [name, setName] = useState("");
  const [featureSize, setFeatureSize] = useState<FeatureSize>("medium");
  const [targetAudience, setTargetAudience] = useState("All customers");
  const [targetDate, setTargetDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Analyzing feature scope...");
  const [error, setError] = useState("");

  function getMinDate() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Feature name is required.");
      return;
    }
    if (!targetDate) {
      setError("Target date is required.");
      return;
    }
    setLoading(true);
    setLoadingMessage("Analyzing feature scope...");
    const t1 = setTimeout(() => {
      setLoadingMessage("Building launch plan...");
    }, 800);
    setTimeout(() => {
      clearTimeout(t1);
      try {
        const launch = createLaunch({
          name: name.trim(),
          featureSize,
          targetAudience,
          targetDate,
        });
        router.push(`/launch/${launch.id}`);
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 1600);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm text-center max-w-md w-full">
          <div className="h-8 w-8 mx-auto rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
          <p className="mt-4 text-gray-700 font-medium">{loadingMessage}</p>
          <p className="mt-1 text-sm text-gray-500">This usually takes a few seconds.</p>
        </div>
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
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Back to dashboard
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900">New Launch</h1>
        <p className="mt-1 text-gray-600">
          Enter the details below. Launch AI will generate a launch plan and assets.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Feature name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Smart Notifications"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-700">
              Feature size
            </span>
            <div className="mt-2 space-y-2">
              {FEATURE_SIZES.map((size) => (
                <label
                  key={size.value}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:bg-gray-50 has-[:checked]:border-blue-600 has-[:checked]:ring-1 has-[:checked]:ring-blue-600"
                >
                  <input
                    type="radio"
                    name="featureSize"
                    value={size.value}
                    checked={featureSize === size.value}
                    onChange={() => setFeatureSize(size.value)}
                    className="mt-1 h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-medium text-gray-900">{size.label}</span>
                    <p className="text-sm text-gray-500">{size.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="audience" className="block text-sm font-medium text-gray-700">
              Target audience
            </label>
            <select
              id="audience"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {TARGET_AUDIENCES.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700">
              Target date
            </label>
            <input
              id="targetDate"
              type="date"
              value={targetDate}
              min={getMinDate()}
              onChange={(e) => setTargetDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Generate Launch Plan
            </button>
            <Link
              href="/"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
