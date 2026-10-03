'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useEmergency } from '@/context/EmergencyContext';
import { LiveMap } from '@/components/map/LiveMap';
import { 
  Bot, 
  CheckCircle2, 
  Sparkles, 
  Cpu, 
  Activity, 
  ShieldAlert, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function IncidentAnalyzingPage() {
  const router = useRouter();
  const params = useParams();
  const { incident, responders } = useEmergency();

  const [currentStep, setCurrentStep] = useState(0);

  const analysisSteps = [
    { title: 'Understanding report & parsing NLP text', delay: 800 },
    { title: 'Identifying emergency type & triage taxonomy', delay: 1600 },
    { title: 'Assessing trauma severity & injury matrix', delay: 2400 },
    { title: 'Determining dispatch priority index (P1)', delay: 3200 },
    { title: 'Preparing multi-agent response plan & corridor', delay: 4000 }
  ];

  useEffect(() => {
    // Step progression timer
    analysisSteps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(index + 1);
      }, step.delay);
    });

    // Auto-transition to Live Incident Tracking page after analysis completion
    const transitionTimer = setTimeout(() => {
      router.push(`/incident/${incident.id}`);
    }, 5200);

    return () => clearTimeout(transitionTimer);
  }, [incident.id, router]);

  const isComplete = currentStep >= analysisSteps.length;

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col justify-center">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white tracking-tight">
                Incident Intelligence Agent
              </h1>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40">
                {isComplete ? 'ANALYSIS COMPLETE' : 'ANALYZING'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Synthesizing citizen report, spatial geography & trauma protocols
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
          <Clock className="w-4 h-4 text-blue-400" />
          <span>Incident ID: <strong className="text-slate-100">{incident.id}</strong></span>
        </div>
      </div>

      {/* Cinematic Two-Column Analysis Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 items-stretch">
        {/* Left Column: Live Map */}
        <div className="lg:col-span-6 h-[460px]">
          <LiveMap incident={incident} responders={responders} className="h-full" />
        </div>

        {/* Right Column: AI Processing Stages & Synthesis Breakdown */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          
          {/* Animated Processing Stage Checklist */}
          <div className="p-5 rounded-2xl bg-[#0B1626] border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                Live Agent Execution Stages
              </span>
              <span className="text-[10px] font-mono text-purple-400 font-bold">
                {currentStep} / {analysisSteps.length} COMPLETE
              </span>
            </div>

            <div className="space-y-2.5">
              {analysisSteps.map((step, idx) => {
                const stepFinished = currentStep > idx;
                const isCurrent = currentStep === idx;
                return (
                  <div
                    key={idx}
                    className={cn(
                      'flex items-center gap-3 text-xs p-2.5 rounded-xl border transition-all duration-300',
                      stepFinished
                        ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300 font-medium'
                        : isCurrent
                        ? 'bg-purple-950/40 border-purple-500/50 text-purple-200 font-bold shadow-[0_0_12px_rgba(168,85,247,0.2)] animate-pulse'
                        : 'bg-[#07111F]/50 border-slate-800/60 text-slate-500'
                    )}
                  >
                    {stepFinished ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <Sparkles className="w-4 h-4 text-purple-400 shrink-0 animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                    )}
                    <span>{step.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Intelligence Output Metrics */}
          <div className="p-5 rounded-2xl bg-[#0B1626] border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                AI Synthesis Parameters
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-500/30">
                Simulated Intelligence Model
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
              <div className="p-3 rounded-xl bg-[#07111F] border border-slate-800">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Incident Type</div>
                <div className="text-xs font-black text-red-400 mt-1 font-mono">{incident.type}</div>
              </div>

              <div className="p-3 rounded-xl bg-[#07111F] border border-slate-800">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Severity</div>
                <div className="text-xs font-black text-orange-400 mt-1 font-mono">{incident.severity}</div>
              </div>

              <div className="p-3 rounded-xl bg-[#07111F] border border-slate-800">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Priority</div>
                <div className="text-xs font-black text-red-500 mt-1 font-mono">{incident.priority}</div>
              </div>

              <div className="p-3 rounded-xl bg-[#07111F] border border-slate-800">
                <div className="text-[10px] text-slate-500 font-bold uppercase">People</div>
                <div className="text-xs font-black text-white mt-1 font-mono">{incident.peopleInvolved}</div>
              </div>

              <div className="p-3 rounded-xl bg-[#07111F] border border-slate-800">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Confidence</div>
                <div className="text-xs font-black text-emerald-400 mt-1 font-mono">{incident.confidenceScore}%</div>
              </div>
            </div>

            {/* Transition trigger */}
            {isComplete && (
              <button
                onClick={() => router.push(`/incident/${incident.id}`)}
                className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/30 transition flex items-center justify-center gap-2"
              >
                <span>ANALYSIS COMPLETE • PROCEED TO LIVE DISPATCH</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
