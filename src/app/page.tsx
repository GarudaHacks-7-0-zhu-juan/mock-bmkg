export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-24 text-center dark:bg-zinc-950">
      <main className="w-full max-w-2xl space-y-8">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Mock BMKG Earthquake Data
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            A lightweight Next.js mock server for BMKG{"'"}s{" "}
            <code className="rounded bg-zinc-200 px-1 py-0.5 text-sm dark:bg-zinc-800">
              gempaterkini.json
            </code>{" "}
            endpoint. All data lives in memory.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href="/configure"
            className="group rounded-2xl border border-zinc-200 bg-white p-6 text-left shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h2 className="text-xl font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
              Configure Events
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Drop pins on the map to add earthquakes. Edit magnitude, depth,
              region, and tsunami potential.
            </p>
          </a>

          <a
            href="/DataMKG/TEWS/gempaterkini.json"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-zinc-200 bg-white p-6 text-left shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h2 className="text-xl font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
              View Mock JSON
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Open the mocked BMKG endpoint in the exact shape your client
              expects.
            </p>
          </a>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4 text-left dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Endpoint
          </p>
          <code className="mt-1 block text-sm text-zinc-800 dark:text-zinc-200">
            GET /DataMKG/TEWS/gempaterkini.json
          </code>
        </div>
      </main>
    </div>
  );
}
