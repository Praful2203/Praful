'use client';

import React from 'react';
import { useEmergency } from '@/context/EmergencyContext';
import { AgentStatusBadge } from '@/components/common/Badges';
import { 
  Bot, 
  Cpu, 
  Radio, 
  Activity, 
  Sparkles, 
  Clock, 
  Zap,
  Terminal,
  HeartHandshake
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AgentCommandCenterPage() {
  const { agents } = useEmergency();

  const agentSequence = [
    { key: 'SUPERVISOR', title: 'Supervisor Agent', icon: Cpu },
    { key: 'INCIDENT_INTELLIGENCE', title: 'Incident Intelligence', icon: Bot },
    { key: 'RESPONDER_DISCOVERY', title: 'Responder Discovery', icon: Sparkles },
    { key: 'RESPONSE_PLANNER', title: 'Response Planner', icon: Activity },
    { key: 'COMMUNICATION', title: 'Communication Agent', icon: Radio },
    { key: 'MONITORING', title: 'Monitoring Agent', icon: Clock },
    { key: 'ESCALATION', title: 'Escalation (Tier 2)', icon: HeartHandshake },
    { key: 'REPLANNING', title: 'Replanning Agent', icon: Zap }
  ];

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-[#E8E2D2] p-6 card-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Multi-Agent Swarm Dashboard
          </span>
          <h1 className="text-2xl font-extrabold text-[#17202A] tracking-tight">
            AI Agent Command Center
          </h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Operational pipeline tracking Tier 1 dispatch, telemetry monitoring, and Tier 2 NGO auto-escalation.
          </p>
        </div>

        <span className="px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold">
          8 Swarm Nodes Online
        </span>
      </div>

      {/* Visual Connected Nodes */}
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-[#667085]">
          Autonomous Swarm Execution Pipeline
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {agentSequence.map((item, idx) => {
            const agent = agents[item.key] || {
              name: item.title,
              status: 'STANDBY',
              currentTask: 'Supervising workflow',
              lastAction: 'Status nominal',
              timestamp: '15:02'
            };
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className="bg-white rounded-2xl border border-[#E8E2D2] p-5 card-shadow flex flex-col justify-between space-y-3 hover:card-shadow-hover transition"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-[#F7F3EA] border border-[#E8E2D2] flex items-center justify-center text-blue-600">
                    <Icon className="w-4 h-4" />
                  </div>
                  <AgentStatusBadge status={agent.status as any} />
                </div>

                <div>
                  <h3 className="text-xs font-bold text-[#17202A]">{item.title}</h3>
                  <p className="text-[11px] text-[#667085] mt-1 line-clamp-2 leading-relaxed">
                    {agent.currentTask}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#F0EBE0] flex items-center justify-between text-[10px] text-[#98A2B3] font-mono">
                  <span>Last Sync: {agent.timestamp}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Operational Event Log Stream */}
      <div className="bg-white rounded-2xl border border-[#E8E2D2] p-6 card-shadow space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE0]">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#17202A]">
              Safe Operational Event Log Stream
            </h3>
          </div>
          <span className="text-[10px] text-[#98A2B3]">Summarized Actions Only</span>
        </div>

        <div className="space-y-2.5 font-mono text-xs">
          {Object.values(agents).map((agent) => (
            <div
              key={agent.id}
              className="p-3 rounded-xl bg-[#F7F3EA] border border-[#E8E2D2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
            >
              <div className="flex items-center gap-3">
                <span className="text-[#98A2B3] text-[11px]">{agent.timestamp}</span>
                <span className="font-bold text-blue-700 text-xs">{agent.name}</span>
                <span className="text-[#17202A] italic">&ldquo;{agent.lastAction}&rdquo;</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
