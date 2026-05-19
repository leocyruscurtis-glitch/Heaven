import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const Body = z.object({ placeId: z.string().min(1).max(255) });

const GATEWAY = "https://connector-gateway.lovable.dev/google_maps";

export const Route = createFileRoute("/api/places/details")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const lovableKey = process.env.LOVABLE_API_KEY;
        const mapsKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!lovableKey || !mapsKey) {
          return Response.json({ error: "Maps connector not configured" }, { status: 500 });
        }
        let parsed;
        try {
          parsed = Body.parse(await request.json());
        } catch {
          return Response.json({ error: "Invalid input" }, { status: 400 });
        }
        try {
          const res = await fetch(
            `${GATEWAY}/places/v1/places/${encodeURIComponent(parsed.placeId)}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${lovableKey}`,
                "X-Connection-Api-Key": mapsKey,
                "X-Goog-FieldMask": "id,displayName,formattedAddress,location",
              },
            },
          );
          if (!res.ok) {
            return Response.json({ error: `Upstream ${res.status}` }, { status: 200 });
          }
          const data: any = await res.json();
          return Response.json({
            placeId: data.id,
            label: data.displayName?.text ?? data.formattedAddress ?? "",
            address: data.formattedAddress ?? "",
            lat: data.location?.latitude,
            lng: data.location?.longitude,
          });
        } catch (e: any) {
          return Response.json({ error: e?.message ?? "Failed" }, { status: 200 });
        }
      },
    },
  },
});
