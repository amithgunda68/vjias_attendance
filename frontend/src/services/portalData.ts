import type {
  Announcement,
  AttendanceRecord,
  AttendanceStatus,
  DepartmentSummary,
  FacultyClassSchedule,
  StudentRosterItem,
  SubjectAttendance,
  TimetableSlot,
} from '../types';
import { getAttendanceTier } from '../utils/attendance';
import { supabase } from '../lib/supabase';

type Row = Record<string, any>;

export interface StudentDashboardData {
  subjects: SubjectAttendance[];
  history: AttendanceRecord[];
  timetable: TimetableSlot[];
}

export interface FacultyDashboardData {
  schedule: FacultyClassSchedule[];
  roster: StudentRosterItem[];
}

export interface AdminDashboardData {
  departments: DepartmentSummary[];
  monthlyTrend: { month: string; averageAttendance: number; threshold: number }[];
}

function client() {
  if (!supabase) throw new Error('Supabase is not configured.');
  return supabase;
}

function checked<T>(result: { data: T | null; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message);
  return result.data ?? ([] as T);
}

function formatTime(value: string) {
  return new Date(`1970-01-01T${value}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export async function fetchAnnouncements(): Promise<Announcement[]> {
  const db = client();
  const rows = checked<Row[]>(await db
    .from('announcements')
    .select('id,title,description,priority,published_at,author_id')
    .order('published_at', { ascending: false }));
  const authorIds = [...new Set(rows.map((row) => row.author_id as string))];
  const authors = authorIds.length
    ? checked<Row[]>(await db.from('profile_directory').select('id,full_name').in('id', authorIds))
    : [];
  const authorNames = new Map(authors.map((author) => [author.id, author.full_name]));
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    priority: row.priority,
    date: new Date(row.published_at).toLocaleDateString(),
    author: authorNames.get(row.author_id) ?? 'VJIAS Administration',
  }));
}

export async function fetchStudentDashboard(studentId: string): Promise<StudentDashboardData> {
  const db = client();
  const enrollmentRows = checked<Row[]>(await db
    .from('enrollments')
    .select('subject_id')
    .eq('student_id', studentId));
  const subjectIds = enrollmentRows.map((row) => row.subject_id as string);
  if (subjectIds.length === 0) return { subjects: [], history: [], timetable: [] };

  const [subjectResult, attendanceResult, slotResult] = await Promise.all([
    db.from('subjects').select('*').in('id', subjectIds),
    db.from('attendance_records').select('*').eq('student_id', studentId).order('class_date', { ascending: false }),
    db.from('timetable_slots').select('*').in('subject_id', subjectIds),
  ]);
  const subjects = checked<Row[]>(subjectResult);
  const attendance = checked<Row[]>(attendanceResult);
  const slots = checked<Row[]>(slotResult);
  const facultyIds = [...new Set(subjects.map((subject) => subject.faculty_id).filter(Boolean))] as string[];
  const facultyRows = facultyIds.length
    ? checked<Row[]>(await db.from('profiles').select('id,full_name').in('id', facultyIds))
    : [];
  const subjectById = new Map(subjects.map((subject) => [subject.id, subject]));
  const facultyById = new Map(facultyRows.map((faculty) => [faculty.id, faculty.full_name]));

  const subjectAttendance: SubjectAttendance[] = subjects.map((subject) => {
    const records = attendance.filter((record) => record.subject_id === subject.id);
    const presentClasses = records.filter((record) => record.status === 'Present' || record.status === 'Late').length;
    const totalClasses = records.length;
    const percentage = totalClasses ? Math.round((presentClasses / totalClasses) * 1000) / 10 : 0;
    return {
      id: subject.id,
      code: subject.code,
      name: subject.name,
      credits: subject.credits,
      facultyName: facultyById.get(subject.faculty_id) ?? 'Faculty not assigned',
      department: subject.department,
      semester: subject.semester,
      presentClasses,
      totalClasses,
      percentage,
      tier: getAttendanceTier(percentage),
    };
  });

  const history: AttendanceRecord[] = attendance.map((record) => {
    const subject = subjectById.get(record.subject_id);
    return {
      id: record.id,
      date: record.class_date,
      subjectId: record.subject_id,
      subjectCode: subject?.code ?? '',
      subjectName: subject?.name ?? 'Unknown subject',
      period: record.period,
      faculty: facultyById.get(record.faculty_id) ?? 'Faculty',
      status: record.status as AttendanceStatus,
      remarks: record.remarks ?? undefined,
    };
  });

  const today = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
  const todaySlots = slots.filter((slot) => slot.day_of_week === today);
  const timetable: TimetableSlot[] = todaySlots.map((slot) => {
    const subject = subjectById.get(slot.subject_id);
    return {
      id: slot.id,
      time: `${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}`,
      period: slot.period,
      day: slot.day_of_week,
      subjectCode: subject?.code ?? '',
      subjectName: subject?.name ?? 'Unknown subject',
      room: slot.room,
      faculty: facultyById.get(subject?.faculty_id) ?? 'Faculty',
    };
  });

  return { subjects: subjectAttendance, history, timetable };
}

export async function fetchFacultyDashboard(facultyId: string): Promise<FacultyDashboardData> {
  const db = client();
  const subjects = checked<Row[]>(await db.from('subjects').select('*').eq('faculty_id', facultyId));
  const subjectIds = subjects.map((subject) => subject.id as string);
  if (subjectIds.length === 0) return { schedule: [], roster: [] };

  const [slotResult, enrollmentResult] = await Promise.all([
    db.from('timetable_slots').select('*').in('subject_id', subjectIds),
    db.from('enrollments').select('student_id,subject_id').in('subject_id', subjectIds),
  ]);
  const slots = checked<Row[]>(slotResult);
  const enrollments = checked<Row[]>(enrollmentResult);
  const today = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
  const todaySlots = slots.filter((slot) => slot.day_of_week === today);
  const studentIds = [...new Set(enrollments.map((row) => row.student_id as string))];
  const [attendance, studentRows] = await Promise.all([
    checked<Row[]>(await db.from('attendance_records').select('*').in('subject_id', subjectIds)),
      studentIds.length
        ? checked<Row[]>(await db.from('profiles').select('id,full_name,roll_number').in('id', studentIds))
      : Promise.resolve([] as Row[]),
  ]);
  const subjectById = new Map(subjects.map((subject) => [subject.id, subject]));
  const studentById = new Map(studentRows.map((student) => [student.id, student]));
  const schedule: FacultyClassSchedule[] = todaySlots.map((slot) => {
    const subject = subjectById.get(slot.subject_id);
    return {
      id: slot.id,
      subjectId: slot.subject_id,
      subjectCode: subject?.code ?? '',
      subjectName: subject?.name ?? 'Unknown subject',
      section: `${subject?.course ?? ''} - Section ${subject?.section ?? ''}`.trim(),
      course: subject?.course ?? '',
      time: `${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}`,
      period: slot.period,
      room: slot.room,
      totalStudents: enrollments.filter((row) => row.subject_id === slot.subject_id).length,
      attendanceCompleted: attendance.some((record) => record.subject_id === slot.subject_id
        && record.class_date === new Date().toISOString().slice(0, 10)
        && record.period === slot.period),
    };
  });
  const roster: StudentRosterItem[] = enrollments.map((enrollment) => {
    const student = studentById.get(enrollment.student_id);
    const records = attendance.filter((record) => record.student_id === enrollment.student_id
      && record.subject_id === enrollment.subject_id);
    const presentCount = records.filter((record) => record.status === 'Present' || record.status === 'Late').length;
    return {
      id: enrollment.student_id,
      rollNumber: student?.roll_number ?? '',
      name: student?.full_name ?? 'Student',
      status: 'Present',
      currentPercentage: records.length ? Math.round((presentCount / records.length) * 1000) / 10 : 0,
    };
  });
  return { schedule, roster };
}

export async function fetchFacultyRoster(subjectId: string, period: number): Promise<StudentRosterItem[]> {
  const db = client();
  const enrollments = checked<Row[]>(await db
    .from('enrollments')
    .select('student_id')
    .eq('subject_id', subjectId));
  const studentIds = enrollments.map((row) => row.student_id as string);
  if (studentIds.length === 0) return [];
  const [profiles, attendance] = await Promise.all([
      checked<Row[]>(await db.from('profiles').select('id,full_name,roll_number').in('id', studentIds)),
    checked<Row[]>(await db.from('attendance_records').select('student_id,status,class_date,period').eq('subject_id', subjectId)),
  ]);
  const today = new Date().toISOString().slice(0, 10);
  return profiles.map((student) => {
    const records = attendance.filter((record) => record.student_id === student.id);
    const present = records.filter((record) => record.status === 'Present' || record.status === 'Late').length;
    return {
      id: student.id,
      rollNumber: student.roll_number ?? '',
      name: student.full_name,
      status: (attendance.find((record) => record.student_id === student.id
        && record.class_date === today && record.period === period)?.status ?? 'Present') as AttendanceStatus,
      currentPercentage: records.length ? Math.round((present / records.length) * 1000) / 10 : 0,
    };
  });
}

export async function saveAttendance(
  facultyId: string,
  subjectId: string,
  period: number,
  records: Pick<StudentRosterItem, 'id' | 'status'>[],
) {
  const rows = records.map((record) => ({
    subject_id: subjectId,
    student_id: record.id,
    faculty_id: facultyId,
    class_date: new Date().toISOString().slice(0, 10),
    period,
    status: record.status,
  }));
  const { error } = await client().from('attendance_records').upsert(rows, {
    onConflict: 'subject_id,student_id,class_date,period',
  });
  if (error) throw new Error(error.message);
}

export function summarizeDepartments(
  profiles: Row[],
  subjects: Row[],
  attendance: Row[],
): DepartmentSummary[] {
  const departments = [...new Set(profiles.map((profile) => profile.department).filter(Boolean))] as string[];
  return departments.map((name, index) => {
    const departmentProfiles = profiles.filter((profile) => profile.department === name);
    const departmentSubjectIds = new Set(subjects.filter((subject) => subject.department === name).map((subject) => subject.id));
    const departmentRecords = attendance.filter((record) => departmentSubjectIds.has(record.subject_id));
    const present = departmentRecords.filter((record) => record.status === 'Present' || record.status === 'Late').length;
    const students = departmentProfiles.filter((profile) => profile.role === 'student');
    const faculty = departmentProfiles.filter((profile) => profile.role === 'faculty');
    const percentages = students.map((student) => {
      const studentRecords = departmentRecords.filter((record) => record.student_id === student.id);
      if (!studentRecords.length) return 100;
      return (studentRecords.filter((record) => record.status === 'Present' || record.status === 'Late').length / studentRecords.length) * 100;
    });
    const averageAttendance = departmentRecords.length ? Math.round((present / departmentRecords.length) * 1000) / 10 : 0;
    return {
      id: name,
      name,
      code: name.split(/\s+/).map((part) => part[0]).join('').slice(0, 3).toUpperCase() || `D${index + 1}`,
      studentCount: students.length,
      facultyCount: faculty.length,
      averageAttendance,
      lowAttendanceCount: percentages.filter((percentage) => percentage < 75).length,
    };
  });
}

export async function fetchAdminDashboard(): Promise<AdminDashboardData> {
  const db = client();
  const [profileResult, subjectResult, attendanceResult] = await Promise.all([
    db.from('profiles').select('id,role,department'),
    db.from('subjects').select('id,department'),
    db.from('attendance_records').select('subject_id,student_id,status,class_date'),
  ]);
  const profiles = checked<Row[]>(profileResult);
  const subjects = checked<Row[]>(subjectResult);
  const attendance = checked<Row[]>(attendanceResult);
  const departments = summarizeDepartments(profiles, subjects, attendance);
  const now = new Date();
  const monthlyTrend = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
    const monthRecords = attendance.filter((record) => {
      const recordDate = new Date(`${record.class_date}T00:00:00`);
      return recordDate.getFullYear() === date.getFullYear() && recordDate.getMonth() === date.getMonth();
    });
    const present = monthRecords.filter((record) => record.status === 'Present' || record.status === 'Late').length;
    return {
      month: date.toLocaleDateString(undefined, { month: 'short' }),
      averageAttendance: monthRecords.length ? Math.round((present / monthRecords.length) * 1000) / 10 : 0,
      threshold: 75,
    };
  });
  return { departments, monthlyTrend };
}