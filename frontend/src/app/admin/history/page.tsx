'use client';

import React from 'react';
import Link from 'next/link';
import { SeverityBadge } from '@/components/common/Badges';
import { 
  History, 
  Search, 
  Calendar, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export default function IncidentHistoryPage() {
  const historicalIncidents = [
    {
      id: 'INC-1039',
      date: '2026-10-03',
      time: '14:20:00',
      type: 'FIRE' as const,
      severity: 'CRITICAL' as const,
      address: 'Brigade Road Commercial Hub, Bengaluru',
      resolutionTime: '18 min',
      responders: 'Fire Unit 1, Police Sector 4',
      escalations: 0,
      outcome: 'Fire suppressed with zero casualties'
    },
    {
      id: 'INC-1035',
      date: '2026-10-03',
      time: '13:45:10',
      type: 'SAFETY' as const,
      severity: 'MEDIUM' as const,
      address: 'Ulsoor Lake Promenade, Bengaluru',
      resolutionTime: '12 min',
      responders: 'Police Patrol B',
      escalations: 0,
      outcome: 'Perimeter cordoned and resolved peacefully'
    },
    {
      id: 'INC-1028',
      date: '2026-10-02',
      time: '21:10:45',
      type: 'ACCIDENT' as const,
      severity: 'HIGH' as const,
      address: 'Outer Ring Road Bellandur Flyover, Bengaluru',
      resolutionTime: '24 min',
      responders: 'Ambulance B, Police Patrol A',
      escalations: 1,
      outcome: 'Autonomous reroute executed due to flyover block. Patients stabilized.'
    },
    {
      id: 'INC-1022',
      date: '2026-10-02',
      time: '17:30:15',
      type: 'MEDICAL' as const,
      severity: 'HIGH' as const,
      address: 'Koramangala 5th Block, Bengaluru',
      resolutionTime: '14 min',
      responders: 'Ambulance A, Hospital B Trauma',
      escalations: 0,
      outcome: 'Cardiac telemetry transmitted en route. Patient admitted in 14m.'
    }
  ];

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
      
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#0B1626] border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">
            Resolved Incident Archive & Audit History
          </h1>
          <p className="text-xs text-slate-400">
            Searchable historical incident repository with post-incident SLA review and agent action records
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <History className="w-4 h-4 text-blue-400" />
          <span>4 Archived Incidents</span>
        </div>
      </div>

      {/* History Feed Cards */}
      <div className="space-y-3">
        {historicalIncidents.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-[#0B1626] border border-slate-800 hover:border-slate-700 shadow-lg transition space-y-3"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono font-black text-white">{item.id}</span>
                <span className="text-xs font-bold text-slate-300 uppercase">{item.type}</span>
                <SeverityBadge severity={item.severity} />
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                  RESOLVED
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {item.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {item.time}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono bg-[#07111F] p-3 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-slate-500 block text-[10px]">Location</span>
                <span className="text-slate-200 truncate block">{item.address}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Responders</span>
                <span className="text-slate-200 truncate block">{item.responders}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Total Resolution Time</span>
                <span className="text-emerald-400 font-bold">{item.resolutionTime}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 italic">
              Outcome: &ldquo;{item.outcome}&rdquo;
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
