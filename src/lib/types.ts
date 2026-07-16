export interface Gempa {
  id: string;
  Tanggal: string;
  Jam: string;
  DateTime: string;
  Coordinates: string;
  Lintang: string;
  Bujur: string;
  Magnitude: string;
  Kedalaman: string;
  Wilayah: string;
  Potensi: string;
}

export interface CreateGempaInput {
  lat: number;
  lng: number;
  magnitude: number;
  kedalaman: number;
  wilayah: string;
  potensi: string;
  tanggal?: string;
  jam?: string;
}

export interface UpdateGempaInput {
  magnitude?: number;
  kedalaman?: number;
  wilayah?: string;
  potensi?: string;
  tanggal?: string;
  jam?: string;
}
