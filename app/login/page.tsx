'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Cpu, ArrowRight, Shield, Zap } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const handleRecruiterLogin = () => {
    localStorage.setItem('syncpulse_demo_auth', 'true');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-slate-900/60 border border-slate-800 p-8 rounded-3xl backdrop-blur-md shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/20">
            <Cpu className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">Welcome to SyncPulse</h1>
        <p className="text-slate-400 text-center text-sm mb-8">
          AI Agent Orchestration & Enterprise Workflow Infrastructure
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-sm text-slate-300 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
            <Zap className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Real-time execution telemetry & Supabase live sync</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-300 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Multi-tenant workspace architecture & JWT security</span>
          </div>
        </div>

        <button
          onClick={handleRecruiterLogin}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 group"
        >
          <span>Try Live Demo (Recruiter Access)</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-center text-xs text-slate-500 mt-6">
          Designed for technical evaluation & code review.
        </p>
      </div>
    </div>
  );
}