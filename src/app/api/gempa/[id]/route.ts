import { getGempaStore } from "@/lib/store";
import { UpdateGempaInput } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await request.json()) as {
    lat?: number;
    lng?: number;
    magnitude?: number;
    kedalaman?: number;
    wilayah?: string;
    potensi?: string;
    tanggal?: string;
    jam?: string;
  };

  const store = getGempaStore();

  if (body.lat !== undefined && body.lng !== undefined) {
    store.updateCoordinates(id, Number(body.lat), Number(body.lng));
  }

  const input: UpdateGempaInput = {};
  if (body.magnitude !== undefined) input.magnitude = Number(body.magnitude);
  if (body.kedalaman !== undefined) input.kedalaman = Number(body.kedalaman);
  if (body.wilayah !== undefined) input.wilayah = String(body.wilayah);
  if (body.potensi !== undefined) input.potensi = String(body.potensi);
  if (body.tanggal !== undefined) input.tanggal = String(body.tanggal);
  if (body.jam !== undefined) input.jam = String(body.jam);

  const updated = store.update(id, input);
  if (!updated) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json({ ok: true, gempa: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const store = getGempaStore();
  const removed = store.remove(id);
  if (!removed) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json({ ok: true });
}
