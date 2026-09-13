import React, { useState } from 'react';
import {
  Users,
  BookOpen,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  UserCheck,
  Check,
  X,
  BarChart3,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { StatCard } from '../components/common/StatCard';
import { Modal } from '../components/common/Modal';
import {
  DEMO_FACULTY,
  FACULTY_SCHEDULE,
  INITIAL_STUDENT_ROSTER,
  LOW_ATTENDANCE_WATCHLIST,
} from '../services/mockData';
import type { FacultyClassSchedule, StudentRosterItem } from '../types';

export const FacultyDashboard: React.FC = () => {
  const [schedule, setSchedule] = useState<FacultyClassSchedule[]>(FACULTY_SCHEDULE);
  const [activeMarkingClass, setActiveMarkingClass] = useState<FacultyClassSchedule | null>(null);
  const [roster, setRoster] = useState<StudentRosterItem[]>(INITIAL_STUDENT_ROSTER);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Subject attendance comparison chart data
  const subjectChartData = [
    { subject: 'Data Structures (CS301)', average: 84.0, benchmark: 75 },
    { subject: 'Database Systems (CS304)', average: 79.2, benchmark: 75 },
    { subject: 'Cloud Computing (CS402)', average: 88.5, benchmark: 75 },
  ];

  // Open the Attendance Marking interface for a selected class
  const handleOpenMarking = (cls: FacultyClassSchedule) => {
    setActiveMarkingClass(cls);
  };

  // Toggle student status between Present and Absent
  const handleToggleStatus = (studentId: string) => {
    setRoster((prev) =>
      prev.map((st) => {
        if (st.id === studentId) {
          const nextStatus = st.status === 'Present' ? 'Absent' : 'Present';
          return { ...st, status: nextStatus };
        }
        return st;
      })
    );
  };

  // Mark all students present with one click (Section 16 requirement)
  const handleMarkAllPresent = () => {
    setRoster((prev) => prev.map((st) => ({ ...st, status: 'Present' })));
  };

  // Submit attendance and record confirmation
  const handleSubmitAttendance = () => {
    if (!activeMarkingClass) return;
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      // Mark this class as completed in state
      setSchedule((prev) =>
        prev.map((c) =>
          c.id === activeMarkingClass.id ? { ...c, attendanceCompleted: true } : c
        )
      );
      const presentCount = roster.filter((s) => s.status === 'Present').length;
      const absentCount = roster.filter((s) => s.status === 'Absent').length;

      setActiveMarkingClass(null);
      setSuccessToast(
        `Attendance recorded successfully for ${activeMarkingClass.subjectCode} (${activeMarkingClass.section}). Present: ${presentCount}, Absent: ${absentCount}.`
      );

      setTimeout(() => setSuccessToast(null), 6000);
    }, 500);
  };

  const presentCount = roster.filter((s) => s.status === 'Present').length;
  const absentCount = roster.filter((s) => s.status === 'Absent').length;

  const filteredRoster = roster.filter(
    (st) =>
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Toast alert */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-emerald-900 text-white px-5 py-3.5 shadow-2xl border border-emerald-700 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{successToast}</span>
          <button
            onClick={() => setSuccessToast(null)}
            className="ml-2 text-emerald-300 hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Faculty Welcome & Profile Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white/10 p-1 backdrop-blur-md border border-white/20 shrink-0">
              <img
                src={DEMO_FACULTY.avatar}
                alt={DEMO_FACULTY.name}
                className="h-full w-full object-cover rounded-xl"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {DEMO_FACULTY.name}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/30 px-2.5 py-0.5 text-xs font-semibold text-purple-200 border border-purple-400/30">
                  ID: {DEMO_FACULTY.facultyId}
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-purple-200/90">
                {DEMO_FACULTY.designation} • {DEMO_FACULTY.department}
              </p>
              <div className="flex items-center gap-2 mt-2">
                {DEMO_FACULTY.assignedSubjects.map((sub, i) => (
                  <span
                    key={i}
                    className="text-[11px] bg-white/10 px-2 py-0.5 rounded text-slate-300 font-medium"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenMarking(schedule[0])}
              className="flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              <UserCheck className="h-4 w-4" />
              <span>MARK ATTENDANCE</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Faculty Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Students"
          value="125"
          subtitle="Across 3 sections"
          icon={<Users className="h-5 w-5" />}
          iconBgColor="bg-purple-50 text-purple-600"
        />
        <StatCard
          title="Subjects Handled"
          value={DEMO_FACULTY.assignedSubjects.length}
          subtitle="Undergraduate & Masters"
          icon={<BookOpen className="h-5 w-5" />}
          iconBgColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Classes Scheduled Today"
          value={schedule.length}
          subtitle="Friday academic schedule"
          icon={<Clock className="h-5 w-5" />}
          iconBgColor="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Marking Completion"
          value={`${Math.round(
            (schedule.filter((c) => c.attendanceCompleted).length / schedule.length) * 100
          )}%`}
          subtitle={`${schedule.filter((c) => c.attendanceCompleted).length} of ${schedule.length} completed`}
          icon={<CheckCircle2 className="h-5 w-5" />}
          iconBgColor="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Today's Classes & Marking Actions (Section 15 & 16) */}
      <div id="schedule" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900">Today's Class Schedule</h2>
            <p className="text-xs text-slate-500">
              Select any lecture to mark or review student attendance
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1 rounded-lg border border-slate-200">
            Friday, 11 September 2026
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {schedule.map((cls) => (
            <div
              key={cls.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                    Period {cls.period}
                  </span>
                  {cls.attendanceCompleted ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <Check className="h-3 w-3" /> Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 animate-pulse">
                      <Clock className="h-3 w-3" /> Pending
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">{cls.subjectName}</h3>
                <p className="text-xs font-semibold text-indigo-600 mt-0.5">{cls.subjectCode}</p>
                <p className="text-xs text-slate-500 mt-2">
                  {cls.section} • {cls.room}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {cls.time} • {cls.totalStudents} Enrolled Students
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleOpenMarking(cls)}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold transition-all cursor-pointer ${
                    cls.attendanceCompleted
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-200'
                  }`}
                >
                  <UserCheck className="h-4 w-4" />
                  <span>{cls.attendanceCompleted ? 'Review / Edit Attendance' : 'Mark Attendance'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Low-Attendance Watchlist & Subject Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Low Attendance Watchlist (Section 15 & 78) */}
        <div id="watchlist" className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                <AlertTriangle className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Low Attendance Watchlist</h3>
                <p className="text-xs text-slate-500">Students falling below institutional 75% threshold</p>
              </div>
            </div>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              {LOW_ATTENDANCE_WATCHLIST.length} Students
            </span>
          </div>

          <div className="space-y-3">
            {LOW_ATTENDANCE_WATCHLIST.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-3 rounded-xl border border-rose-100 bg-rose-50/40 hover:bg-rose-50/70 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{student.name}</span>
                    <span className="text-[11px] text-slate-500 font-mono">({student.rollNumber})</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {student.subject} • <span className="text-rose-600 font-medium">{student.classesMissed} classes missed</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-sm font-black text-rose-600">{student.attendance}%</span>
                    <span className="block text-[10px] text-rose-500 font-medium">Critical</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`Academic warning dispatched to ${student.name} (${student.rollNumber}).`)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-xs transition-all cursor-pointer"
                    title="Send Warning Notice"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Comparison Chart (Recharts) */}
        <div id="reports" className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Subject Attendance Performance</h3>
                <p className="text-xs text-slate-500">Average class attendance across assigned courses</p>
              </div>
              <BarChart3 className="h-4.5 w-4.5 text-slate-400" />
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="subject" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={[50, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                    }}
                    formatter={(value: any) => [`${value}%`, 'Average Attendance']}
                  />
                  <ReferenceLine y={75} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: 'Threshold (75%)', fill: '#f43f5e', fontSize: 10 }} />
                  <Bar dataKey="average" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Overall Batch Average: <strong>83.9%</strong></span>
            <span className="text-emerald-600 font-medium">All subjects above minimum requirement</span>
          </div>
        </div>
      </div>

      {/* Attendance Marking Interface Modal (Section 16) */}
      <Modal
        isOpen={!!activeMarkingClass}
        onClose={() => setActiveMarkingClass(null)}
        title={activeMarkingClass ? `Mark Attendance: ${activeMarkingClass.subjectCode}` : 'Mark Attendance'}
        subtitle={
          activeMarkingClass
            ? `${activeMarkingClass.subjectName} • ${activeMarkingClass.section} • Period ${activeMarkingClass.period}`
            : ''
        }
        maxWidth="2xl"
      >
        {activeMarkingClass && (
          <div className="space-y-4">
            {/* Header controls & stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-[11px] font-semibold uppercase text-slate-400">Total Enrolled</span>
                  <p className="text-base font-bold text-slate-800">{roster.length}</p>
                </div>
                <div className="h-7 w-px bg-slate-200" />
                <div>
                  <span className="text-[11px] font-semibold uppercase text-emerald-600">Present</span>
                  <p className="text-base font-bold text-emerald-700">{presentCount}</p>
                </div>
                <div className="h-7 w-px bg-slate-200" />
                <div>
                  <span className="text-[11px] font-semibold uppercase text-rose-600">Absent</span>
                  <p className="text-base font-bold text-rose-700">{absentCount}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleMarkAllPresent}
                  className="rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer"
                >
                  Mark All Present
                </button>
              </div>
            </div>

            {/* Quick search inside roster */}
            <div className="relative">
              <input
                type="text"
                placeholder="Filter by student name or roll number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-1.5 px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-600"
              />
            </div>

            {/* Student Roster Table (Section 16 Roll List) */}
            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/90 text-slate-500 uppercase tracking-wider text-[10px] sticky top-0 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Roll No</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Current %</th>
                    <th className="py-2.5 px-3 text-right">Attendance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRoster.map((st) => {
                    const isPresent = st.status === 'Present';
                    return (
                      <tr key={st.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-medium text-slate-700">
                          {st.rollNumber}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{st.name}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`font-semibold ${
                              st.currentPercentage < 75 ? 'text-rose-600 font-bold' : 'text-slate-600'
                            }`}
                          >
                            {st.currentPercentage}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(st.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isPresent
                                ? 'bg-emerald-500 text-white shadow-xs hover:bg-emerald-600'
                                : 'bg-rose-500 text-white shadow-xs hover:bg-rose-600'
                            }`}
                          >
                            {isPresent ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                            <span>{st.status}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Submission actions & Confirmation */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <p className="text-[11px] text-slate-400">
                Action will create a permanent audit log entry under your faculty ID.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveMarkingClass(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitAttendance}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-200 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Recording...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Submit Attendance</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
