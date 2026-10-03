'use client';

import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Zap,
  Activity,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AnalyticsPage() {
  const incidentsByType = [
    { type: 'Accident', count: 48, pct: '44%', color: 'bg-red-500' },
    { type: 'Medical', count: 39, pct: '36%', color: 'bg-rose-500' },
    { type: 'Safety / Police', count: 14, pct: '13%', color: 'bg-blue-500' },
    { type: 'Road Hazard', count: 9, pct: '7%', color: 'bg-amber-500' }
  ];

  const hourlyDistribution = [
    { hour: '00:00', val: 2 },
    { hour: '04:00', val: 1 },
    { hour: '08:00', val: 9 },
    { hour: '12:00', val: 14 },
    { hour: '16:00', val: 18 },
    { hour: '20:00', val: 11 }
  ];

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
      
      {/* Header (Burgundy) */}
      <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-[#800020] via-[#6B001B] to-[#4D0013] text-white border border-[#ff94b0]/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-pink-200">
            Performance Metrics
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Operational Analytics & Swarm SLA Intelligence
          </h1>
          <p className="text-xs text-pink-100/80 mt-1">
            Real-time urban telemetry metrics, autonomous reroute efficiencies & SLA compliance
          </p>
        </div>

        <span className="text-[10px] font-mono px-3 py-1.5 rounded-xl bg-white/10 text-pink-200 border border-white/20 font-bold backdrop-blur-xs">
          DEMO SIMULATION METRICS
        </span>
      </div>

      {/* Top 4 KPI Metrics (White) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E8E2D2] card-shadow">
          <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Avg Response Time</div>
          <div className="text-2xl font-black text-[#17202A] font-mono mt-1">04:12</div>
          <span className="text-[10px] text-emerald-700 font-mono font-semibold">Benchmark SLA: &lt; 06:00</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8E2D2] card-shadow">
          <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">AI Assignment Latency</div>
          <div className="text-2xl font-black text-[#800020] font-mono mt-1">2.8s</div>
          <span className="text-[10px] text-[#667085] font-mono">Swarm Triage & Dispatch</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8E2D2] card-shadow">
          <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Auto-Reroute Success</div>
          <div className="text-2xl font-black text-purple-700 font-mono mt-1">100%</div>
          <span className="text-[10px] text-purple-800 font-mono font-semibold">Autonomous Failover</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8E2D2] card-shadow">
          <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Total Resolved Today</div>
          <div className="text-2xl font-black text-emerald-700 font-mono mt-1">110</div>
          <span className="text-[10px] text-[#667085] font-mono">Zero Critical Failures</span>
        </div>
      </div>

      {/* Charts Grid (White) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Incidents by Type */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8E2D2] card-shadow space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE0]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#17202A]">
              Incidents by Type Distribution
            </span>
            <span className="text-[10px] font-mono text-[#667085]">Last 24h Sample</span>
          </div>

          <div className="space-y-3">
            {incidentsByType.map((item) => (
              <div key={item.type} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#17202A] font-semibold">{item.type}</span>
                  <span className="text-[#667085] font-bold">{item.count} ({item.pct})</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#F7F3EA] border border-[#E8E2D2] overflow-hidden">
                  <div className={cn('h-full rounded-full', item.color)} style={{ width: item.pct }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly Incident Distribution */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8E2D2] card-shadow space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE0]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#17202A]">
              Hourly Incident Distribution Peak
            </span>
            <span className="text-[10px] font-mono text-[#667085]">24-Hour Radar Cycle</span>
          </div>

          <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2">
            {hourlyDistribution.map((item) => (
              <div key={item.hour} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-[#800020] hover:bg-[#660019] rounded-t-lg transition shadow-sm"
                  style={{ height: `${item.val * 8}px` }}
                />
                <span className="text-[10px] font-mono text-[#667085] font-semibold">{item.hour}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
