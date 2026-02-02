export default function TaskDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      <p className="mt-4 text-sm text-gray-500">Loading task...</p>
    </div>
  );
}
