import { Gempa, CreateGempaInput, UpdateGempaInput } from "./types";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

function toWibDate(utcDate: Date): Date {
  return new Date(utcDate.getTime() + WIB_OFFSET_MS);
}

function formatWibDate(wibDate: Date): string {
  const dd = String(wibDate.getUTCDate()).padStart(2, "0");
  const mon = MONTHS[wibDate.getUTCMonth()];
  const yyyy = wibDate.getUTCFullYear();
  return `${dd} ${mon} ${yyyy}`;
}

function formatWibTime(wibDate: Date): string {
  const hh = String(wibDate.getUTCHours()).padStart(2, "0");
  const mm = String(wibDate.getUTCMinutes()).padStart(2, "0");
  const ss = String(wibDate.getUTCSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss} WIB`;
}

function formatUtcDateTime(wibDate: Date): string {
  const realUtc = new Date(wibDate.getTime() - WIB_OFFSET_MS);
  return realUtc.toISOString().replace(".000Z", "+00:00");
}

function parseWibDateTimeInput(
  baseWib: Date,
  tanggal?: string,
  jam?: string
): Date {
  let datePart: string;
  if (tanggal) {
    datePart = tanggal.slice(0, 10);
  } else {
    const yyyy = baseWib.getUTCFullYear();
    const mm = String(baseWib.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(baseWib.getUTCDate()).padStart(2, "0");
    datePart = `${yyyy}-${mm}-${dd}`;
  }

  let timePart: string;
  if (jam) {
    timePart = jam.slice(0, 8);
  } else {
    timePart = `${String(baseWib.getUTCHours()).padStart(2, "0")}:${String(
      baseWib.getUTCMinutes()
    ).padStart(2, "0")}:${String(baseWib.getUTCSeconds()).padStart(2, "0")}`;
  }

  const parsed = new Date(`${datePart}T${timePart}+07:00`);
  if (Number.isNaN(parsed.getTime())) {
    return baseWib;
  }
  return new Date(parsed.getTime() + WIB_OFFSET_MS);
}

function formatDateTime(input?: {
  tanggal?: string;
  jam?: string;
  baseDateTime?: string;
}): {
  tanggal: string;
  jam: string;
  dateTime: string;
} {
  let baseWib: Date;
  if (input?.baseDateTime) {
    baseWib = toWibDate(new Date(input.baseDateTime));
  } else {
    baseWib = toWibDate(new Date());
  }

  if (input?.tanggal !== undefined || input?.jam !== undefined) {
    baseWib = parseWibDateTimeInput(baseWib, input.tanggal, input.jam);
  }

  return {
    tanggal: formatWibDate(baseWib),
    jam: formatWibTime(baseWib),
    dateTime: formatUtcDateTime(baseWib),
  };
}

function formatLat(lat: number): string {
  return `${Math.abs(lat).toFixed(2)} ${lat >= 0 ? "LU" : "LS"}`;
}

function formatLng(lng: number): string {
  return `${Math.abs(lng).toFixed(2)} ${lng >= 0 ? "BT" : "BB"}`;
}

export function toGempa(id: string, input: CreateGempaInput): Gempa {
  const { tanggal, jam, dateTime } = formatDateTime({
    tanggal: input.tanggal,
    jam: input.jam,
  });
  return {
    id,
    Tanggal: tanggal,
    Jam: jam,
    DateTime: dateTime,
    Coordinates: `${input.lat.toFixed(2)},${input.lng.toFixed(2)}`,
    Lintang: formatLat(input.lat),
    Bujur: formatLng(input.lng),
    Magnitude: input.magnitude.toFixed(1),
    Kedalaman: `${input.kedalaman} km`,
    Wilayah: input.wilayah,
    Potensi: input.potensi,
  };
}

export function applyUpdate(
  gempa: Gempa,
  lat: number,
  lng: number,
  input: UpdateGempaInput
): Gempa {
  const updated = { ...gempa };

  if (input.magnitude !== undefined) {
    updated.Magnitude = input.magnitude.toFixed(1);
  }
  if (input.kedalaman !== undefined) {
    updated.Kedalaman = `${input.kedalaman} km`;
  }
  if (input.wilayah !== undefined) {
    updated.Wilayah = input.wilayah;
  }
  if (input.potensi !== undefined) {
    updated.Potensi = input.potensi;
  }
  if (input.tanggal !== undefined || input.jam !== undefined) {
    const { tanggal, jam, dateTime } = formatDateTime({
      baseDateTime: gempa.DateTime,
      tanggal: input.tanggal,
      jam: input.jam,
    });
    updated.Tanggal = tanggal;
    updated.Jam = jam;
    updated.DateTime = dateTime;
  }

  updated.Coordinates = `${lat.toFixed(2)},${lng.toFixed(2)}`;
  updated.Lintang = formatLat(lat);
  updated.Bujur = formatLng(lng);

  return updated;
}

export function sanitizeForPublic(gempa: Gempa): Omit<Gempa, "id"> {
  const { id, ...rest } = gempa;
  void id;
  return rest;
}
