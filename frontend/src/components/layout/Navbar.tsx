import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  LogOut,
  UserCheck,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import type { UserRole } from '../../types';
import { ANNOUNCEMENTS } from '../../services/mockData';
import { fetchAnnouncements } from '../../services/portalData';
import type { Announcement } from '../../types';

interface NavbarProps {
  onOpenMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu }) => {
  const { user, role, isDemo, demoLogin, logout } = useAuth();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<Announcement[]>(isDemo ? ANNOUNCEMENTS : []);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  useEffect(() => {
    if (isDemo || !user) return;
    let active = true;
    fetchAnnouncements().then((items) => {
      if (active) setAnnouncements(items);
    }).catch(() => {
      if (active) setAnnouncements([]);
    });
    return () => { active = false; };
  }, [isDemo, user]);

  const handleRoleChange = (newRole: UserRole) => {
    demoLogin(newRole);
    setShowRoleMenu(false);
    if (newRole === 'student') navigate('/student');
    else if (newRole === 'faculty') navigate('/faculty');
    else if (newRole === 'admin') navigate('/admin');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-auto min-h-16 w-full flex-wrap items-center justify-between gap-y-2 border-b border-slate-200/90 bg-white/95 px-4 py-2 backdrop-blur-md dark:bg-[#0c1222]/90 dark:border-slate-800 transition-colors sm:h-16 sm:flex-nowrap sm:py-0 sm:px-6">
      <div className="flex w-full items-center gap-3 sm:w-auto sm:gap-4">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 lg:hidden focus:outline-none cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Mobile Brand Logo */}
        <div className="flex min-w-0 items-center lg:hidden">
          <img src="/vjias-logo.png" alt="VJIAS - Vignana Jyothi Institute of Arts & Sciences" className="h-9 w-auto max-w-[180px] shrink-0 object-contain" />
        </div>

        {/* Global Search Input */}
        <div className="relative hidden md:block w-64 lg:w-80">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search subjects, roll numbers, faculty..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/70 py-1.5 pl-9 pr-3 text-xs placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-slate-900/80 dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900 transition-all"
          />
        </div>
      </div>

      <div className="flex w-full items-center justify-end gap-2 sm:w-auto sm:gap-3">

        {/* Quick Role Switcher (Crucial for Demo/Testing per Section 37) */}
        {isDemo && <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowRoleMenu(!showRoleMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/80 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-500/30 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/60 transition-colors shadow-2xs cursor-pointer"
            title="Switch Demo Persona"
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Role:</span>
            <span className="capitalize">{role}</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 dark:bg-slate-900 dark:border-slate-800 dark:ring-white/10 z-50 animate-in fade-in zoom-in-95">
              <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 mb-1">
                Switch Role Demo
              </div>
              <button
                onClick={() => handleRoleChange('student')}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors cursor-pointer ${
                  role === 'student'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-950/70 dark:text-indigo-300'
                    : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/70'
                }`}
              >
                <GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Student (Alex Johnson)
              </button>
              <button
                onClick={() => handleRoleChange('faculty')}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors cursor-pointer ${
                  role === 'faculty'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-950/70 dark:text-indigo-300'
                    : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/70'
                }`}
              >
                <Briefcase className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                Faculty (Dr. Mitchell)
              </button>
              <button
                onClick={() => handleRoleChange('admin')}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors cursor-pointer ${
                  role === 'admin'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-950/70 dark:text-indigo-300'
                    : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/70'
                }`}
              >
                <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                Admin (Dean Vance)
              </button>
            </div>
          )}
        </div>}

        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowRoleMenu(false);
            }}
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl ring-1 ring-black/5 dark:bg-slate-900 dark:border-slate-800 dark:ring-white/10 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2 px-1">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Announcements & Alerts</span>
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">3 unread</span>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {announcements.map((ann) => (
                  <div key={ann.id} className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-2.5 hover:bg-indigo-50/40 dark:hover:bg-slate-800/70 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                        {ann.priority}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{ann.date}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{ann.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">{ann.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Card & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden border border-slate-300 dark:border-slate-700 shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                {user?.name.charAt(0)}
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
