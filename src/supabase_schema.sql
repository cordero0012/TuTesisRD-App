-- Create Students Table
create table public.students (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  lastname text not null,
  email text not null,
  phone text not null,
  university text,
  career text
);

-- Create Projects Table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  student_id uuid references public.students(id) not null,
  type text not null,
  description text,
  total_amount numeric default 0,
  paid_amount numeric default 0,
  due_date date,
  status text default 'pending',
  tracking_code text unique default 'TRX-' || upper(substr(md5(random()::text), 1, 6))
);

-- Enable RLS
alter table public.students enable row level security;
alter table public.projects enable row level security;

-- Create Policies (Simplified for Initial Rollout)
-- Allow anyone to insert (register)
create policy "Enable insert for all users" on public.students
  for insert with check (true);

create policy "Enable insert for all users" on public.projects
  for insert with check (true);

-- Allow public read access (for monitoring by code) - In production, restrict this further
create policy "Enable read access for all users" on public.projects
  for select using (true);
