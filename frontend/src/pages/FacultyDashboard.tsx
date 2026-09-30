import React, { useEffect, useState } from 'react';
import {
  Users,
  BookOpen,
  CheckCircle2,
  Clock,
  UserCheck,
  Check,
  X,
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { Modal } from '../components/common/Modal';
import {
  DEMO_FACULTY,
  FACULTY_SCHEDULE,
  INITIAL_STUDENT_ROSTER,
} from '../services/mockData';
import type { FacultyClassSchedule, StudentRosterItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { fetchFacultyDashboard, fetchFacultyRoster, saveAttendance } from '../services/portalData';

export const FacultyDashboard: React.FC = () => {
  const { user, isDemo } = useAuth();
  const faculty = user?.role === 'faculty' ? user : DEMO_FACULTY;
  const [schedule, setSchedule] = useState<FacultyClassSchedule[]>(isDemo ? FACULTY_SCHEDULE : []);
  const [activeMarkingClass, setActiveMarkingClass] = useState<FacultyClassSchedule | null>(null);
  const [roster, setRoster] = useState<StudentRosterItem[]>(isDemo ? INITIAL_STUDENT_ROSTER : []);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(!isDemo);
  const [dataError, setDataError] = useState('');

  useEffect(() => {
    if (isDemo || user?.role !== 'faculty') return;
    let active = true;
    fetchFacultyDashboard(user.id)
      .then((data) => {
        if (!active) return;
        setSchedule(data.schedule);
        setRoster(data.roster);
        setDataError('');
      })
      .catch((error: unknown) => {
        if (active) setDataError(error instanceof Error ? error.message : 'Unable to load faculty data.');
      })
      .finally(() => {
        if (active) setDataLoading(false);
      });
    return () => { active = false; };
  }, [isDemo, user]);

  // Open the Attendance Marking interface for a selected class
  const handleOpenMarking = async (cls: FacultyClassSchedule) => {
    setActiveMarkingClass(cls);
    if (!isDemo) {
      try {
        setRoster(await fetchFacultyRoster(cls.subjectId, cls.period));
      } catch (error) {
        setDataError(error instanceof Error ? error.message : 'Unable to load the class roster.');
      }
    }
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
  const handleSubmitAttendance = async () => {
    if (!activeMarkingClass) return;
    setIsSubmitting(true);
    try {
      if (!isDemo && user?.role === 'faculty') {
        await saveAttendance(user.id, activeMarkingClass.subjectId, activeMarkingClass.period, roster);
      } else {
        await new Promise((resolve) => window.setTimeout(resolve, 500));
      }
      setSchedule((prev) => prev.map((item) => item.id === activeMarkingClass.id
        ? { ...item, attendanceCompleted: true }
        : item));
      const presentCount = roster.filter((student) => student.status === 'Present').length;
      const absentCount = roster.filter((student) => student.status === 'Absent').length;
      setActiveMarkingClass(null);
      setSuccessToast(`Attendance recorded for ${activeMarkingClass.subjectCode} (${activeMarkingClass.section}). Present: ${presentCount}, Absent: ${absentCount}.`);
      window.setTimeout(() => setSuccessToast(null), 6000);
      setDataError('');
    } catch (error) {
      setDataError(error instanceof Error ? error.message : 'Unable to save attendance.');
    } finally {
      setIsSubmitting(false);
    }
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
      {dataLoading && <p role="status" className="text-sm text-slate-500">Loading your classes...</p>}
      {dataError && <p role="alert" className="rounded-lg border border-rose-300 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">{dataError}</p>}
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
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800/80">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white/10 p-1 backdrop-blur-md border border-white/20 shrink-0">
              <img
                src={faculty.avatar}
                alt={faculty.name}
                className="h-full w-full object-cover rounded-xl"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {faculty.name}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/30 px-2.5 py-0.5 text-xs font-semibold text-purple-200 border border-purple-400/30">
                  ID: {faculty.facultyId}
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-purple-200/90">
                {faculty.designation} • {faculty.department}
              </p>
              <div className="flex items-center gap-2 mt-2">
                {(isDemo ? faculty.assignedSubjects : [...new Set(schedule.map((item) => `${item.subjectCode} - ${item.subjectName}`))]).map((sub, i) => (
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
          value={new Set(schedule.flatMap((item) => item.subjectId)).size ? schedule.reduce((sum, item) => sum + item.totalStudents, 0) : 0}
          subtitle={`Across ${schedule.length} scheduled classes`}
          icon={<Users className="h-5 w-5" />}
          iconBgColor="bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400"
        />
        <StatCard
          title="Subjects Handled"
          value={isDemo ? faculty.assignedSubjects.length : new Set(schedule.map((item) => item.subjectId)).size}
          subtitle="Undergraduate & Masters"
          icon={<BookOpen className="h-5 w-5" />}
          iconBgColor="bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
        />
        <StatCard
          title="Classes Scheduled Today"
          value={schedule.length}
          subtitle="Friday academic schedule"
          icon={<Clock className="h-5 w-5" />}
          iconBgColor="bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
        />
        <StatCard
          title="Marking Completion"
          value={`${Math.round(
            (schedule.length ? schedule.filter((c) => c.attendanceCompleted).length / schedule.length : 0) * 100
          )}%`}
          subtitle={`${schedule.filter((c) => c.attendanceCompleted).length} of ${schedule.length} completed`}
          icon={<CheckCircle2 className="h-5 w-5" />}
          iconBgColor="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
        />
      </div>

      {/* Today's Classes & Marking Actions (Section 15 & 16) */}
      <div id="schedule" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Today's Class Schedule</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select any lecture to mark or review student attendance
            </p>
          </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {schedule.map((cls) => (
            <div
              key={cls.id}
              className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-300 px-2 py-0.5 rounded border border-purple-100 dark:border-purple-800/50">
                    Period {cls.period}
                  </span>
                  {cls.attendanceCompleted ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">
                      <Check className="h-3 w-3" /> Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/60 animate-pulse">
                      <Clock className="h-3 w-3" /> Pending
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">{cls.subjectName}</h3>
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">{cls.subjectCode}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  {cls.section} • {cls.room}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  {cls.time} • {cls.totalStudents} Enrolled Students
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => handleOpenMarking(cls)}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold transition-all cursor-pointer ${
                    cls.attendanceCompleted
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300'
                      : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-600/30'
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-[11px] font-semibold uppercase text-slate-400 dark:text-slate-500">Total Enrolled</span>
                  <p className="text-base font-bold text-slate-800 dark:text-slate-200">{roster.length}</p>
                </div>
                <div className="h-7 w-px bg-slate-200 dark:bg-slate-700" />
                <div>
                  <span className="text-[11px] font-semibold uppercase text-emerald-600 dark:text-emerald-400">Present</span>
                  <p className="text-base font-bold text-emerald-700 dark:text-emerald-400">{presentCount}</p>
                </div>
                <div className="h-7 w-px bg-slate-200 dark:bg-slate-700" />
                <div>
                  <span className="text-[11px] font-semibold uppercase text-rose-600 dark:text-rose-400">Absent</span>
                  <p className="text-base font-bold text-rose-700 dark:text-rose-400">{absentCount}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleMarkAllPresent}
                  className="rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer"
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
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-1.5 px-3 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-600"
              />
            </div>

            {/* Student Roster Table (Section 16 Roll List) */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/90 dark:bg-slate-800/90 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] sticky top-0 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Roll No</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Current %</th>
                    <th className="py-2.5 px-3 text-right">Attendance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredRoster.map((st) => {
                    const isPresent = st.status === 'Present';
                    return (
                      <tr key={st.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-medium text-slate-700 dark:text-slate-300">
                          {st.rollNumber}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{st.name}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`font-semibold ${
                              st.currentPercentage < 75 ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-600 dark:text-slate-400'
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
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Action will create a permanent audit log entry under your faculty ID.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveMarkingClass(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitAttendance}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-600/30 transition-all disabled:opacity-50 cursor-pointer"
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
