"use client";

import { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { Gempa, UpdateGempaInput, CreateGempaInput } from "@/lib/types";
import { toGempa, applyUpdate } from "@/lib/format";
import PinForm from "./PinForm";

const MapClient = dynamic(() => import("./MapClient"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-sm text-zinc-500">Loading map…</p>
    </div>
  ),
});

interface ConfigureClientProps {
  initialPins: Gempa[];
}

function generateId() {
  return `gempa-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function ConfigureClient({ initialPins }: ConfigureClientProps) {
  const [pins, setPins] = useState<Gempa[]>(initialPins);
  const [draftPins, setDraftPins] = useState<Gempa[]>(initialPins);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  const hasChanges = useMemo(() => {
    return JSON.stringify(pins) !== JSON.stringify(draftPins);
  }, [pins, draftPins]);

  const handleAdd = useCallback((lat: number, lng: number) => {
    const input: CreateGempaInput = {
      lat,
      lng,
      magnitude: 5.0,
      kedalaman: 10,
      wilayah: "Wilayah baru",
      potensi: "Tidak berpotensi tsunami",
    };
    const created = toGempa(generateId(), input);
    setDraftPins((prev) => [created, ...prev]);
    setSelectedId(created.id);
  }, []);

  const handleMove = useCallback((id: string, lat: number, lng: number) => {
    setDraftPins((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const [oldLat, oldLng] = p.Coordinates.split(",").map(parseFloat);
        if (oldLat === lat && oldLng === lng) return p;
        return toGempa(p.id, {
          lat,
          lng,
          magnitude: parseFloat(p.Magnitude),
          kedalaman: parseFloat(p.Kedalaman),
          wilayah: p.Wilayah,
          potensi: p.Potensi,
          tanggal: p.DateTime,
          jam: p.Jam,
        });
      })
    );
  }, []);

  const handleChange = useCallback((id: string, values: UpdateGempaInput) => {
    setDraftPins((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const [lat, lng] = p.Coordinates.split(",").map(parseFloat);
        return applyUpdate(p, lat, lng, values);
      })
    );
  }, []);

  const handleDelete = useCallback((id: string) => {
    setDraftPins((prev) => prev.filter((p) => p.id !== id));
    setSelectedId((prev) => (prev === id ? null : prev));
  }, []);

  const handlePublish = useCallback(async () => {
    setPublishing(true);
    try {
      const res = await fetch("/api/gempa/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gempa: draftPins }),
      });
      if (!res.ok) return;
      const data = (await res.json()) as { gempa: Gempa[] };
      setPins(data.gempa);
      setDraftPins(data.gempa);
    } finally {
      setPublishing(false);
    }
  }, [draftPins]);

  const handleReset = useCallback(async () => {
    const res = await fetch("/api/gempa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reset" }),
    });
    if (!res.ok) return;
    const data = (await res.json()) as { gempa: Gempa[] };
    setPins(data.gempa);
    setDraftPins(data.gempa);
    setSelectedId(null);
  }, []);

  const selectedPin = draftPins.find((p) => p.id === selectedId) ?? null;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Mock BMKG Earthquake Configurator
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Click anywhere on the map to add a pin. Drag pins to move them.
              Publish when ready.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/DataMKG/TEWS/gempaterkini.json"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              View JSON
            </a>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Reset to Seed
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={!hasChanges || publishing}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {publishing ? "Publishing…" : "Publish Changes"}
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 overflow-hidden p-4 lg:flex-row">
        <div className="relative flex-1 min-h-[16rem] lg:min-h-0">
          <MapClient
            pins={draftPins}
            selectedId={selectedId}
            onAdd={handleAdd}
            onMove={handleMove}
            onSelect={setSelectedId}
          />
        </div>

        <aside className="w-full shrink-0 overflow-y-auto lg:w-96">
          {selectedPin ? (
            <PinForm
              key={selectedPin.id}
              pin={selectedPin}
              onChange={handleChange}
              onDelete={handleDelete}
            />
          ) : (
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {draftPins.length === 0
                  ? "No earthquake events yet. Click the map to add one."
                  : "Select a pin on the map to edit its details."}
              </p>
              <p className="mt-2 text-xs text-zinc-500">
                {draftPins.length} event(s) configured
                {hasChanges && (
                  <span className="ml-1 font-medium text-blue-600 dark:text-blue-400">
                    (unsaved)
                  </span>
                )}
              </p>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}

