import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Calendar,
  Clock,
  Calculator,
  History,
  Users,
  Building2,
  CheckCircle2,
  AlertTriangle,
  FileBarChart2,
  Settings,
  Shield,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { role, user } = useAuth();

  const studentLinks = [
    { name: 'Dashboard', path: '/student', icon: LayoutDashboard },
    { name: 'Subject Attendance', path: '/student#subjects', icon: BookOpen },
    { name: 'Attendance History', path: '/student#history', icon: History },
    { name: 'Calendar', path: '/student#calendar', icon: Calendar },
    { name: 'Timetable', path: '/student#timetable', icon: Clock },
    { name: 'Target Calculator', path: '/student#calculator', icon: Calculator },
  ];

  const facultyLinks = [
    { name: 'Faculty Dashboard', path: '/faculty', icon: LayoutDashboard },
    { name: 'Today\'s Classes', path: '/faculty#schedule', icon: Clock },
    { name: 'Mark Attendance', path: '/faculty#marking', icon: CheckCircle2 },
    { name: 'Low Attendance Alert', path: '/faculty#watchlist', icon: AlertTriangle },
    { name: 'Subject Reports', path: '/faculty#reports', icon: FileBarChart2 },
  ];

  const adminLinks = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Department Analytics', path: '/admin#departments', icon: Building2 },
    { name: 'Student Directory', path: '/admin#students', icon: Users },
    { name: 'Faculty Directory', path: '/admin#faculty', icon: GraduationCap },
    { name: 'College Reports', path: '/admin#reports', icon: FileBarChart2 },
    { name: 'Settings & Thresholds', path: '/admin#settings', icon: Settings },
  ];

  let links = studentLinks;
  let roleTitle = 'Student Portal';
  let badgeColor = 'bg-blue-100 text-blue-800 border-blue-200';

  if (role === 'faculty') {
    links = facultyLinks;
    roleTitle = 'Faculty Portal';
    badgeColor = 'bg-purple-100 text-purple-800 border-purple-200';
  } else if (role === 'admin') {
    links = adminLinks;
    roleTitle = 'Admin Portal';
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
  }

  const content = (
    <div className="flex h-full flex-col justify-between bg-white border-r border-slate-200/90 w-64">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="/vjias-logo.png"
              alt="VJIAS Logo"
              className="h-10 w-auto max-w-[170px] object-contain"
            />
          </div>
          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 shrink-0"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Role Badge */}
        <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Active Mode</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${badgeColor}`}>
              {roleTitle}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-bold text-slate-600 text-xs">
                {user?.name.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-800 truncate">{user?.name}</p>
            <p className="text-[11px] text-slate-500 truncate capitalize">{role}</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Shield className="h-3 w-3 text-emerald-600" /> VJIAS Academic OS
          </span>
          <span>v2.4</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden lg:flex lg:flex-shrink-0 min-h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 flex max-w-full animate-in slide-in-from-left">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
