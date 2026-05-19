import { useSyncExternalStore } from "react";

export type SearchedLocation = {
  lat: number;
  lng: number;
  label: string;
} | null;

const KEY = "haven.searchedLocation";
const listeners = new Set<() => void>();

function read(): SearchedLocation {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SearchedLocation) : null;
  } catch {
    return null;
  }
}

export function setSearchedLocation(loc: SearchedLocation) {
  if (typeof window === "undefined") return;
  if (loc) window.localStorage.setItem(KEY, JSON.stringify(loc));
  else window.localStorage.removeItem(KEY);
  listeners.forEach((l) => l());
}

export function useSearchedLocation(): SearchedLocation {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => null,
  );
}

export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
