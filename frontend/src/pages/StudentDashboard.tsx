import React, { useState } from 'react';
import {
  GraduationCap,
  Calendar,
  Clock,
  Calculator,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import {
  DEMO_STUDENT,
  STUDENT_SUBJECTS,
  STUDENT_ATTENDANCE_HISTORY,
  STUDENT_WEEKLY_TREND,
  TODAY_TIMETABLE,
} from '../services/mockData';
import {
  calculatePercentage,
  getAttendanceTier,
  getTierColorClasses,
  calculateRequiredClasses,
} from '../utils/attendance';

export const StudentDashboard: React.FC = () => {
  // Aggregate overall attendance stats
  const totalPresent = STUDENT_SUBJECTS.reduce((acc, sub) => acc + sub.presentClasses, 0);
  const totalClasses = STUDENT_SUBJECTS.reduce((acc, sub) => acc + sub.totalClasses, 0);
  const totalAbsent = totalClasses - totalPresent;
  const overallPercentage = calculatePercentage(totalPresent, totalClasses);
  const overallTier = getAttendanceTier(overallPercentage);
  const tierClasses = getTierColorClasses(overallTier);

  // Attendance Calculator state
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('overall');
  const [customTarget, setCustomTarget] = useState<number>(75);

  const calcPresent =
    selectedSubjectId === 'overall'
      ? totalPresent
      : STUDENT_SUBJECTS.find((s) => s.id === selectedSubjectId)?.presentClasses || 0;
  const calcTotal =
    selectedSubjectId === 'overall'
      ? totalClasses
      : STUDENT_SUBJECTS.find((s) => s.id === selectedSubjectId)?.totalClasses || 0;

  const calcResult = calculateRequiredClasses(calcPresent, calcTotal, customTarget);

  // History search/filter state
  const [historyFilter, setHistoryFilter] = useState<string>('all');
  const filteredHistory = STUDENT_ATTENDANCE_HISTORY.filter((item) => {
    if (historyFilter === 'all') return true;
    return item.status.toLowerCase() === historyFilter.toLowerCase();
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Student Welcome & Profile Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
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
          iconBgColor="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Missed Classes"
          value={totalAbsent}
          subtitle="Absences recorded"
          icon={<XCircle className="h-5 w-5" />}
          iconBgColor="bg-rose-50 text-rose-600"
        />
        <StatCard
          title="Conducted Classes"
          value={totalClasses}
          subtitle="Cumulative semester sessions"
          icon={<Calendar className="h-5 w-5" />}
          iconBgColor="bg-blue-50 text-blue-600"
        />
      </div>

      {/* Subject Cards Section */}
      <div id="subjects" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900">Enrolled Course Attendance</h2>
            <p className="text-xs text-slate-500">Real-time attendance breakdown by subject and instructor</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1 rounded-lg border border-slate-200">
            {STUDENT_SUBJECTS.length} Subjects
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STUDENT_SUBJECTS.map((sub) => {
            const isBelow = sub.percentage < 75;
            return (
              <div
                key={sub.id}
                className={`bg-white rounded-xl border p-5 shadow-xs transition-all hover:shadow-md ${
                  isBelow ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200/90'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {sub.code}
                      </span>
                      <Badge variant="tier" tier={sub.tier}>
                        {sub.tier}
                      </Badge>
                      {isBelow && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          <AlertTriangle className="h-3 w-3" /> Critical
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {sub.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">Instructor: {sub.facultyName}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">{sub.percentage}%</span>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                      {sub.presentClasses} / {sub.totalClasses} classes
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5 font-medium">
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

      {/* Attendance Calculator Widget & Weekly Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Attendance Calculator (Section 9 & 42) */}
        <div id="calculator" className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Calculator className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Attendance Target Calculator</h3>
                  <p className="text-xs text-slate-500">Calculate future classes needed to hit target percentage</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                <Sparkles className="h-3 w-3 text-amber-500" /> Smart Solver
              </span>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Scope / Subject
                </label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                >
                  <option value="overall">Overall Attendance ({totalPresent}/{totalClasses} classes - {overallPercentage}%)</option>
                  {STUDENT_SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code}: {s.name} ({s.presentClasses}/{s.totalClasses} classes - {s.percentage}%)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Target Percentage
                  </label>
                  <span className="text-sm font-bold text-indigo-700">{customTarget}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="95"
                  step="1"
                  value={customTarget}
                  onChange={(e) => setCustomTarget(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                  <span>60%</span>
                  <span className="text-indigo-600 font-bold">75% (Min Req)</span>
                  <span>85%</span>
                  <span>95%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Calculator Output */}
          <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-indigo-600 p-2 text-white shrink-0 mt-0.5">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-indigo-950">
                    {calcResult.isAlreadyAchieved
                      ? 'Target Achieved'
                      : `${calcResult.classesNeeded} Consecutive Classes`}
                  </span>
                </div>
                <p className="mt-1 text-xs text-indigo-900 leading-relaxed font-medium">
                  {calcResult.explanation}
                </p>
                <p className="mt-2 text-[11px] text-indigo-600/80 font-mono">
                  Applied Formula: (Present + x) / (Total + x) ≥ {customTarget}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 6-Week Attendance Timeline Chart (Section 12) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Attendance Timeline</h3>
                <p className="text-xs text-slate-500">Weekly progression compared to 75% institutional threshold</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-slate-600 font-medium">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 inline-block" /> Attendance
                </span>
                <span className="flex items-center gap-1 text-slate-400 font-medium">
                  <span className="h-1 w-3 bg-rose-400 inline-block" /> Min (75%)
                </span>
              </div>
            </div>

            <div className="mt-4 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={STUDENT_WEEKLY_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={[60, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                    }}
                    formatter={(value: any) => [`${value}%`, 'Attendance']}
                  />
                  <ReferenceLine y={75} stroke="#f43f5e" strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={{ fill: '#4f46e5', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Semester Average: <strong>82.5%</strong></span>
            <span className="text-emerald-600 font-medium flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" /> Above required benchmark
            </span>
          </div>
        </div>
      </div>

      {/* Timetable & Recent Attendance History Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Schedule (Section 13) */}
        <div id="timetable" className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Today's Timetable</h3>
              <p className="text-xs text-slate-500">Friday class schedule & lecture venues</p>
            </div>
            <Clock className="h-4.5 w-4.5 text-slate-400" />
          </div>

          <div className="space-y-3">
            {TODAY_TIMETABLE.map((slot) => (
              <div
                key={slot.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      Period {slot.period}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{slot.time}</span>
                  </div>
                  <p className="mt-1 text-xs font-bold text-slate-800">{slot.subjectName}</p>
                  <p className="text-[11px] text-slate-500">{slot.room} • {slot.faculty}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Attendance History (Section 10) */}
        <div id="history" className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 mb-4 gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Attendance Records</h3>
              <p className="text-xs text-slate-500">Verified session-wise attendance logs</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setHistoryFilter('all')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                  historyFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setHistoryFilter('present')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                  historyFilter === 'present' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Present
              </button>
              <button
                onClick={() => setHistoryFilter('absent')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                  historyFilter === 'absent' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Absent
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[10px] border-y border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Period</th>
                  <th className="py-2.5 px-3">Instructor</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistory.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-800">{rec.date}</td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-900">{rec.subjectName}</span>
                      <span className="block text-[10px] text-slate-400">{rec.subjectCode}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">Period {rec.period}</td>
                    <td className="py-3 px-3 text-slate-600">{rec.faculty}</td>
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
