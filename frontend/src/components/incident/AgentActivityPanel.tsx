'use client';

import React, { useState } from 'react';
import { AgentInfo } from '@/types/emergency';
import { AgentStatusBadge } from '@/components/common/Badges';
import { 
  Bot, 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  Wrench, 
  CheckCircle2, 
  Activity, 
  Zap, 
  ShieldAlert 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentActivityPanelProps {
  agents: Record<string, AgentInfo>;
  className?: string;
  defaultExpanded?: boolean;
}

export function AgentActivityPanel({ agents, className, defaultExpanded = true }: AgentActivityPanelProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const agentList = Object.values(agents);

  return (
    <div className={cn('bg-[#0B1626] rounded-2xl border border-slate-800 shadow-xl overflow-hidden', className)}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 bg-[#101C2D]/70 hover:bg-[#132238] transition text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
              Autonomous Swarm Intelligence Engine
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </h3>
            <p className="text-[11px] text-slate-400">7 Active Specialized AI Coordinators</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            Auto-Orchestrating
          </span>
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {/* Agents Body Grid */}
      {expanded && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 border-t border-slate-800">
          {agentList.map((agent) => (
            <div
              key={agent.id}
              className={cn(
                'p-3 rounded-xl border bg-[#07111F]/80 transition duration-200 flex flex-col justify-between gap-2.5',
                agent.status === 'ACTIVE' || agent.status === 'ANALYZING'
                  ? 'border-blue-500/40 shadow-[0_0_10px_rgba(37,99,235,0.15)]'
                  : agent.status === 'ESCALATED'
                  ? 'border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.2)] ring-1 ring-red-500'
                  : 'border-slate-800/80 hover:border-slate-700'
              )}
            >
              {/* Agent Title & Status */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-blue-400" />
                  <h4 className="text-xs font-bold text-slate-200">{agent.name}</h4>
                </div>
                <AgentStatusBadge status={agent.status} />
              </div>

              {/* Current Task */}
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-cyan-400" />
                  <span>Current Task:</span>
                </div>
                <p className="text-xs text-slate-300 font-medium leading-relaxed bg-[#0B1626] p-2 rounded-lg border border-slate-800/80">
                  {agent.currentTask}
                </p>
              </div>

              {/* Last Action & Tools Used */}
              <div className="pt-2 border-t border-slate-800/60 flex flex-col gap-1.5 text-[10px] text-slate-400">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 truncate">Last Action:</span>
                  <span className="font-mono text-slate-400">{agent.timestamp}</span>
                </div>
                <p className="text-[11px] text-slate-300 italic truncate" title={agent.lastAction}>
                  &ldquo;{agent.lastAction}&rdquo;
                </p>

                {agent.toolsUsed && agent.toolsUsed.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {agent.toolsUsed.map((tool, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 rounded bg-slate-800/80 text-[9px] font-mono text-cyan-300 border border-slate-700"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
