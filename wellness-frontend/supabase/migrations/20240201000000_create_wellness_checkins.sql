-- Create wellness_checkins table
create table public.wellness_checkins (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    date date not null,
    sleep integer not null check (sleep between 1 and 5),
    fatigue integer not null check (fatigue between 1 and 5),
    mood integer not null check (mood between 1 and 5),
    stress integer not null check (stress between 1 and 5),
    soreness integer not null check (soreness between 1 and 5),
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.wellness_checkins enable row level security;

-- Create policies
create policy "Users can view their own check-ins"
    on public.wellness_checkins for select
    using (auth.uid() = user_id);

create policy "Users can insert their own check-ins"
    on public.wellness_checkins for insert
    with check (auth.uid() = user_id);

-- Create indexes
create index wellness_checkins_user_id_idx on public.wellness_checkins(user_id);
create index wellness_checkins_date_idx on public.wellness_checkins(date);
