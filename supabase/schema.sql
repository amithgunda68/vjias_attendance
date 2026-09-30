create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  role text not null default 'student' check (role in ('student', 'faculty', 'admin')),
  roll_number text unique,
  hall_ticket_number text unique,
  faculty_id text unique,
  admin_id text unique,
  department text,
  avatar_url text,
  course text,
  semester integer check (semester is null or semester > 0),
  section text,
  academic_year text,
  designation text,
  title text,
  created_at timestamptz not null default now()
);

alter table public.profiles add column if not exists hall_ticket_number text unique;
alter table public.profiles add column if not exists admin_id text unique;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists course text;
alter table public.profiles add column if not exists semester integer;
alter table public.profiles add column if not exists section text;
alter table public.profiles add column if not exists academic_year text;
alter table public.profiles add column if not exists designation text;
alter table public.profiles add column if not exists title text;

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  department text not null,
  semester integer not null check (semester > 0),
  credits integer not null default 3 check (credits > 0),
  section text not null default 'A',
  course text not null default '',
  faculty_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.subjects add column if not exists credits integer not null default 3;
alter table public.subjects add column if not exists section text not null default 'A';
alter table public.subjects add column if not exists course text not null default '';

create table if not exists public.enrollments (
  student_id uuid not null references public.profiles (id) on delete cascade,
  subject_id uuid not null references public.subjects (id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  primary key (student_id, subject_id)
);

create table if not exists public.timetable_slots (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects (id) on delete cascade,
  day_of_week text not null check (day_of_week in ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
  period integer not null check (period > 0),
  start_time time not null,
  end_time time not null,
  room text not null,
  unique (subject_id, day_of_week, period)
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  author_id uuid not null references public.profiles (id) on delete restrict,
  priority text not null default 'Normal' check (priority in ('Normal', 'Important', 'Urgent')),
  published_at timestamptz not null default now(),
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
alter table public.enrollments enable row level security;
alter table public.timetable_slots enable row level security;
alter table public.attendance_records enable row level security;
alter table public.announcements enable row level security;

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

create or replace function public.user_can_access_subject(target_subject_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.subjects s
    where s.id = target_subject_id
      and (
        s.faculty_id = (select auth.uid())
        or exists (
          select 1 from public.enrollments e
          where e.subject_id = s.id and e.student_id = (select auth.uid())
        )
      )
  )
$$;

grant execute on function public.user_can_access_subject(uuid) to authenticated;

create or replace function public.create_student_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    id, full_name, role, roll_number, hall_ticket_number, department,
    course, semester, section, academic_year
  ) values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), new.email),
    'student',
    nullif(new.raw_user_meta_data ->> 'roll_number', ''),
    nullif(new.raw_user_meta_data ->> 'hall_ticket_number', ''),
    nullif(new.raw_user_meta_data ->> 'department', ''),
    nullif(new.raw_user_meta_data ->> 'course', ''),
    nullif(new.raw_user_meta_data ->> 'semester', '')::integer,
    nullif(new.raw_user_meta_data ->> 'section', ''),
    nullif(new.raw_user_meta_data ->> 'academic_year', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.create_student_profile();

drop policy if exists "Users can read their own profile" on public.profiles;
drop policy if exists "Users can create a student profile for themselves" on public.profiles;
drop policy if exists "Admins can manage profiles" on public.profiles;
drop policy if exists "Users can read relevant profiles" on public.profiles;
drop policy if exists "Admins can manage all profiles" on public.profiles;
drop policy if exists "Users can read relevant profiles" on public.profiles;
drop policy if exists "Admins can manage all profiles" on public.profiles;

create policy "Users can read own or assigned student profiles"
  on public.profiles for select to authenticated
  using (
    id = (select auth.uid())
    or (select public.current_user_role()) = 'admin'
    or (
      role = 'student'
      and (select public.current_user_role()) = 'faculty'
      and exists (
        select 1 from public.enrollments e
        join public.subjects s on s.id = e.subject_id
        where e.student_id = profiles.id and s.faculty_id = (select auth.uid())
      )
    )
  );

create policy "Admins can manage all profiles"
  on public.profiles for all to authenticated
  using ((select public.current_user_role()) = 'admin')
  with check ((select public.current_user_role()) = 'admin');

create or replace view public.profile_directory
with (security_invoker = false)
as
  select id, full_name, role, department
  from public.profiles
  where role = 'faculty' or id = (select auth.uid());

grant select on public.profile_directory to authenticated;

drop policy if exists "Authenticated users can read subjects" on public.subjects;
drop policy if exists "Admins can manage subjects" on public.subjects;
drop policy if exists "Users can read assigned subjects" on public.subjects;
drop policy if exists "Admins can manage all subjects" on public.subjects;

create policy "Users can read assigned subjects"
  on public.subjects for select to authenticated
  using (
    (select public.current_user_role()) = 'admin'
    or (select public.user_can_access_subject(id))
  );

create policy "Admins can manage all subjects"
  on public.subjects for all to authenticated
  using ((select public.current_user_role()) = 'admin')
  with check ((select public.current_user_role()) = 'admin');

drop policy if exists "Students and faculty can read relevant enrollments" on public.enrollments;
drop policy if exists "Admins can manage enrollments" on public.enrollments;
create policy "Students and faculty can read relevant enrollments"
  on public.enrollments for select to authenticated
  using (
    student_id = (select auth.uid())
    or (select public.current_user_role()) = 'admin'
    or (select public.user_can_access_subject(subject_id))
  );
create policy "Admins can manage enrollments"
  on public.enrollments for all to authenticated
  using ((select public.current_user_role()) = 'admin')
  with check ((select public.current_user_role()) = 'admin');

drop policy if exists "Users can read relevant timetable slots" on public.timetable_slots;
drop policy if exists "Admins can manage timetable slots" on public.timetable_slots;
create policy "Users can read relevant timetable slots"
  on public.timetable_slots for select to authenticated
  using (
    (select public.current_user_role()) = 'admin'
    or (select public.user_can_access_subject(subject_id))
  );
create policy "Admins can manage timetable slots"
  on public.timetable_slots for all to authenticated
  using ((select public.current_user_role()) = 'admin')
  with check ((select public.current_user_role()) = 'admin');

drop policy if exists "Students can read their attendance" on public.attendance_records;
drop policy if exists "Faculty can read attendance they recorded" on public.attendance_records;
drop policy if exists "Admins can read all attendance" on public.attendance_records;
drop policy if exists "Assigned faculty can record attendance" on public.attendance_records;
drop policy if exists "Assigned faculty can update their attendance records" on public.attendance_records;
create policy "Students can read their attendance"
  on public.attendance_records for select to authenticated
  using (student_id = (select auth.uid()));

create policy "Faculty can read attendance they recorded"
  on public.attendance_records for select to authenticated
  using (
    exists (
      select 1 from public.subjects assigned_subject
      where assigned_subject.id = subject_id
        and assigned_subject.faculty_id = (select auth.uid())
    )
  );

create policy "Admins can read all attendance"
  on public.attendance_records for select to authenticated
  using ((select public.current_user_role()) = 'admin');

create policy "Assigned faculty can record attendance"
  on public.attendance_records for insert to authenticated
  with check (
    faculty_id = (select auth.uid())
    and exists (
      select 1 from public.subjects assigned_subject
      where assigned_subject.id = attendance_records.subject_id
        and assigned_subject.faculty_id = (select auth.uid())
    )
    and exists (
      select 1 from public.enrollments assigned_student
      where assigned_student.subject_id = attendance_records.subject_id
        and assigned_student.student_id = attendance_records.student_id
    )
  );

create policy "Assigned faculty can update their attendance records"
  on public.attendance_records for update to authenticated
  using (
    faculty_id = (select auth.uid())
    and exists (
      select 1 from public.subjects assigned_subject
      where assigned_subject.id = attendance_records.subject_id
        and assigned_subject.faculty_id = (select auth.uid())
    )
    and exists (
      select 1 from public.enrollments assigned_student
      where assigned_student.subject_id = attendance_records.subject_id
        and assigned_student.student_id = attendance_records.student_id
    )
  )
  with check (
    faculty_id = (select auth.uid())
    and exists (
      select 1 from public.subjects assigned_subject
      where assigned_subject.id = attendance_records.subject_id
        and assigned_subject.faculty_id = (select auth.uid())
    )
    and exists (
      select 1 from public.enrollments assigned_student
      where assigned_student.subject_id = attendance_records.subject_id
        and assigned_student.student_id = attendance_records.student_id
    )
  );

drop policy if exists "Authenticated users can read announcements" on public.announcements;
drop policy if exists "Admins can manage announcements" on public.announcements;
create policy "Authenticated users can read announcements"
  on public.announcements for select to authenticated using (true);
create policy "Admins can manage announcements"
  on public.announcements for all to authenticated
  using ((select public.current_user_role()) = 'admin')
  with check ((select public.current_user_role()) = 'admin');

create index if not exists enrollments_subject_id_idx on public.enrollments (subject_id);
create index if not exists attendance_records_student_subject_date_idx
  on public.attendance_records (student_id, subject_id, class_date desc);
create index if not exists attendance_records_subject_date_period_idx
  on public.attendance_records (subject_id, class_date, period);
create index if not exists timetable_slots_subject_day_period_idx
  on public.timetable_slots (subject_id, day_of_week, period);