# Codex Implementation Prompt: Finish Civic Routes Supabase Backend

## Context

This repository contains two tracks:

1. The original Lovable/TanStack source under `src/` with Supabase service files and migrations.
2. A deployed fallback prototype in `public/index.html` that currently uses a mostly local prototype flow.

The goal is to convert Civic Routes into a real shared Supabase-backed app, not a browser-only localStorage prototype.

Supabase migrations are expected to be applied already. If not, inspect and apply files in `supabase/migrations/` in timestamp order before implementing frontend logic.

Core tables expected from migrations:

- `public.users`
- `public.organisers`
- `public.events`
- `public.event_registrations`
- `public.user_interests`
- `public.team_assignments`
- `public.check_ins`
- `public.recommendations`
- `public.municipality_metrics`
- `public.ai_event_proposals`
- `public.location_zones`
- `public.interests`

The important resident profile columns are:

- `auth_user_id`
- `age_range`
- `gender_optional`
- `location_zone_id`
- `radius_km`
- `onboarding_complete`
- `selected_interests`
- `notification_preferences`
- `accessibility_preferences`
- `privacy_settings`

The important organiser columns are:

- `auth_user_id`
- `name`
- `type`
- `verification_status`
- `municipality_zone_id`

The important event columns are:

- `organiser_id`
- `organiser_name`
- `organiser_verified`
- `title`
- `category`
- `subcategory`
- `description`
- `zone_id`
- `location_name`
- `address`
- `lat`
- `lng`
- `start_time`
- `end_time`
- `status`
- `min_capacity`
- `max_capacity`
- `current_registration`
- `beginner_friendly`
- `skill_level`
- `accessibility_info`
- `equipment_needed`
- `people_usually_come_alone`
- `welcome_host_present`
- `team_based`
- `team_size`
- `spectators_allowed`
- `bring_friend_allowed`
- `recommendation_reason`

The important registration columns are:

- `event_id`
- `user_id`
- `participation_state`
- `bring_friend`
- `checked_in`

## Required environment variables

Use these frontend-safe variables only:

```txt
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_PROJECT_ID
```

Do not expose a Supabase service role key in frontend code.

Keep OpenStreetMap/Leaflet. Do not use Google Maps.

## Main goal

Make the app operational across browsers/devices:

- Organiser creates event on one device.
- Event is inserted into Supabase `public.events`.
- Resident opens app on another device.
- Resident sees the event.
- Resident chooses a participation status.
- Registration is upserted into `public.event_registrations`.
- Event registration count updates through the database trigger or a safe refresh.
- Organiser sees updated sign-up count for their own event.

## Implementation requirements

### 1. Use the real app structure if feasible

Prefer implementing this in the existing React/TanStack files under `src/` rather than expanding the fallback `public/index.html`.

If the TanStack/Vercel build remains broken, implement the same logic in `public/index.html` as a temporary hackathon fallback, but keep the code clean and documented.

### 2. Supabase client

Create or reuse a frontend Supabase client using:

```ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

Add clear UI error text if either env var is missing.

### 3. Auth flow

Add Auth with two account types:

- resident
- organiser

Signup should pass role metadata:

```ts
await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      role: 'resident', // or 'organiser'
      name,
      type: 'community_center',
      zone_id: 'kralingen'
    }
  }
})
```

Signin uses email/password.

On auth state change:

1. Get session.
2. Get user.
3. Load app context from `users` or `organisers` based on metadata/profile row.
4. Route to the correct flow.

If email confirmation is enabled and the user is not yet confirmed, show a calm message telling them to confirm their email.

### 4. Resident onboarding gate

This is currently missing and must be fixed.

After resident signup/signin:

```ts
if (role === 'resident' && users.onboarding_complete !== true) {
  showResidentOnboarding()
} else {
  showMap()
}
```

Do not show Events/Map/Settings before onboarding is complete.

Resident onboarding must collect:

- `age_range`: `18–25`, `25–35`, `35–45`, `45–60`, `60+`
- `gender_optional`: `Male`, `Female`, `Other`, `Prefer not to say`
- `location_zone_id`: `kralingen`, `centrum`, `noord`, `west`, `zuid`, `delfshaven`, `crooswijk`
- `radius_km`: `1`, `2`, `5`, `10`, `20`
- `selected_interests`: `Sports`, `Board Games`, `Literature`, `Music`, `Dance`, `Gaming`, `Cooking`, `Walking`
- `notification_preferences`: object with `nearby`, `recommended`, `startingSoon`, `quiet`, `team`, `weekend`

On save:

```ts
await supabase
  .from('users')
  .update({
    age_range,
    gender_optional,
    location_zone_id,
    radius_km,
    selected_interests,
    notification_preferences,
    onboarding_complete: true
  })
  .eq('id', resident.id)
```

Then reload profile and route to Map.

### 5. Organiser flow

Organisers skip resident onboarding.

Organisers only see:

- Dashboard
- Create Event
- My Events

Residents only see:

- Events
- Map
- Settings

For prototype purposes, organisers are treated as verified. Either:

- set `verification_status = 'verified'` after organiser signup, or
- use a UI-level `Verified organiser` label while retaining current DB status.

Do not allow residents to access event creation screens.

### 6. Organiser event creation

Event creation inserts into `public.events`.

The organiser ID must come from the current organiser row:

```ts
const organiser = await getCurrentOrganiser()
```

Insert required fields:

```ts
await supabase.from('events').insert({
  organiser_id: organiser.id,
  organiser_name: organiser.name,
  organiser_verified: true,
  title,
  category,
  subcategory,
  description,
  zone_id,
  location_name,
  address,
  lat,
  lng,
  start_time,
  end_time,
  status: 'scheduled',
  min_capacity,
  max_capacity,
  current_registration: 0,
  beginner_friendly,
  skill_level,
  age_range_min: 18,
  age_range_max: 99,
  accessibility_info,
  equipment_needed,
  people_usually_come_alone,
  welcome_host_present,
  verified_organiser_required: true,
  team_based,
  team_size,
  spectators_allowed,
  bring_friend_allowed,
  recommendation_reason
})
```

After insert:

- show confirmation
- navigate to My Events
- refresh events list

### 7. Resident events/map

Residents fetch visible events from Supabase:

```ts
const { data: events } = await supabase
  .from('events')
  .select('*')
  .in('status', ['open', 'scheduled', 'live', 'minimum_reached', 'almost_full'])
```

Filter client-side by radius/location for the prototype.

Sort recommendations by:

1. matching selected interests
2. distance from selected location
3. available capacity
4. upcoming time if available

Do not recommend full events as normal joinable events.

### 8. Participation status

Allowed main states:

- `Spectator`
- `Join`
- `Interested`
- `Maybe`
- `Remind me later`

Only one main status can be selected at a time.

`Bring a friend` is a separate boolean toggle.

Upsert into `public.event_registrations`:

```ts
await supabase
  .from('event_registrations')
  .upsert({
    event_id: event.id,
    user_id: resident.id,
    participation_state: selectedStatus,
    bring_friend: bringFriend
  }, {
    onConflict: 'event_id,user_id'
  })
```

After upsert:

- refresh `event_registrations` for the current resident
- refresh `events` so `current_registration` updates
- show a calm confirmation message

### 9. Organiser sign-up counts

Organiser My Events must show only events where:

```ts
event.organiser_id === organiser.id
```

For each organiser event, show:

- title
- time
- location
- current_registration / max_capacity
- status
- basic requirements

To inspect sign-up counts:

```ts
await supabase
  .from('event_registrations')
  .select('id, participation_state, bring_friend, checked_in, created_at')
  .eq('event_id', event.id)
```

Do not show public resident profiles or public attendee lists.

### 10. Settings

Resident Settings must save to Supabase:

- hobbies/interests → `users.selected_interests`
- radius → `users.radius_km`
- location → `users.location_zone_id`
- accessibility → `users.accessibility_preferences`
- privacy → `users.privacy_settings`
- notifications → `users.notification_preferences`

Pause recommendations behavior:

- if `privacy_settings.pauseRecs === true`, hide recommendation reasons/cards and show: `Recommendations are paused. You can still search events manually.`

Hide from matching behavior:

- if `privacy_settings.hideFromMatching === true`, do not include the resident in mock AI demand logic.

### 11. Map

Keep OpenStreetMap/Leaflet.

No heat map.

Pins only.

Full events are grey/unavailable.

Available events are active.

Clicking a pin opens event details with:

- Learn More
- Join/status actions
- clickable map location link

### 12. UI restrictions

Do not add:

- heat maps
- emojis
- public profiles
- chat
- ratings
- public attendee lists
- social feed
- follower system
- loneliness-score wording
- diagnosis/clinical language

Keep language calm and civic.

### 13. Testing checklist

Before committing, test:

1. Build passes locally.
2. Resident signup works.
3. Resident onboarding appears before map.
4. Onboarding saves to `public.users`.
5. Resident reaches Map only after onboarding.
6. Organiser signup skips resident onboarding.
7. Organiser can create an event.
8. Created event appears in Supabase `events`.
9. Resident can see the created event from another browser/account.
10. Resident can select `Join`, `Interested`, `Maybe`, `Spectator`, or `Remind me later`.
11. Selecting a new main status replaces the previous one.
12. `Bring a friend` toggles independently.
13. `event_registrations` row is created/updated.
14. `events.current_registration` updates after Join if trigger works.
15. Organiser can see sign-up count.
16. Vercel deployment is Ready.

### 14. If build/deployment fails

Do not revert to the old fake map or BuurtMatch static mockup.

Fix the Vercel build config while preserving:

- Supabase Auth
- Supabase events
- Supabase registrations
- onboarding gate
- OpenStreetMap/Leaflet
- separate resident/organiser interfaces

### 15. Final commit message

Use:

```txt
Implement Supabase-backed resident and organiser flows
```
