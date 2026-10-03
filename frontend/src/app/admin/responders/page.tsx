'use client';

import React, { useState } from 'react';
import { useEmergency } from '@/context/EmergencyContext';
import { LiveMap } from '@/components/map/LiveMap';
import { ResponderTypeBadge } from '@/components/common/Badges';
import { 
  Users, 
  MapPin, 
  Radio, 
  ShieldCheck, 
  Activity, 
  Phone, 
  CheckCircle2,
  Clock,
  Car
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ResponderNetworkPage() {
  const { incident, responders } = useEmergency();
  const [selectedType, setSelectedType] = useState('ALL');

  const filteredResponders = responders.filter((r) => {
    if (selectedType === 'ALL') return true;
    return r.type === selectedType;
  });

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
      
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#0B1626] border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">
            City Responder Swarm Network
          </h1>
          <p className="text-xs text-slate-400">
            Real-time status, capabilities, and dynamic location tracking across all municipal and private units
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'AMBULANCE', 'POLICE', 'FIRE', 'HOSPITAL', 'COMMUNITY'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition shrink-0',
                selectedType === t
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'bg-[#07111F] text-slate-400 hover:text-white border border-slate-800'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Tactical Map & Responder Fleet Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 h-[500px]">
          <LiveMap incident={incident} responders={responders} className="h-full" />
        </div>

        <div className="lg:col-span-6 space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {filteredResponders.map((r) => (
            <div
              key={r.id}
              className="p-4 rounded-2xl bg-[#0B1626] border border-slate-800 shadow-lg space-y-3 hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{r.name}</h3>
                    <span className="text-[10px] font-mono text-slate-500">({r.plateNumber || r.id})</span>
                  </div>
                  <div className="mt-1">
                    <ResponderTypeBadge type={r.type} />
                  </div>
                </div>

                <span className={cn(
                  'px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border',
                  r.status === 'AVAILABLE' && 'bg-emerald-950 text-emerald-300 border-emerald-500/40',
                  r.status === 'EN_ROUTE' && 'bg-blue-950 text-blue-300 border-blue-500/40 animate-pulse',
                  r.status === 'DELAYED' && 'bg-red-950 text-red-300 border-red-500/40',
                  r.status === 'OFFLINE' && 'bg-slate-800 text-slate-400 border-slate-700'
                )}>
                  {r.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#07111F] p-2.5 rounded-xl border border-slate-800/80">
                <div>
                  <span className="text-slate-500 block text-[9px]">Base / Hub</span>
                  <span className="text-slate-300 truncate block">{r.address}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px]">Distance & ETA</span>
                  <span className="text-slate-200 font-bold">{r.distanceKm} km • {r.eta} min</span>
                </div>
              </div>

              {/* Capabilities */}
              <div className="flex flex-wrap gap-1">
                {r.capabilities.map((c, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-slate-800/80 text-[9px] font-mono text-slate-400 border border-slate-700"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
