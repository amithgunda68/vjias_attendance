create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  role text not null default 'student' check (role in ('student', 'faculty', 'admin')),
  roll_number text unique,
  faculty_id text unique,
  department text,
  created_at timestamptz not null default now()
);

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  department text not null,
  semester integer not null check (semester > 0),
  faculty_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  faculty_id uuid not null references public.profiles (id) on delete restrict,
  class_date date not null default current_date,
  period integer not null check (period > 0),
  status text not null check (status in ('Present', 'Absent', 'Late', 'Excused')),
  remarks text,
  created_at timestamptz not null default now(),
  unique (subject_id, student_id, class_date, period)
);

alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.attendance_records enable row level security;

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.profiles where id = (select auth.uid())
$$;

grant execute on function public.current_user_role() to authenticated;

create policy "Users can read their own profile"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()));

create policy "Users can create a student profile for themselves"
  on public.profiles for insert to authenticated
  with check (id = (select auth.uid()) and role = 'student');

create policy "Admins can manage profiles"
  on public.profiles for all to authenticated
  using ((select public.current_user_role()) = 'admin')
  with check ((select public.current_user_role()) = 'admin');

create policy "Authenticated users can read subjects"
  on public.subjects for select to authenticated
  using (true);

create policy "Admins can manage subjects"
  on public.subjects for all to authenticated
  using ((select public.current_user_role()) = 'admin')
  with check ((select public.current_user_role()) = 'admin');

create policy "Students can read their attendance"
  on public.attendance_records for select to authenticated
  using (student_id = (select auth.uid()));

create policy "Faculty can read attendance they recorded"
  on public.attendance_records for select to authenticated
  using (faculty_id = (select auth.uid()));

create policy "Admins can read all attendance"
  on public.attendance_records for select to authenticated
  using ((select public.current_user_role()) = 'admin');

create policy "Assigned faculty can record attendance"
  on public.attendance_records for insert to authenticated
  with check (
    faculty_id = (select auth.uid())
    and exists (
      select 1 from public.subjects assigned_subject
      where assigned_subject.id = subject_id
        and assigned_subject.faculty_id = (select auth.uid())
    )
  );

create policy "Assigned faculty can update their attendance records"
  on public.attendance_records for update to authenticated
  using (
    faculty_id = (select auth.uid())
    and exists (
      select 1 from public.subjects assigned_subject
      where assigned_subject.id = subject_id
        and assigned_subject.faculty_id = (select auth.uid())
    )
  )
  with check (
    faculty_id = (select auth.uid())
    and exists (
      select 1 from public.subjects assigned_subject
      where assigned_subject.id = subject_id
        and assigned_subject.faculty_id = (select auth.uid())
    )
  );