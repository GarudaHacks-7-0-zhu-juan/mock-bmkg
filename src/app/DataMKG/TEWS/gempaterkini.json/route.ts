import { getGempaStore } from "@/lib/store";
import { sanitizeForPublic } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getGempaStore();
  const gempa = store.getAll().map(sanitizeForPublic);
  return Response.json({ Infogempa: { gempa } });
}
