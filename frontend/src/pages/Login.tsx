import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Lock,
  IdCard,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import type { UserRole } from '../types';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [hallTicket, setHallTicket] = useState('HT2024-CS042');
  const [password, setPassword] = useState('student123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!hallTicket.trim()) {
      setErrorMessage('Please enter your Hall Ticket Number.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setLoading(true);

    // Simulate authenticating and verifying credentials
    setTimeout(() => {
      setLoading(false);
      const cleanInput = hallTicket.trim().toLowerCase();
      let targetRole: UserRole = 'student';
      if (cleanInput.includes('faculty') || cleanInput.includes('mitchell') || cleanInput.includes('fac')) {
        targetRole = 'faculty';
      } else if (cleanInput.includes('admin') || cleanInput.includes('vance') || cleanInput.includes('adm')) {
        targetRole = 'admin';
      } else {
        targetRole = 'student';
      }

      login(targetRole);
      navigate(`/${targetRole}`);
    }, 600);
  };

  const handleInstantDemoLogin = (role: UserRole) => {
    login(role);
    navigate(`/${role}`);
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors">


      {/* Subtle modern collegiate background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-slate-900/90 dark:bg-slate-900/90 px-6 py-3.5 rounded-2xl shadow-xl border border-slate-800 flex items-center justify-center backdrop-blur-md">
            <img src="/vjias-logo.png" alt="VJIAS Logo" className="h-14 sm:h-16 w-auto object-contain" />
          </div>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
          VJIAS ATTENDANCE PORTAL
        </h2>
        <p className="mt-1 text-center text-xs font-medium tracking-wide uppercase text-indigo-200/80">
          Vignana Jyothi Institute of Arts & Sciences
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Affiliated to Osmania University
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        {/* Main Login Card */}
        <div className="bg-slate-900/95 py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-800 backdrop-blur-md">
          {errorMessage && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Hall Ticket Number
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <IdCard className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  value={hallTicket}
                  onChange={(e) => setHallTicket(e.target.value)}
                  placeholder="e.g. HT2024-CS042"
                  className="block w-full rounded-lg border border-slate-700 bg-slate-800/80 py-2.5 pl-10 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-mono uppercase transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Please contact the IT Helpdesk at helpdesk@college.edu to reset your institutional credentials.');
                  }}
                  className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative rounded-lg shadow-2xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-slate-700 bg-slate-800/80 py-2.5 pl-10 pr-10 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-400 font-medium cursor-pointer">
                  Remember this device
                </label>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50">
                <CheckCircle2 className="h-3 w-3" /> SSL 256-bit
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Selector (Section 37) */}
          <div className="mt-8 border-t border-slate-800 pt-6">
            <p className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              One-Click Demo Personas
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleInstantDemoLogin('student')}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-800 bg-slate-800/60 hover:bg-blue-950/40 hover:border-blue-700/60 hover:text-blue-300 transition-all text-slate-300 group cursor-pointer"
              >
                <GraduationCap className="h-5 w-5 mb-1 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold">Student</span>
                <span className="text-[10px] text-slate-400">Alex J.</span>
              </button>

              <button
                type="button"
                onClick={() => handleInstantDemoLogin('faculty')}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-800 bg-slate-800/60 hover:bg-purple-950/40 hover:border-purple-700/60 hover:text-purple-300 transition-all text-slate-300 group cursor-pointer"
              >
                <Briefcase className="h-5 w-5 mb-1 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold">Faculty</span>
                <span className="text-[10px] text-slate-400">Dr. Sarah M.</span>
              </button>

              <button
                type="button"
                onClick={() => handleInstantDemoLogin('admin')}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-800 bg-slate-800/60 hover:bg-amber-950/40 hover:border-amber-700/60 hover:text-amber-300 transition-all text-slate-300 group cursor-pointer"
              >
                <ShieldCheck className="h-5 w-5 mb-1 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold">Admin</span>
                <span className="text-[10px] text-slate-400">Dean Vance</span>
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Protected by VJIAS Identity & Access Management • All rights reserved.
        </p>
      </div>
    </div>
  );
};
