import { getGempaStore } from "@/lib/store";
import ConfigureClient from "./ConfigureClient";

export const dynamic = "force-dynamic";

export default async function ConfigurePage() {
  const pins = getGempaStore().getAll();
  return <ConfigureClient initialPins={pins} />;
}
