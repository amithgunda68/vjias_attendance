import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  Building2,
  TrendingUp,
  AlertTriangle,
  Download,
  Settings,
  Plus,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import {
  BarChart,
  Bar,
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
import { Modal } from '../components/common/Modal';
import {
  DEMO_ADMIN,
  DEPARTMENTS_DATA,
  COLLEGE_MONTHLY_TREND,
} from '../services/mockData';

export const AdminDashboard: React.FC = () => {
  const [departments] = useState(DEPARTMENTS_DATA);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [minThreshold, setMinThreshold] = useState<number>(75);
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');
  const [exportScope, setExportScope] = useState<string>('college_summary');

  const totalStudents = departments.reduce((acc, d) => acc + d.studentCount, 0);
  const totalFaculty = departments.reduce((acc, d) => acc + d.facultyCount, 0);
  const totalLowAttendance = departments.reduce((acc, d) => acc + d.lowAttendanceCount, 0);
  const collegeAvgAttendance = Math.round(
    (departments.reduce((acc, d) => acc + d.averageAttendance, 0) / departments.length) * 10
  ) / 10;

  const handleExport = () => {
    // Generate simulated export download
    const filename = `veritas_${exportScope}_report_${new Date().toISOString().split('T')[0]}.${exportFormat}`;
    alert(`Report generated successfully: "${filename}". Download will start shortly.`);
    setExportModalOpen(false);
  };

  const handleSaveConfig = () => {
    alert(`Academic settings updated: Attendance threshold configured to ${minThreshold}%.`);
    setConfigModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Admin Executive Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white/10 p-1 backdrop-blur-md border border-white/20 shrink-0">
              <img
                src={DEMO_ADMIN.avatar}
                alt={DEMO_ADMIN.name}
                className="h-full w-full object-cover rounded-xl"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {DEMO_ADMIN.name}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/30 px-2.5 py-0.5 text-xs font-semibold text-amber-200 border border-amber-400/30">
                  <ShieldCheck className="h-3.5 w-3.5" /> Administrator
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-slate-300">
                {DEMO_ADMIN.title} • {DEMO_ADMIN.department}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Academic Year 2025-2026 • Term II (Fall)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setExportModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 text-xs sm:text-sm font-semibold border border-white/20 transition-all cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Export Reports</span>
            </button>
            <button
              onClick={() => setConfigModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white px-4 py-2.5 text-xs sm:text-sm font-bold shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
            >
              <Settings className="h-4 w-4" />
              <span>Configure Thresholds</span>
            </button>
          </div>
        </div>
      </div>

      {/* College-Level KPIs (Section 18) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Students"
          value={totalStudents.toLocaleString()}
          subtitle="Enrolled active scholars"
          icon={<Users className="h-5 w-5" />}
          iconBgColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Total Faculty"
          value={totalFaculty}
          subtitle="Full-time & adjunct"
          icon={<GraduationCap className="h-5 w-5" />}
          iconBgColor="bg-purple-50 text-purple-600"
        />
        <StatCard
          title="Departments"
          value={departments.length}
          subtitle="Engineering & Sciences"
          icon={<Building2 className="h-5 w-5" />}
          iconBgColor="bg-slate-100 text-slate-700"
        />
        <StatCard
          title="College Attendance"
          value={`${collegeAvgAttendance}%`}
          subtitle="Institution benchmark"
          icon={<TrendingUp className="h-5 w-5" />}
          iconBgColor="bg-emerald-50 text-emerald-600"
          trend={{ value: '0.8% vs last month', isPositive: true }}
        />
        <StatCard
          title="Below Threshold"
          value={totalLowAttendance}
          subtitle={`Students below ${minThreshold}%`}
          icon={<AlertTriangle className="h-5 w-5" />}
          iconBgColor="bg-rose-50 text-rose-600"
        />
      </div>

      {/* Institutional Analytics Charts (Section 18 & 12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department-Wise Attendance Comparison */}
        <div id="departments" className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Department Attendance Overview</h3>
                <p className="text-xs text-slate-500">Comparative attendance averages across academic departments</p>
              </div>
              <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                Min Req: {minThreshold}%
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departments} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="code" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={[60, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} unit="%" />
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
                  <ReferenceLine y={minThreshold} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: `Threshold (${minThreshold}%)`, fill: '#f43f5e', fontSize: 10 }} />
                  <Bar dataKey="averageAttendance" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Highest Attendance: <strong>Biotechnology (86.2%)</strong></span>
            <span className="text-rose-600 font-medium">Mechanical Engineering requires review (78.6%)</span>
          </div>
        </div>

        {/* Monthly Attendance Trends */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Institution Trend (6 Months)</h3>
                <p className="text-xs text-slate-500">Monthly aggregate attendance curve</p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={COLLEGE_MONTHLY_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={[70, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} unit="%" />
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
                    dataKey="averageAttendance"
                    stroke="#d97706"
                    strokeWidth={3}
                    dot={{ fill: '#d97706', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Overall Stability: <strong>Consistent (+0.4%)</strong></span>
          </div>
        </div>
      </div>

      {/* Department Breakdown Table & Management Panel (Section 22 & 23) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-4 gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Academic Departments & Compliance</h3>
            <p className="text-xs text-slate-500">Enrolment statistics, faculty ratio, and threshold non-compliance</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Add Department modal will be available in Phase 5.')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Department</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[10px] border-y border-slate-100">
              <tr>
                <th className="py-2.5 px-4">Department Name</th>
                <th className="py-2.5 px-4">Code</th>
                <th className="py-2.5 px-4">Students</th>
                <th className="py-2.5 px-4">Faculty</th>
                <th className="py-2.5 px-4">Avg. Attendance</th>
                <th className="py-2.5 px-4 text-right">Students Below {minThreshold}%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">{dept.name}</td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-500">{dept.code}</td>
                  <td className="py-3 px-4 text-slate-700">{dept.studentCount}</td>
                  <td className="py-3 px-4 text-slate-700">{dept.facultyCount}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900">{dept.averageAttendance}%</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 border border-rose-200">
                      {dept.lowAttendanceCount} students
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Reports Modal (Section 23) */}
      <Modal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title="Export Attendance Reports"
        subtitle="Download institutional audit records in CSV or PDF formats"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Report Type
            </label>
            <select
              value={exportScope}
              onChange={(e) => setExportScope(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-600"
            >
              <option value="college_summary">College Summary & Department Averages</option>
              <option value="low_attendance_debarment">Critical Low Attendance (Debarment List)</option>
              <option value="student_detailed_log">Full Student Session Attendance Log</option>
              <option value="faculty_workload">Faculty Marking Completion Audit</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              File Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setExportFormat('csv')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  exportFormat === 'csv'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-600/20'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                <span>CSV Spreadsheet</span>
              </button>
              <button
                type="button"
                onClick={() => setExportFormat('pdf')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  exportFormat === 'pdf'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-600/20'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileText className="h-4 w-4 text-rose-600" />
                <span>PDF Document</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              onClick={() => setExportModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md shadow-amber-200 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Generate & Download</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Configure Thresholds Modal (Section 8 & 22) */}
      <Modal
        isOpen={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
        title="Attendance Policy Configuration"
        subtitle="Adjust institutional attendance thresholds and academic eligibility rules"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Minimum Eligibility Threshold
              </label>
              <span className="text-sm font-black text-amber-700">{minThreshold}%</span>
            </div>
            <input
              type="range"
              min="65"
              max="85"
              value={minThreshold}
              onChange={(e) => setMinThreshold(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Default university standard is 75%. Students below this threshold are flagged for examination debarment.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 text-slate-600">
            <p className="font-semibold text-slate-800">Attendance Status Tiers (Section 8):</p>
            <p>• 90% - 100%: <span className="text-emerald-700 font-bold">Excellent</span></p>
            <p>• 80% - 89.9%: <span className="text-blue-700 font-bold">Good</span></p>
            <p>• {minThreshold}% - 79.9%: <span className="text-amber-700 font-bold">Warning</span></p>
            <p>• Below {minThreshold}%: <span className="text-rose-700 font-bold">Critical</span></p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              onClick={() => setConfigModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveConfig}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md shadow-amber-200 cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Save Policy</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
