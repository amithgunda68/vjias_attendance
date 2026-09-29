import React, { useState } from 'react';
import {
  GraduationCap,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import {
  DEMO_STUDENT,
  STUDENT_SUBJECTS,
  STUDENT_ATTENDANCE_HISTORY,
  TODAY_TIMETABLE,
} from '../services/mockData';
import {
  calculatePercentage,
  getAttendanceTier,
  getTierColorClasses,
} from '../utils/attendance';

export const StudentDashboard: React.FC = () => {

  // Aggregate overall attendance stats
  const totalPresent = STUDENT_SUBJECTS.reduce((acc, sub) => acc + sub.presentClasses, 0);
  const totalClasses = STUDENT_SUBJECTS.reduce((acc, sub) => acc + sub.totalClasses, 0);
  const totalAbsent = totalClasses - totalPresent;
  const overallPercentage = calculatePercentage(totalPresent, totalClasses);
  const overallTier = getAttendanceTier(overallPercentage);
  const tierClasses = getTierColorClasses(overallTier);


  // History search/filter state
  const [historyFilter, setHistoryFilter] = useState<string>('all');
  const filteredHistory = STUDENT_ATTENDANCE_HISTORY.filter((item) => {
    if (historyFilter === 'all') return true;
    return item.status.toLowerCase() === historyFilter.toLowerCase();
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Student Welcome & Profile Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800/80">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white/10 p-1 backdrop-blur-md border border-white/20 shrink-0">
              <img
                src={DEMO_STUDENT.avatar}
                alt={DEMO_STUDENT.name}
                className="h-full w-full object-cover rounded-xl"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Welcome back, {DEMO_STUDENT.name}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/30 px-2.5 py-0.5 text-xs font-semibold text-indigo-200 border border-indigo-400/30">
                  <GraduationCap className="h-3.5 w-3.5" /> HT No: {DEMO_STUDENT.hallTicketNumber || DEMO_STUDENT.rollNumber}
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-slate-300">
                {DEMO_STUDENT.course} • Semester {DEMO_STUDENT.semester} • {DEMO_STUDENT.section} ({DEMO_STUDENT.academicYear})
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{DEMO_STUDENT.department}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/10 rounded-xl p-3 sm:px-5 backdrop-blur-md border border-white/10">
            <div className="text-right">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">Overall Status</p>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-2xl font-black text-white">{overallPercentage}%</span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                    overallTier === 'Excellent' || overallTier === 'Good'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {overallTier}
                </span>
              </div>
            </div>
            <div className="h-10 w-1 rounded bg-white/20" />
            <div className="text-xs text-slate-300">
              <p className="font-semibold text-white">Min. 75%</p>
              <p className="text-[11px] text-slate-400">Eligibility Criteria</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Attendance"
          value={`${overallPercentage}%`}
          subtitle={`Current Tier: ${overallTier}`}
          icon={<TrendingUp className="h-5 w-5" />}
          iconBgColor={tierClasses.bg + ' ' + tierClasses.text}
          trend={{ value: '1.2% this month', isPositive: true }}
        />
        <StatCard
          title="Attended Classes"
          value={totalPresent}
          subtitle="Total verified lecture hours"
          icon={<CheckCircle2 className="h-5 w-5" />}
          iconBgColor="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
        />
        <StatCard
          title="Missed Classes"
          value={totalAbsent}
          subtitle="Absences recorded"
          icon={<XCircle className="h-5 w-5" />}
          iconBgColor="bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
        />
        <StatCard
          title="Conducted Classes"
          value={totalClasses}
          subtitle="Cumulative semester sessions"
          icon={<Calendar className="h-5 w-5" />}
          iconBgColor="bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
        />
      </div>

      {/* Subject Cards Section */}
      <div id="subjects" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Enrolled Course Attendance</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Real-time attendance breakdown by subject and instructor</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
            {STUDENT_SUBJECTS.length} Subjects
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STUDENT_SUBJECTS.map((sub) => {
            const isBelow = sub.percentage < 75;
            return (
              <div
                key={sub.id}
                className={`bg-white dark:bg-slate-900/90 rounded-xl border p-5 shadow-xs transition-all hover:shadow-md ${
                  isBelow
                    ? 'border-rose-300 dark:border-rose-800/80 ring-1 ring-rose-200 dark:ring-rose-900/30'
                    : 'border-slate-200/90 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-300 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-800/50">
                        {sub.code}
                      </span>
                      <Badge variant="tier" tier={sub.tier}>
                        {sub.tier}
                      </Badge>
                      {isBelow && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800/60">
                          <AlertTriangle className="h-3 w-3" /> Critical
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {sub.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Instructor: {sub.facultyName}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{sub.percentage}%</span>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                      {sub.presentClasses} / {sub.totalClasses} classes
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-medium">
                    <span>Progress to Target</span>
                    <span>Min Req: 75%</span>
                  </div>
                  <ProgressBar value={sub.percentage} threshold={75} />
                </div>
              </div>
            );
          })}
        </div>
      </div>



      {/* Timetable & Recent Attendance History Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Schedule (Section 13) */}
        <div id="timetable" className="lg:col-span-5 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Today's Timetable</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Friday class schedule & lecture venues</p>
            </div>
            <Clock className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
          </div>

          <div className="space-y-3">
            {TODAY_TIMETABLE.map((slot) => (
              <div
                key={slot.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-300 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-800/50">
                      Period {slot.period}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{slot.time}</span>
                  </div>
                  <p className="mt-1 text-xs font-bold text-slate-800 dark:text-slate-200">{slot.subjectName}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{slot.room} • {slot.faculty}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600" />
              </div>
            ))}
          </div>
        </div>

        {/* Attendance History (Section 10) */}
        <div id="history" className="lg:col-span-7 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4 gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Attendance Records</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Verified session-wise attendance logs</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setHistoryFilter('all')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                  historyFilter === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setHistoryFilter('present')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                  historyFilter === 'present'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Present
              </button>
              <button
                onClick={() => setHistoryFilter('absent')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                  historyFilter === 'absent'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Absent
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] border-y border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Period</th>
                  <th className="py-2.5 px-3">Instructor</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredHistory.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-300">{rec.date}</td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-900 dark:text-white">{rec.subjectName}</span>
                      <span className="block text-[10px] text-slate-400 dark:text-slate-500">{rec.subjectCode}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">Period {rec.period}</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{rec.faculty}</td>
                    <td className="py-3 px-3 text-right">
                      <Badge variant="status" status={rec.status}>
                        {rec.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
