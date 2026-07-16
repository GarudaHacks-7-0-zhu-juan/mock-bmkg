"use client";

import { useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Popup,
} from "react-leaflet";
import { Icon, LatLng, divIcon } from "leaflet";
import { Gempa } from "@/lib/types";

interface MapClientProps {
  pins: Gempa[];
  selectedId: string | null;
  onAdd: (lat: number, lng: number) => void;
  onMove: (id: string, lat: number, lng: number) => void;
  onSelect: (id: string) => void;
}

const defaultIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const selectedIcon = divIcon({
  className: "custom-selected-marker",
  html: `<div style="background:#ef4444;width:100%;height:100%;border-radius:50%;border:3px solid white;box-shadow:0 0 0 2px #ef4444;"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function ClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function DraggableMarker({
  pin,
  selected,
  onMove,
  onSelect,
}: {
  pin: Gempa;
  selected: boolean;
  onMove: (id: string, lat: number, lng: number) => void;
  onSelect: (id: string) => void;
}) {
  const [lat, lng] = useMemo(() => {
    const [a, b] = pin.Coordinates.split(",");
    return [parseFloat(a ?? "0"), parseFloat(b ?? "0")];
  }, [pin.Coordinates]);

  return (
    <Marker
      position={new LatLng(lat, lng)}
      icon={selected ? selectedIcon : defaultIcon}
      draggable
      eventHandlers={{
        dragend(e) {
          const pos = (e.target as L.Marker).getLatLng();
          onMove(pin.id, pos.lat, pos.lng);
        },
        click() {
          onSelect(pin.id);
        },
      }}
    >
      <Popup>
        <div className="space-y-1 text-sm">
          <p className="font-semibold">M {pin.Magnitude}</p>
          <p>{pin.Wilayah}</p>
          <p className="text-muted-foreground">
            {pin.Lintang}, {pin.Bujur}
          </p>
        </div>
      </Popup>
    </Marker>
  );
}

export default function MapClient({
  pins,
  selectedId,
  onAdd,
  onMove,
  onSelect,
}: MapClientProps) {
  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
      <MapContainer
        center={new LatLng(-2.5, 118)}
        zoom={5}
        scrollWheelZoom
        className="h-full w-full"
        minZoom={3}
        maxZoom={18}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler
          onClick={(lat, lng) => {
            onAdd(lat, lng);
          }}
        />
        {pins.map((pin) => (
          <DraggableMarker
            key={pin.id}
            pin={pin}
            selected={pin.id === selectedId}
            onMove={onMove}
            onSelect={onSelect}
          />
        ))}
      </MapContainer>
    </div>
  );
}
