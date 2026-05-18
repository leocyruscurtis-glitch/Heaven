
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS full_name text,
  ADD COLUMN IF NOT EXISTS age int,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS short_bio text;

-- Drop existing PK first (it's on (user_id, interest_id)) so we can relax interest_id
DO $$
DECLARE pk_name text;
BEGIN
  SELECT conname INTO pk_name
  FROM pg_constraint
  WHERE conrelid = 'public.user_interests'::regclass AND contype = 'p';
  IF pk_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.user_interests DROP CONSTRAINT %I', pk_name);
  END IF;
END $$;

ALTER TABLE public.user_interests
  ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS interest_name text,
  ADD COLUMN IF NOT EXISTS interest_category text,
  ADD COLUMN IF NOT EXISTS intensity int DEFAULT 3,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.user_interests ALTER COLUMN interest_id DROP NOT NULL;
UPDATE public.user_interests SET id = gen_random_uuid() WHERE id IS NULL;
ALTER TABLE public.user_interests ALTER COLUMN id SET NOT NULL;
ALTER TABLE public.user_interests ADD PRIMARY KEY (id);

ALTER TABLE public.user_interests
  DROP CONSTRAINT IF EXISTS user_interests_intensity_check;
ALTER TABLE public.user_interests
  ADD CONSTRAINT user_interests_intensity_check CHECK (intensity BETWEEN 1 AND 5);

CREATE INDEX IF NOT EXISTS idx_user_interests_user ON public.user_interests(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interests_name ON public.user_interests(interest_name);

CREATE TABLE IF NOT EXISTS public.event_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by_ai boolean NOT NULL DEFAULT true,
  title text NOT NULL,
  description text,
  shared_interest text NOT NULL,
  city text NOT NULL,
  suggested_date timestamptz,
  max_participants int NOT NULL DEFAULT 6,
  status text NOT NULL DEFAULT 'suggested' CHECK (status IN ('suggested','accepted','cancelled')),
  match_reason text,
  invitation_text text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_event_suggestions_city_interest
  ON public.event_suggestions(city, shared_interest);

CREATE TABLE IF NOT EXISTS public.event_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.event_suggestions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  invitation_status text NOT NULL DEFAULT 'invited'
    CHECK (invitation_status IN ('invited','accepted','declined')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_event_participants_user ON public.event_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_event_participants_event ON public.event_participants(event_id);

ALTER TABLE public.event_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ep self read"
  ON public.event_participants FOR SELECT TO authenticated
  USING (user_id = public.current_user_id());

CREATE POLICY "ep self update"
  ON public.event_participants FOR UPDATE TO authenticated
  USING (user_id = public.current_user_id())
  WITH CHECK (user_id = public.current_user_id());

CREATE POLICY "es invited read"
  ON public.event_suggestions FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.event_participants ep
    WHERE ep.event_id = event_suggestions.id
      AND ep.user_id = public.current_user_id()
  ));
