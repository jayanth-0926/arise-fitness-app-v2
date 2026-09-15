export default function Loading() {
  return (
    <main className="min-h-screen bg-bg-primary px-6 pb-24 pt-32 md:px-10">
      <div className="mx-auto max-w-6xl animate-pulse space-y-6">
        <div className="h-10 w-64 rounded-sm bg-bg-card" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-sm bg-bg-card" />
          ))}
        </div>
        <div className="h-56 rounded-sm bg-bg-card" />
      </div>
    </main>
  );
}
