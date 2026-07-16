import { Gempa, CreateGempaInput, UpdateGempaInput } from "./types";
import { seedGempa } from "./seed";
import { applyUpdate, toGempa } from "./format";

declare global {
  var __gempaStore: GempaStore | undefined;
}

function generateId() {
  return `gempa-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

class GempaStore {
  private items: Gempa[];

  constructor() {
    this.items = structuredClone(seedGempa);
  }

  getAll(): Gempa[] {
    return this.items;
  }

  getById(id: string): Gempa | undefined {
    return this.items.find((g) => g.id === id);
  }

  add(input: CreateGempaInput): Gempa {
    const gempa = toGempa(generateId(), input);
    this.items.unshift(gempa);
    return gempa;
  }

  update(id: string, input: UpdateGempaInput): Gempa | undefined {
    const index = this.items.findIndex((g) => g.id === id);
    if (index === -1) return undefined;

    const existing = this.items[index];
    const [latStr, lngStr] = existing.Coordinates.split(",");
    const lat = parseFloat(latStr ?? "0");
    const lng = parseFloat(lngStr ?? "0");
    const updated = applyUpdate(existing, lat, lng, input);
    this.items[index] = updated;
    return updated;
  }

  updateCoordinates(id: string, lat: number, lng: number): Gempa | undefined {
    const index = this.items.findIndex((g) => g.id === id);
    if (index === -1) return undefined;

    const existing = this.items[index];
    const updated = applyUpdate(existing, lat, lng, {});
    this.items[index] = updated;
    return updated;
  }

  remove(id: string): Gempa | undefined {
    const index = this.items.findIndex((g) => g.id === id);
    if (index === -1) return undefined;

    const [removed] = this.items.splice(index, 1);
    return removed;
  }

  reset(): Gempa[] {
    this.items = structuredClone(seedGempa);
    return this.items;
  }

  replace(items: Gempa[]): Gempa[] {
    this.items = structuredClone(items);
    return this.items;
  }
}

const store = globalThis.__gempaStore ?? new GempaStore();
if (process.env.NODE_ENV !== "production") {
  globalThis.__gempaStore = store;
}

export function getGempaStore(): GempaStore {
  return store;
}
