import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const Body = z.object({
  input: z.string().min(1).max(120),
  /** Bias suggestions around this point (lat,lng). Defaults to Rotterdam. */
  bias: z
    .object({ lat: z.number(), lng: z.number(), radius: z.number().min(100).max(50000).optional() })
    .optional(),
});

const GATEWAY = "https://connector-gateway.lovable.dev/google_maps";

export const Route = createFileRoute("/api/places/autocomplete")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const lovableKey = process.env.LOVABLE_API_KEY;
        const mapsKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!lovableKey || !mapsKey) {
          return Response.json({ suggestions: [], error: "Maps connector not configured" }, { status: 500 });
        }
        let parsed;
        try {
          parsed = Body.parse(await request.json());
        } catch (e: any) {
          return Response.json({ suggestions: [], error: "Invalid input" }, { status: 400 });
        }
        const bias = parsed.bias ?? { lat: 51.9225, lng: 4.479, radius: 20000 };
        try {
          const res = await fetch(`${GATEWAY}/places/v1/places:autocomplete`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${lovableKey}`,
              "X-Connection-Api-Key": mapsKey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              input: parsed.input,
              locationBias: {
                circle: {
                  center: { latitude: bias.lat, longitude: bias.lng },
                  radius: bias.radius ?? 20000,
                },
              },
              includedRegionCodes: ["nl"],
            }),
          });
          if (!res.ok) {
            return Response.json({ suggestions: [], error: `Upstream ${res.status}` }, { status: 200 });
          }
          const data: any = await res.json();
          const suggestions = (data.suggestions ?? [])
            .map((s: any) => s.placePrediction)
            .filter(Boolean)
            .slice(0, 6)
            .map((p: any) => ({
              placeId: p.placeId as string,
              primaryText: p.structuredFormat?.mainText?.text ?? p.text?.text ?? "",
              secondaryText: p.structuredFormat?.secondaryText?.text ?? "",
            }));
          return Response.json({ suggestions });
        } catch (e: any) {
          return Response.json({ suggestions: [], error: e?.message ?? "Failed" }, { status: 200 });
        }
      },
    },
  },
});
