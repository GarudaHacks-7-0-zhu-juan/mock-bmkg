"use client";

import { Gempa, UpdateGempaInput } from "@/lib/types";

interface PinFormProps {
  pin: Gempa;
  onChange: (id: string, values: UpdateGempaInput) => void;
  onDelete: (id: string) => void;
}

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

function wibDateString(dateTime: string): string {
  return new Date(new Date(dateTime).getTime() + WIB_OFFSET_MS)
    .toISOString()
    .slice(0, 10);
}

function wibTimeString(dateTime: string): string {
  return new Date(new Date(dateTime).getTime() + WIB_OFFSET_MS)
    .toISOString()
    .slice(11, 19);
}

export default function PinForm({ pin, onChange, onDelete }: PinFormProps) {
  const [lat, lng] = pin.Coordinates.split(",");
  const tanggal = wibDateString(pin.DateTime);
  const jam = wibTimeString(pin.DateTime);

  const handleNow = () => {
    onChange(pin.id, { jam: wibTimeString(new Date().toISOString()) });
  };

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
            Edit Pin
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {pin.Lintang}, {pin.Bujur}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onDelete(pin.id)}
          className="rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100 dark:bg-red-950 dark:text-red-400"
        >
          Delete
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Latitude
          </label>
          <input
            readOnly
            value={lat ?? ""}
            className="w-full rounded-md border border-zinc-300 bg-zinc-50 px-2 py-1 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Longitude
          </label>
          <input
            readOnly
            value={lng ?? ""}
            className="w-full rounded-md border border-zinc-300 bg-zinc-50 px-2 py-1 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Magnitude
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={parseFloat(pin.Magnitude)}
            onChange={(e) =>
              onChange(pin.id, { magnitude: parseFloat(e.target.value) })
            }
            className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Kedalaman (km)
          </label>
          <input
            type="number"
            min="0"
            value={parseFloat(pin.Kedalaman)}
            onChange={(e) =>
              onChange(pin.id, { kedalaman: parseFloat(e.target.value) })
            }
            className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
          Wilayah
        </label>
        <input
          type="text"
          value={pin.Wilayah}
          onChange={(e) => onChange(pin.id, { wilayah: e.target.value })}
          className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
          Potensi
        </label>
        <select
          value={pin.Potensi}
          onChange={(e) => onChange(pin.id, { potensi: e.target.value })}
          className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
        >
          <option>Tidak berpotensi tsunami</option>
          <option>Berpotensi tsunami</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Tanggal
          </label>
          <input
            type="date"
            value={tanggal}
            onChange={(e) => onChange(pin.id, { tanggal: e.target.value })}
            className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Jam (WIB)
          </label>
          <div className="flex gap-2">
            <input
              type="time"
              step="1"
              value={jam}
              onChange={(e) => onChange(pin.id, { jam: e.target.value })}
              className="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
            />
            <button
              type="button"
              onClick={handleNow}
              className="shrink-0 rounded-md border border-zinc-300 px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
