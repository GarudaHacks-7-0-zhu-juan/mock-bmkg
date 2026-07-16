import { getGempaStore } from "@/lib/store";
import { Gempa } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json()) as { gempa?: Gempa[] };
  if (!Array.isArray(body.gempa)) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const store = getGempaStore();
  store.replace(body.gempa);
  return Response.json({ ok: true, gempa: store.getAll() });
}
