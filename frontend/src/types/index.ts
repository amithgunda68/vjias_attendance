export type UserRole = 'student' | 'faculty' | 'admin';

export type AttendanceTier = 'Excellent' | 'Good' | 'Warning' | 'Critical';

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}

export interface StudentProfile extends User {
  role: 'student';
  rollNumber: string;
  hallTicketNumber?: string;
  course: string;
  semester: number;
  section: string;
  academicYear: string;
}

export interface FacultyProfile extends User {
  role: 'faculty';
  facultyId: string;
  designation: string;
  assignedSubjects: string[];
}

export interface AdminProfile extends User {
  role: 'admin';
  adminId: string;
  title: string;
}

export interface SubjectAttendance {
  id: string;
  code: string;
  name: string;
  credits: number;
  facultyName: string;
  department: string;
  semester: number;
  presentClasses: number;
  totalClasses: number;
  percentage: number;
  tier: AttendanceTier;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  period: number;
  faculty: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface TimetableSlot {
  id: string;
  time: string;
  period: number;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  subjectCode: string;
  subjectName: string;
  room: string;
  faculty: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  author: string;
  priority: 'Normal' | 'Important' | 'Urgent';
}

export interface FacultyClassSchedule {
  id: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  section: string;
  course: string;
  time: string;
  period: number;
  room: string;
  totalStudents: number;
  attendanceCompleted: boolean;
}

export interface StudentRosterItem {
  id: string;
  rollNumber: string;
  name: string;
  status: AttendanceStatus;
  currentPercentage: number;
}

export interface DepartmentSummary {
  id: string;
  name: string;
  code: string;
  studentCount: number;
  facultyCount: number;
  averageAttendance: number;
  lowAttendanceCount: number;
}
