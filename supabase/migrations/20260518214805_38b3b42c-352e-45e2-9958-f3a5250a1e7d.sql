
-- ============================================================
-- BuurtMatch full schema: 14 tables, RLS, signup trigger, seeds
-- ============================================================

-- Enums
create type public.app_role as enum ('resident', 'organiser', 'municipality_admin');
create type public.organiser_type as enum (
  'municipality_department','sports_club','library','school','university',
  'community_center','ngo','neighbourhood_volunteer'
);
create type public.verification_status as enum (
  'not_started','in_progress','awaiting_review','verified','rejected','needs_correction'
);
create type public.event_status as enum (
  'open','live','scheduled','minimum_reached','almost_full','full',
  'at_risk_of_cancellation','cancelled_low_registration','completed'
);
create type public.participation_state as enum (
  'Interested','Maybe','Join','Remind me later','Bring a friend','Spectator'
);

-- ---------- location_zones ----------
create table public.location_zones (
  id text primary key,
  name text not null,
  municipality text not null,
  boundary_coordinates jsonb,
  center_lat numeric not null,
  center_lng numeric not null,
  default_radius_km numeric not null default 2,
  created_at timestamptz not null default now()
);

-- ---------- interests ----------
create table public.interests (
  id text primary key,
  name text not null,
  parent_interest_id text references public.interests(id) on delete cascade,
  category text,
  icon text,
  created_at timestamptz not null default now()
);

-- ---------- users (residents) ----------
create table public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  role app_role not null default 'resident',
  age_range text,
  gender_optional text,
  location_zone_id text references public.location_zones(id),
  radius_km numeric not null default 2,
  onboarding_complete boolean not null default false,
  selected_interests jsonb not null default '[]'::jsonb,
  notification_preferences jsonb not null default
    '{"nearby":true,"recommended":true,"startingSoon":true,"quiet":false,"team":true,"weekend":true}'::jsonb,
  accessibility_preferences jsonb not null default
    '{"fontScale":1,"reducedMotion":false,"highContrast":false,"colorblind":false}'::jsonb,
  privacy_settings jsonb not null default
    '{"pauseRecs":false,"hideFromMatching":false}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- organisers ----------
create table public.organisers (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  role app_role not null default 'organiser',
  name text not null,
  type organiser_type not null default 'community_center',
  email text,
  phone text,
  verification_status verification_status not null default 'not_started',
  municipality_zone_id text references public.location_zones(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- municipality_admins ----------
create table public.municipality_admins (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  role app_role not null default 'municipality_admin',
  name text not null default 'Municipality admin',
  municipality text not null default 'Rotterdam',
  created_at timestamptz not null default now()
);

-- ---------- organiser_verification_steps ----------
create table public.organiser_verification_steps (
  id uuid primary key default gen_random_uuid(),
  organiser_id uuid not null unique references public.organisers(id) on delete cascade,
  email_verified boolean not null default false,
  phone_verified boolean not null default false,
  id_verified boolean not null default false,
  vog_status boolean not null default false,
  kvk_status boolean not null default false,
  ubo_status boolean not null default false,
  municipality_token_status boolean not null default false,
  iban_status boolean not null default false,
  btw_status boolean not null default false,
  overall_status verification_status not null default 'not_started',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- user_interests ----------
create table public.user_interests (
  user_id uuid not null references public.users(id) on delete cascade,
  interest_id text not null references public.interests(id) on delete cascade,
  primary key (user_id, interest_id)
);

-- ---------- events ----------
create table public.events (
  id uuid primary key default gen_random_uuid(),
  organiser_id uuid not null references public.organisers(id) on delete cascade,
  organiser_name text not null,
  organiser_verified boolean not null default false,
  title text not null,
  category text not null,
  subcategory text,
  icon text default '📍',
  description text,
  zone_id text references public.location_zones(id),
  location_name text,
  address text,
  lat numeric not null,
  lng numeric not null,
  start_time text,
  start_in_min int not null default 120,
  end_time text,
  status event_status not null default 'scheduled',
  is_live boolean not null default false,
  min_capacity int not null default 4,
  max_capacity int not null default 12,
  current_registration int not null default 0,
  beginner_friendly boolean not null default true,
  skill_level text not null default 'Any',
  age_range_min int not null default 18,
  age_range_max int not null default 99,
  gender_requirement_optional text,
  gender_requirement_reason text,
  accessibility_info text default 'Step-free entry',
  equipment_needed jsonb not null default '[]'::jsonb,
  people_usually_come_alone boolean not null default true,
  welcome_host_present boolean not null default true,
  welcome_host_description text,
  verified_organiser_required boolean not null default true,
  team_based boolean not null default false,
  team_size int,
  spectators_allowed boolean not null default true,
  bring_friend_allowed boolean not null default true,
  recommendation_reason text default '',
  distance_km numeric not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index events_zone_idx on public.events(zone_id);
create index events_organiser_idx on public.events(organiser_id);
create index events_lat_lng_idx on public.events(lat, lng);
create index events_status_idx on public.events(status);

-- ---------- event_registrations ----------
create table public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  participation_state participation_state not null,
  bring_friend boolean not null default false,
  linked_friend_group_id uuid,
  checked_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, user_id)
);
create index event_registrations_event_idx on public.event_registrations(event_id);
create index event_registrations_user_idx on public.event_registrations(user_id);

-- ---------- team_assignments ----------
create table public.team_assignments (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  team_label text not null,
  user_id uuid not null references public.users(id) on delete cascade,
  linked_friend_group_id uuid,
  created_at timestamptz not null default now()
);
create index team_assignments_event_idx on public.team_assignments(event_id);

-- ---------- check_ins ----------
create table public.check_ins (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  checked_in_at timestamptz not null default now(),
  method text not null default 'im_here',
  unique (event_id, user_id)
);

-- ---------- recommendations ----------
create table public.recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  recommendation_reason text,
  inputs_used jsonb,
  created_at timestamptz not null default now()
);

-- ---------- notification_preferences ----------
create table public.notification_preferences (
  user_id uuid primary key references public.users(id) on delete cascade,
  frequency text default 'normal',
  event_categories jsonb default '[]'::jsonb,
  distance_km numeric default 2,
  quiet_hours_start text default '22:00',
  quiet_hours_end text default '08:00',
  paused boolean default false,
  small_group_invites boolean default true,
  large_event_invites boolean default true
);

-- ---------- municipality_metrics ----------
create table public.municipality_metrics (
  id uuid primary key default gen_random_uuid(),
  zone_id text references public.location_zones(id),
  date date not null default current_date,
  event_volume int not null default 0,
  attendance_count int not null default 0,
  first_time_participant_count int not null default 0,
  retention_rate numeric not null default 0,
  hobby_demand_index jsonb default '{}'::jsonb,
  demand_capacity_gap numeric default 0,
  anonymized_belonging_score numeric default 0,
  created_at timestamptz not null default now()
);

-- ---------- ai_event_proposals ----------
create table public.ai_event_proposals (
  id uuid primary key default gen_random_uuid(),
  zone_id text references public.location_zones(id),
  organiser_id uuid references public.organisers(id) on delete set null,
  detected_theme text not null,
  detected_interest_count int default 0,
  suggested_location_name text,
  suggested_lat numeric,
  suggested_lng numeric,
  suggested_start_time text,
  suggested_end_time text,
  weather_note text,
  proposal_reason text,
  status text not null default 'proposed',
  created_at timestamptz not null default now()
);

-- ============================================================
-- Security definer helpers (avoid recursive RLS)
-- ============================================================

create or replace function public.has_role(_uid uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select
    case _role
      when 'resident' then exists (select 1 from public.users where auth_user_id = _uid)
      when 'organiser' then exists (select 1 from public.organisers where auth_user_id = _uid)
      when 'municipality_admin' then exists (select 1 from public.municipality_admins where auth_user_id = _uid)
    end
$$;

create or replace function public.current_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1
$$;

create or replace function public.current_organiser_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.organisers where auth_user_id = auth.uid() limit 1
$$;

-- ============================================================
-- Signup trigger: create profile row based on metadata.role
-- ============================================================

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_role text := coalesce(new.raw_user_meta_data->>'role', 'resident');
begin
  if v_role = 'organiser' then
    insert into public.organisers (auth_user_id, name, type, email, phone, municipality_zone_id)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'name', new.email),
      coalesce((new.raw_user_meta_data->>'type')::organiser_type, 'community_center'),
      new.email,
      new.raw_user_meta_data->>'phone',
      coalesce(new.raw_user_meta_data->>'zone_id', 'kralingen')
    );
    insert into public.organiser_verification_steps (organiser_id)
    select id from public.organisers where auth_user_id = new.id;
  elsif v_role = 'municipality_admin' then
    insert into public.municipality_admins (auth_user_id, name, municipality)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'name', 'Municipality admin'),
      coalesce(new.raw_user_meta_data->>'municipality', 'Rotterdam')
    );
  else
    insert into public.users (auth_user_id, location_zone_id)
    values (new.id, 'kralingen');
    insert into public.notification_preferences (user_id)
    select id from public.users where auth_user_id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Capacity recount trigger
-- ============================================================

create or replace function public.recount_event_registration()
returns trigger language plpgsql as $$
declare
  v_event uuid := coalesce(new.event_id, old.event_id);
  v_count int;
begin
  select coalesce(sum(case when participation_state = 'Bring a friend' then 2
                           when participation_state = 'Join' then 1 else 0 end), 0)
    into v_count from public.event_registrations where event_id = v_event;
  update public.events set current_registration = v_count, updated_at = now()
    where id = v_event;
  return null;
end;
$$;

drop trigger if exists trg_recount_registration on public.event_registrations;
create trigger trg_recount_registration
  after insert or update or delete on public.event_registrations
  for each row execute function public.recount_event_registration();

-- ============================================================
-- RLS
-- ============================================================

alter table public.users enable row level security;
alter table public.organisers enable row level security;
alter table public.municipality_admins enable row level security;
alter table public.organiser_verification_steps enable row level security;
alter table public.user_interests enable row level security;
alter table public.events enable row level security;
alter table public.event_registrations enable row level security;
alter table public.team_assignments enable row level security;
alter table public.check_ins enable row level security;
alter table public.recommendations enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.municipality_metrics enable row level security;
alter table public.ai_event_proposals enable row level security;
alter table public.location_zones enable row level security;
alter table public.interests enable row level security;

-- Reference data readable by all authenticated users
create policy "zones readable" on public.location_zones for select to authenticated using (true);
create policy "interests readable" on public.interests for select to authenticated using (true);

-- users: only owner can read/update own row
create policy "users self read" on public.users for select to authenticated using (auth_user_id = auth.uid());
create policy "users self update" on public.users for update to authenticated
  using (auth_user_id = auth.uid()) with check (auth_user_id = auth.uid());
-- (insert is handled by trigger as security definer)

-- organisers: only owner can read/update own row
create policy "organisers self read" on public.organisers for select to authenticated using (auth_user_id = auth.uid());
create policy "organisers self update" on public.organisers for update to authenticated
  using (auth_user_id = auth.uid()) with check (auth_user_id = auth.uid());

-- municipality_admins: only owner can read own row
create policy "admins self read" on public.municipality_admins for select to authenticated using (auth_user_id = auth.uid());

-- verification steps: organiser owns them
create policy "verif self read" on public.organiser_verification_steps for select to authenticated
  using (organiser_id = public.current_organiser_id());
create policy "verif self upsert" on public.organiser_verification_steps for insert to authenticated
  with check (organiser_id = public.current_organiser_id());
create policy "verif self update" on public.organiser_verification_steps for update to authenticated
  using (organiser_id = public.current_organiser_id())
  with check (organiser_id = public.current_organiser_id());

-- user_interests
create policy "ui self read" on public.user_interests for select to authenticated
  using (user_id = public.current_user_id());
create policy "ui self insert" on public.user_interests for insert to authenticated
  with check (user_id = public.current_user_id());
create policy "ui self delete" on public.user_interests for delete to authenticated
  using (user_id = public.current_user_id());

-- events: readable by all authenticated users; organisers can manage their own
create policy "events readable" on public.events for select to authenticated using (true);
create policy "events organiser insert" on public.events for insert to authenticated
  with check (organiser_id = public.current_organiser_id());
create policy "events organiser update" on public.events for update to authenticated
  using (organiser_id = public.current_organiser_id())
  with check (organiser_id = public.current_organiser_id());
create policy "events organiser delete" on public.events for delete to authenticated
  using (organiser_id = public.current_organiser_id());

-- event_registrations: residents see their own; organisers see registrations for their events
create policy "regs self read" on public.event_registrations for select to authenticated
  using (
    user_id = public.current_user_id()
    or event_id in (select id from public.events where organiser_id = public.current_organiser_id())
  );
create policy "regs self insert" on public.event_registrations for insert to authenticated
  with check (user_id = public.current_user_id());
create policy "regs self update" on public.event_registrations for update to authenticated
  using (user_id = public.current_user_id()) with check (user_id = public.current_user_id());
create policy "regs self delete" on public.event_registrations for delete to authenticated
  using (user_id = public.current_user_id());

-- team_assignments: visible to participants and event organiser
create policy "teams read" on public.team_assignments for select to authenticated
  using (
    user_id = public.current_user_id()
    or event_id in (select id from public.events where organiser_id = public.current_organiser_id())
  );
create policy "teams organiser insert" on public.team_assignments for insert to authenticated
  with check (event_id in (select id from public.events where organiser_id = public.current_organiser_id()));
create policy "teams organiser delete" on public.team_assignments for delete to authenticated
  using (event_id in (select id from public.events where organiser_id = public.current_organiser_id()));

-- check_ins: self + event organiser
create policy "checkins read" on public.check_ins for select to authenticated
  using (
    user_id = public.current_user_id()
    or event_id in (select id from public.events where organiser_id = public.current_organiser_id())
  );
create policy "checkins self insert" on public.check_ins for insert to authenticated
  with check (user_id = public.current_user_id());

-- recommendations: only owner reads
create policy "recs self read" on public.recommendations for select to authenticated
  using (user_id = public.current_user_id());
create policy "recs self insert" on public.recommendations for insert to authenticated
  with check (user_id = public.current_user_id());

-- notification_preferences
create policy "np self read" on public.notification_preferences for select to authenticated
  using (user_id = public.current_user_id());
create policy "np self upsert" on public.notification_preferences for insert to authenticated
  with check (user_id = public.current_user_id());
create policy "np self update" on public.notification_preferences for update to authenticated
  using (user_id = public.current_user_id()) with check (user_id = public.current_user_id());

-- municipality_metrics: only municipality admins read
create policy "metrics admin read" on public.municipality_metrics for select to authenticated
  using (public.has_role(auth.uid(), 'municipality_admin'));

-- ai_event_proposals: organisers and admins read
create policy "ai read" on public.ai_event_proposals for select to authenticated
  using (
    public.has_role(auth.uid(), 'organiser')
    or public.has_role(auth.uid(), 'municipality_admin')
  );
create policy "ai organiser update" on public.ai_event_proposals for update to authenticated
  using (public.has_role(auth.uid(), 'organiser'))
  with check (public.has_role(auth.uid(), 'organiser'));
