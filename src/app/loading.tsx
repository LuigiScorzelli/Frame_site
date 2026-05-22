export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-0">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <span className="font-mono text-xs tracking-wider text-text-1">CARICAMENTO...</span>
      </div>
    </main>
  );
}
