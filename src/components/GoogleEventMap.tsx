/// <reference types="google.maps" />
import { useEffect, useMemo, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import type { CivicEvent, Zone } from "@/lib/mock-data";

const API_KEY =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) ||
  (import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY as string | undefined);

const CHANNEL = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID as
  | string
  | undefined;

let optionsSet = false;
function ensureOptions() {
  if (optionsSet || !API_KEY) return;
  setOptions({
    key: API_KEY,
    v: "weekly",
    libraries: [],
    channel: CHANNEL,
  });
  optionsSet = true;
}

function parseCoords(coords: string): { lat: number; lng: number } {
  const [lat, lng] = coords.split(",").map((s) => parseFloat(s.trim()));
  return { lat, lng };
}

function markerIcon(isFull: boolean): google.maps.Icon {
  const slash = isFull
    ? `<line x1="14" y1="40" x2="40" y2="14" stroke="#EF4444" stroke-width="3.5" stroke-linecap="round"/>`
    : "";
  const opacity = isFull ? 0.55 : 1;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='54' height='54' viewBox='0 0 54 54'>
    <circle cx='27' cy='27' r='22' fill='white' stroke='#00D2C4' stroke-width='3.5' opacity='${opacity}'/>
    ${slash}
  </svg>`;
  const url = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  return {
    url,
    scaledSize: new google.maps.Size(44, 44),
    anchor: new google.maps.Point(22, 22),
    labelOrigin: new google.maps.Point(22, 22),
  };
}

export function GoogleEventMap({
  events,
  zone,
  radiusKm,
  center,
  onPinClick,
  selectedId,
  reducedMotion = false,
}: {
  events: CivicEvent[];
  zone: Zone;
  radiusKm: number;
  /** Effective map center. Falls back to zone.center if null. */
  center?: { lat: number; lng: number } | null;
  onPinClick: (id: string) => void;
  selectedId: string | null;
  reducedMotion?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const circleRef = useRef<google.maps.Circle | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effective = center ?? { lat: zone.center[0], lng: zone.center[1] };

  useEffect(() => {
    if (!API_KEY) {
      setError("Google Maps API key required.");
      return;
    }
    if (!containerRef.current) return;
    ensureOptions();
    let cancelled = false;
    (async () => {
      try {
        const [{ Map }] = await Promise.all([
          importLibrary("maps"),
          importLibrary("core"),
        ]);
        if (cancelled || !containerRef.current) return;
        mapRef.current = new Map(containerRef.current, {
          center: effective,
          zoom: 14,
          disableDefaultUI: false,
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER,
          },
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          gestureHandling: "greedy",
          clickableIcons: false,
          styles: calmCivicStyle,
        });
        setReady(true);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load Google Maps";
        setError(msg);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    mapRef.current.panTo(effective);
  }, [ready, effective.lat, effective.lng]);

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    if (circleRef.current) circleRef.current.setMap(null);
    circleRef.current = new google.maps.Circle({
      map: mapRef.current,
      center: effective,
      radius: radiusKm * 1000,
      strokeColor: "#EF4444",
      strokeOpacity: 0.7,
      strokeWeight: 1.5,
      fillColor: "#EF4444",
      fillOpacity: 0.06,
      clickable: false,
    });
  }, [ready, effective.lat, effective.lng, radiusKm]);

  const pinData = useMemo(
    () => events.map((e) => ({ ...parseCoords(e.coords), e })),
    [events]
  );

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    pinData.forEach(({ lat, lng, e }) => {
      const isFull = e.currentRegistration >= e.maxCapacity;
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: mapRef.current!,
        title: e.title,
        icon: markerIcon(isFull),
        label: { text: e.icon, fontSize: "18px" },
        zIndex: selectedId === e.id ? 999 : 1,
        animation:
          !reducedMotion && selectedId === e.id
            ? google.maps.Animation.BOUNCE
            : undefined,
      });
      marker.addListener("click", () => onPinClick(e.id));
      markersRef.current.push(marker);
    });
  }, [ready, pinData, onPinClick, selectedId, reducedMotion]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6 text-center bg-canvas">
        <div>
          <p className="text-forest font-semibold">{error}</p>
          <p className="text-[12px] text-forest/60 mt-2">
            Set <code>VITE_GOOGLE_MAPS_API_KEY</code> or connect Google Maps Platform.
          </p>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className="w-full h-full" />;
}

const calmCivicStyle: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#f4fbf7" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#0B4F37" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#e6f3ec" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#cfe9f4" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#dff1e3" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#cfe2d7" }] },
];
