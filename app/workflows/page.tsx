'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { GitBranch, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'
);

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [newStepName, setNewStepName] = useState('');
  const [newStepPrompt, setNewStepPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchWorkflows() {
      const { data } = await supabase.from('workflows').select('*');
      if (data && data.length > 0) {
        setWorkflows(data);
        setSelectedWorkflow(data[0]);
      }
    }
    fetchWorkflows();
  }, []);

  const handleAddStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkflow || !newStepName) return;

    setLoading(true);
    const currentSteps = selectedWorkflow.steps_config || [];
    const updatedSteps = [
      ...currentSteps,
      {
        step_order: currentSteps.length + 1,
        step_name: newStepName,
        action_type: 'llm_call',
        model: 'gpt-4o',
        prompt: newStepPrompt,
      },
    ];

    const { error } = await supabase
      .from('workflows')
      .update({ steps_config: updatedSteps })
      .eq('id', selectedWorkflow.id);

    if (!error) {
      setSelectedWorkflow({ ...selectedWorkflow, steps_config: updatedSteps });
      setNewStepName('');
      setNewStepPrompt('');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="bg-slate-900 border border-slate-800 p-2 rounded-xl text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold">Visual Workflow Studio</h1>
          </div>
          <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full">
            JSONB Schema Driven
          </span>
        </div>

        {selectedWorkflow ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl h-fit">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Workflows</h3>
              <div className="space-y-2">
                {workflows.map((wf) => (
                  <button
                    key={wf.id}
                    onClick={() => setSelectedWorkflow(wf)}
                    className={`w-full text-left p-3 rounded-xl text-sm transition-all flex items-center justify-between ${
                      selectedWorkflow.id === wf.id
                        ? 'bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-600/20'
                        : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate">{wf.title}</span>
                    <GitBranch className="w-4 h-4 shrink-0 opacity-70" />
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold">{selectedWorkflow.title}</h2>
                  <p className="text-xs text-slate-400">Trigger: {selectedWorkflow.trigger_type}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {selectedWorkflow.steps_config?.map((step: any, index: number) => (
                  <div key={index} className="bg-slate-900 border border-slate-800 p-4 rounded-xl relative">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded">
                        Step {step.step_order}
                      </span>
                      <span className="text-xs text-slate-500">{step.model || 'System Action'}</span>
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{step.step_name}</h4>
                    {step.prompt && <p className="text-xs text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-900 font-mono">{step.prompt}</p>}
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddStep} className="border-t border-slate-800 pt-6 space-y-4">
                <h3 className="text-sm font-semibold text-slate-300">Add Pipeline Step</h3>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Step Name</label>
                  <input
                    type="text"
                    value={newStepName}
                    onChange={(e) => setNewStepName(e.target.value)}
                    placeholder="e.g., Summarize feedback with LLM"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">AI Prompt / Configuration</label>
                  <textarea
                    value={newStepPrompt}
                    onChange={(e) => setNewStepPrompt(e.target.value)}
                    placeholder="Enter prompt instructions..."
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 border border-slate-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>{loading ? 'Saving to Supabase...' : 'Append Step to Pipeline'}</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500">Loading workflows...</div>
        )}
      </div>
    </div>
  );
}