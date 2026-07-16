import { getGempaStore } from "@/lib/store";
import { CreateGempaInput } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getGempaStore();
  return Response.json({ gempa: store.getAll() });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    action?: "reset";
    lat?: number;
    lng?: number;
    magnitude?: number;
    kedalaman?: number;
    wilayah?: string;
    potensi?: string;
    tanggal?: string;
    jam?: string;
  };

  if (body.action === "reset") {
    const store = getGempaStore();
    store.reset();
    return Response.json({ ok: true, gempa: store.getAll() });
  }

  if (
    body.lat === undefined ||
    body.lng === undefined ||
    body.magnitude === undefined ||
    body.kedalaman === undefined ||
    !body.wilayah ||
    !body.potensi
  ) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const input: CreateGempaInput = {
    lat: Number(body.lat),
    lng: Number(body.lng),
    magnitude: Number(body.magnitude),
    kedalaman: Number(body.kedalaman),
    wilayah: String(body.wilayah),
    potensi: String(body.potensi),
    tanggal: body.tanggal,
    jam: body.jam,
  };

  const store = getGempaStore();
  const created = store.add(input);
  return Response.json({ ok: true, gempa: created }, { status: 201 });
}
