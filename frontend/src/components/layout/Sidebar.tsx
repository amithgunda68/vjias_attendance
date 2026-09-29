import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Calendar,
  Clock,
  History,
  Users,
  Building2,
  CheckCircle2,
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
  ];

  const facultyLinks = [
    { name: 'Faculty Dashboard', path: '/faculty', icon: LayoutDashboard },
    { name: 'Today\'s Classes', path: '/faculty#schedule', icon: Clock },
    { name: 'Mark Attendance', path: '/faculty#marking', icon: CheckCircle2 },
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
  let badgeColor = 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60';

  if (role === 'faculty') {
    links = facultyLinks;
    roleTitle = 'Faculty Portal';
    badgeColor = 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/60';
  } else if (role === 'admin') {
    links = adminLinks;
    roleTitle = 'Admin Portal';
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60';
  }

  const content = (
    <div className="flex h-full flex-col justify-between bg-white dark:bg-[#0c1222] border-r border-slate-200/90 dark:border-slate-800 w-64 transition-colors">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1 rounded-lg bg-white/5 dark:bg-white/10">
              <img
                src="/vjias-logo.png"
                alt="VJIAS Logo"
                className="h-10 w-auto max-w-[170px] object-contain"
              />
            </div>
          </div>
          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 shrink-0 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Role Badge */}
        <div className="px-5 py-3.5 bg-slate-50/70 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Active Mode</span>
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
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-2xs dark:bg-indigo-950/70 dark:text-indigo-300 dark:border dark:border-indigo-800/40'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100'
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
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-300 dark:border-slate-700">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-xs">
                {user?.name.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{user?.name}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate capitalize">{role}</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1">
            <Shield className="h-3 w-3 text-emerald-500" /> VJIAS Academic OS
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
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
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
