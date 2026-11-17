'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Activity, ShieldCheck, Cpu, Database, AlertCircle, CheckCircle2, ArrowUpRight, GitBranch, LogIn } from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'
);

export default function SyncPulseDashboard() {
  const [logs, setLogs] = useState<any[]>([]);
  const [agentsCount] = useState(4);
  const [systemStatus] = useState('Operational');

  useEffect(() => {
    async function fetchLogs() {
      const { data } = await supabase
        .from('execution_logs')
        .select('*')
        .order('executed_at', { ascending: false })
        .limit(10);
      
      if (data) setLogs(data);
    }
    fetchLogs();

    const channel = supabase
      .channel('realtime-dashboard')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'execution_logs' },
        (payload) => {
          setLogs((prev) => [payload.new, ...prev.slice(0, 9)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <header className="flex flex-wrap justify-between items-center gap-4 mb-8 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">SyncPulse <span className="text-indigo-400">Command Center</span></h1>
            <p className="text-xs text-slate-400">AI Agent Orchestration & Real-time Workflow Monitor</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/workflows" className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors">
            <GitBranch className="w-3.5 h-3.5" /> Workflow Studio
          </Link>
          <Link href="/login" className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-xl text-xs transition-colors">
            <LogIn className="w-3.5 h-3.5" /> Demo Login
          </Link>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-300 font-medium">{systemStatus}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-sm">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Agents</span>
            <Database className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold">{agentsCount} Active</div>
          <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> 100% operational uptime
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-sm">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Latency</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold">420 ms</div>
          <p className="text-xs text-slate-400 mt-1">Optimized via Edge API</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-sm">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Token Usage (Mo)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold">1.2M / 5M</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-indigo-500 h-full w-[24%]"></div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-sm">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Estimated Cost</span>
            <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded">PRO</span>
          </div>
          <div className="text-2xl font-bold">$18.40</div>
          <p className="text-xs text-slate-400 mt-1">Auto-billing enabled</p>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" /> Live Execution Stream
          </h2>
          <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
            Connected to Supabase Realtime
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase">
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Workflow ID</th>
                <th className="pb-3 font-medium">Tokens</th>
                <th className="pb-3 font-medium">Latency</th>
                <th className="pb-3 font-medium">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Waiting for live events... (Add your Supabase keys in .env.local to stream live records)
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 flex items-center gap-2">
                      {log.status === 'completed' ? (
                        <span className="flex items-center gap-1.5 text-emerald-400 text-xs bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-rose-400 text-xs bg-rose-500/10 px-2 py-0.5 rounded-full">
                          <AlertCircle className="w-3.5 h-3.5" /> Failed
                        </span>
                      )}
                    </td>
                    <td className="py-3 font-mono text-xs text-slate-400">{log.workflow_id?.substring(0, 8)}...</td>
                    <td className="py-3 font-mono">{log.tokens_used}</td>
                    <td className="py-3 font-mono">{log.latency_ms}ms</td>
                    <td className="py-3 text-slate-400 text-xs">{new Date(log.executed_at).toLocaleTimeString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}