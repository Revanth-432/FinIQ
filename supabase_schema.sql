-- Create custom types
CREATE TYPE card_type AS ENUM ('hook', 'concept', 'explanation', 'example', 'interaction', 'advice', 'quiz', 'reward');

-- Create generic updated_at trigger function
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 1. USERS TABLE (Public Profile)
-- This table mirrors auth.users
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to handle updated_at for users
create trigger on_users_updated
  before update on public.users
  for each row execute procedure handle_updated_at();

-- 2. MODULES TABLE
CREATE TABLE public.modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- Lucide icon name
  color TEXT, -- Hex code or tailwind class
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. LESSONS TABLE
CREATE TABLE public.lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  duration INTEGER, -- in minutes
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CARDS TABLE
CREATE TABLE public.cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  type card_type NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. USER PROGRESS TABLE
CREATE TABLE public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);


-- ROW LEVEL SECURITY (RLS)

-- Helper function to get current user ID (optional but good practice)
-- auth.uid() is standard in Supabase

-- USERS: Everyone can read users (for leaderboards etc), Users can update their own
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" 
ON public.users FOR SELECT 
USING (true);

CREATE POLICY "Users can update own profile" 
ON public.users FOR UPDATE 
USING (auth.uid() = id);

-- MODULES: Public read-only
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Modules are viewable by everyone" 
ON public.modules FOR SELECT 
USING (true);

-- LESSONS: Public read-only
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lessons are viewable by everyone" 
ON public.lessons FOR SELECT 
USING (true);

-- CARDS: Public read-only
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cards are viewable by everyone" 
ON public.cards FOR SELECT 
USING (true);

-- USER PROGRESS: Users can view and insert/update their own progress
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress" 
ON public.user_progress FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" 
ON public.user_progress FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" 
ON public.user_progress FOR UPDATE 
USING (auth.uid() = user_id);


-- AUTOMATIC PROFILE CREATION TRIGGER
-- This function executes when a new user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, full_name, xp, streak)
  values (new.id, new.raw_user_meta_data ->> 'full_name', 0, 0);
  return new;
end;
$$;

-- Trigger to call the function on auth.users insert
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- SEED DATA (Dummy Data)
INSERT INTO public.modules (title, description, icon, color, order_index) VALUES
('Money Mindset', 'Understand your relationship with money.', 'Brain', 'bg-purple-500', 1),
('Spending', 'Track where your money goes.', 'CreditCard', 'bg-blue-500', 2),
('Investing', 'Make your money work for you.', 'TrendingUp', 'bg-green-500', 3);
