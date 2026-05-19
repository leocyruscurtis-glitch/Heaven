# Fix V1: Map, Events, Settings

Scope: minimal, surgical changes only. Keep current visuals, colors, and layout.

## Provider note (read first)

- Map = **Google Maps JS API** via the existing Lovable Google Maps connector (`VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY`). Already configured.
- Geocoding/autocomplete = **Places API (New)** through the connector gateway (`/places/v1/places:autocomplete` + `:searchText`). Goes through `LOVABLE_API_KEY`, no separate billing setup needed by the user.
- Browser autocomplete will be implemented as a tiny TanStack server route `/api/places/autocomplete` so the gateway call stays server-side.

---

## 1. Map (`src/routes/index.tsx`, `src/components/GoogleEventMap.tsx`)

**Availability marker bug**
- In `GoogleEventMap.tsx`, change `markerIcon(e.isLive)` → `markerIcon({ isFull: e.currentRegistration >= e.maxCapacity })`.
- Only render the red slash + 0.5 opacity when `isFull === true`. Available events always render solid.

**Remove heat map completely**
- Delete `viewMode` state, the `"pins" | "heat" | "both"` toggle UI, and the `ViewMode` export.
- In `GoogleEventMap.tsx`: remove `heatRef`, the heatmap `useEffect`, the `visualization` library import, and `importLibrary("visualization")`. Always render pins.

**Learn More vs Join on the pin card**
- In `EventDetailCard` replace the two-button row with: primary **Join** (calls existing flow) + secondary **Learn more** that navigates to `/event/$id` without registering. Drop the current "Just watch" duplicate (it called the same handler as Join).

**Adjustable radius**
- Add a compact pill selector (1 / 2 / 5 / 10 / 20 km) inline in the top bar where `{prefs.radiusKm}km` is shown today. Tap opens a small popover.
- Persist via existing `setPrefs({ radiusKm })`. Filtering in `index.tsx`, `events.tsx`, and `GoogleEventMap` already reads `prefs.radiusKm`, so this propagates.
- Bump max in `settings.tsx` range from 10 → 20 to stay consistent.

**Search updates map center**
- Add `searchedLocation: { lat, lng, label } | null` to local state in `MapHome`.
- Pass an effective center to `GoogleEventMap` (`searchedLocation ?? zone.center`). Zone is only the fallback.
- Replace zone-list `LocationOverlay` with a Places-backed search: type → call `/api/places/autocomplete` → on select, call `:searchText` for the lat/lng → set `searchedLocation` → recenter map + filter events by distance from that point within `radiusKm`.
- Add a "Clear search location" chip that returns to zone-based view.

**Search bar vs zoom controls overlap**
- Move Google's zoom control to `position: TOP_LEFT` and shift our top search bar slightly so the right side stays clear; or set `zoomControlOptions.position: RIGHT_CENTER` (vertically centred, well below the top bar and above the bottom hobby search). Verified visually on the 3 viewports.

**Autocomplete server route**
- New `src/routes/api/places.autocomplete.ts` and `src/routes/api/places.search.ts`. Both validate input with zod, call the gateway with `Authorization: Bearer LOVABLE_API_KEY` + `X-Connection-Api-Key: GOOGLE_MAPS_API_KEY`, return JSON. Bias results to Rotterdam by passing `locationBias` around the current map center.

**Filtering / recommendations consistency**
- In `events.tsx`, when a searched location is active (via a small shared store or query param), score events by distance from that point instead of zone match. Always re-filter by `radiusKm`.

**Fallbacks**
- If the maps script fails, keep the existing "Google Maps API key required" panel.
- If geolocation is denied, fall back silently to the user's zone center.
- If autocomplete fetch fails, show "No suggestions — try a broader area" inside the dropdown.

---

## 2. Events (`src/routes/events.tsx`, `src/routes/event.$id.tsx`, `src/components/EventCard.tsx`)

**Default join state**
- Verified: `registrations` come from Supabase per-user, no auto-seed. No change needed beyond making sure `EventCard`/detail never highlight a state without a real `reg` row. Already correct.

**Single-select main status + Bring-a-friend toggle**
- Extend the registration record (already exists in DB as `bring_friend` boolean) and update `registrationService.setState` to accept a separate `bringFriend` flag.
- In `event.$id.tsx`:
  - Split `SOFT` into `MAIN = [Spectator, Join, Interested, Maybe, Remind me later]` and a separate `Bring a friend` toggle row.
  - Clicking a MAIN button calls `setRegistration(eventId, state, { bringFriend: reg?.bring_friend ?? false })`.
  - "Bring a friend" is rendered as a toggle that calls `setRegistration(eventId, reg?.state ?? "Interested", { bringFriend: !reg?.bring_friend })` without changing the main state.

**Remove loneliness score copy**
- Delete the "no loneliness scores" sentence from `events.tsx` privacy card.
- Leave underlying data alone; the copy only appears in onboarding/settings/municipality which are out-of-scope per spec ("from events").

**Back arrow → Events tab**
- In `event.$id.tsx`, change the back `Link to="/"` → `Link to="/events"`. Use `useRouter().history.back()` first if available to preserve scroll, otherwise navigate to `/events`.

**Clickable location**
- Wrap the "Where" `Info` value in `<a target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}>` so it opens in a new tab. Same on the map detail card.

**Recommended events — show all over time**
- Replace `.slice(0, 4)` with a `useState(4)` `visibleCount` and a "Show more" button that adds 4 each click until all scored events are listed.
- Sorting already uses interest match + zone + beginner-friendly + radius. Add `+1` for `openSpots > 0` and `−10` for `status === "full"` so full events sink but stay reachable. Never filter them out.

**Hobby demand fallback (Municipality)**
- In `municipality.tsx`, replace the static `hobbyTrends` rendering with a computed list from real signals: count `user_interests` per `interest_name` joined with event counts. If the resulting list is empty, render a single neutral row: "Demand data not available yet." No fake percentages.

---

## 3. Settings (`src/routes/settings.tsx`)

**Replace interest chips with link card**
- Remove the chips block. Add one `LinkCard` titled "Change hobby preferences" → `/interests` (already exists and supports broad + sub-interests).
- Subtitle: "Update the activities used for recommendations."

**Make accessibility actually apply**
- Move the `prefs.accessibility` application into `AppProvider` via a `useEffect` that sets attributes/classes on `document.documentElement`:
  - `data-reduced-motion`, `data-high-contrast`, `data-colorblind` boolean attrs.
  - `style.fontSize = ${fontScale * 16}px` on `<html>` (steps 1.0 / 1.1 / 1.2 / 1.3 / 1.4).
- Add CSS in `src/styles.css`:
  - `[data-reduced-motion="true"] *{ animation: none !important; transition: none !important; }` and disable the marker `BOUNCE` animation by reading the flag inside `GoogleEventMap`.
  - `[data-high-contrast="true"]` boosts text colour, border thickness, and card outlines via CSS variable overrides.
  - `[data-colorblind="true"]` shows a small text label badge ("Live" / "Scheduled" / "Full") next to status pills — pill colors stop being the only signal.
- Adjust the font-size slider to snap to 1.0–1.4 in 0.1 steps.

**Make privacy actually work**
- Pause recommendations: already gated in `events.tsx` (`prefs.privacy.pauseRecs`). Also gate the map's "Recommended" hobby chips and the matching server function. Replace the existing "Add interests in Settings…" placeholder with the spec copy: "Recommendations are paused. You can still search events manually."
- Hide from matching: in `src/lib/matching.functions.ts`, exclude users where `privacy_settings.hideFromMatching === true` from the cluster query. Show the explanatory line in Settings under the toggle.
- Delete my data: replace `window.confirm()` with a modal (reuse the existing bottom-sheet style from `event.$id.tsx` confirm dialog). On confirm, call existing `deleteMyData()` (already clears profile, interests, registrations) and route to `/onboarding` via auth. Show a one-time toast "Your data has been deleted."

**Persistence**
- All of the above already persist through `userService.update` → Supabase. No new tables.

**Copy pass**
- Remove "loneliness score" wherever it appears in `settings.tsx`, `onboarding.tsx`, `municipality.tsx`, `events.tsx`. Use the calm civic copy from the spec.

---

## Files touched

```text
src/routes/index.tsx                      (radius selector, searched location, learn-more button, no view toggle)
src/routes/events.tsx                     (load-more, loneliness copy, scoring tweak)
src/routes/event.$id.tsx                  (back→/events, location link, main+bring-friend split)
src/routes/settings.tsx                   (hobby link card, slider range, delete modal, copy)
src/routes/municipality.tsx               (real hobby demand or fallback, copy)
src/routes/onboarding.tsx                 (copy)
src/components/GoogleEventMap.tsx         (marker bug, remove heat, zoom position, dynamic center, reduced-motion)
src/components/EventCard.tsx              (colorblind label badge)
src/lib/app-store.tsx                     (apply accessibility flags to <html>)
src/lib/matching.functions.ts             (respect hideFromMatching)
src/services/registrationService.ts       (bringFriend flag separate from state)
src/services/types.ts                     (ParticipationState already correct)
src/styles.css                            (a11y CSS hooks)
src/routes/api/places.autocomplete.ts     (NEW server route)
src/routes/api/places.search.ts           (NEW server route)
```

No schema migration needed — `event_registrations.bring_friend` and `users.accessibility_preferences`/`privacy_settings` already exist.

## Verification checklist (run after build)

- Available events render solid; only full events show the red slash.
- View toggle gone; no `visualization` library code remains.
- Pin card has Join + Learn more (no auto-join on Learn more).
- Radius selector visible with 1/2/5/10/20; filters update.
- Typing a Rotterdam street/neighbourhood shows suggestions and recenters the map.
- Zoom controls visible and clickable on mobile/tablet/desktop, no overlap with search.
- Recommended list reaches every event via "Show more".
- Hobby demand uses real counts or shows the fallback row.
- Back arrow from event detail returns to `/events`.
- Location link in event detail opens Google Maps in a new tab.
- One main status at a time + "Bring a friend" is independent.
- Font-size, reduced-motion, high-contrast, colorblind visibly affect the whole app.
- Pause recs and Hide-from-matching change behaviour.
- Delete data shows a modal and ends at onboarding.
