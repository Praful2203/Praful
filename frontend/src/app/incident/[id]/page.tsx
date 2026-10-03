'use client';

import React from 'react';
import { useEmergency } from '@/context/EmergencyContext';
import { LiveMap } from '@/components/map/LiveMap';
import { EventTimeline } from '@/components/incident/EventTimeline';
import { IncidentStatusBadge, SeverityBadge, PriorityBadge, TierBadge } from '@/components/common/Badges';
import {
  Ambulance,
  MapPin,
  Clock,
  AlertTriangle,
  HeartHandshake,
  CheckCircle2,
  Navigation,
  Sparkles,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LiveIncidentTrackingPage() {
  const { incident, responders } = useEmergency();

  const activeResponder = incident.assignedResponder || responders[0];
  const isDelayed = incident.status === 'DELAY_DETECTED' || incident.status === 'REPLANNING';
  const isEscalating = incident.status === 'ESCALATING';
  const isTier2 = incident.currentTier === 'TIER_2';
  const isCompleted = incident.status === 'RESOLVED';

  return (
    <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">

      {/* Top Header Card (Burgundy) */}
      <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-[#800020] via-[#6B001B] to-[#4D0013] text-white border border-[#ff94b0]/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xl font-bold font-mono text-white tracking-tight">{incident.id}</span>
            <span className="px-2.5 py-0.5 rounded-md bg-white/20 text-white text-xs font-bold uppercase tracking-wider border border-white/30 backdrop-blur-xs">
              {incident.type}
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-white/20 text-pink-100 text-[11px] font-mono font-bold border border-white/20 backdrop-blur-xs">
              {incident.peopleInvolved} People Involved
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-amber-400/20 text-amber-200 text-[11px] font-mono font-bold border border-amber-400/30">
              {incident.severity}
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-blue-400/20 text-blue-200 text-[11px] font-mono font-bold border border-blue-400/30">
              {incident.currentTier === 'TIER_1' ? 'TIER 1 PRIMARY' : 'TIER 2 NGO'}
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-400/20 text-emerald-200 text-[11px] font-mono font-bold border border-emerald-400/30">
              {incident.status === 'EN_ROUTE' ? '((•)) RESPONDER EN ROUTE' : incident.status.replace(/_/g, ' ')}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-pink-100/80">
            <MapPin className="w-3.5 h-3.5 text-pink-200 shrink-0" />
            <span className="truncate">{incident.address}</span>
            <span className="text-pink-300/60">•</span>
            <span>Reported at {incident.reportedAt}</span>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] font-mono text-pink-200 uppercase tracking-wider block">Expected Arrival</span>
          <span className="text-3xl font-black font-mono text-emerald-300 drop-shadow-sm">
            {isCompleted ? 'RESOLVED' : incident.status === 'ARRIVED' ? 'ON SCENE' : incident.estimatedTimeArrival}
          </span>
        </div>
      </div>

      {/* 15. LIVE TRACKING: REJECT / ESCALATION ALERT CALLOUT */}
      {isEscalating && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 animate-bounce" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950">
                Ambulance rejected the request
              </h4>
              <p className="text-xs text-amber-800">
                Searching verified NGO/community responders... Escalation Agent matching nearest NSS unit.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded bg-amber-200 text-xs font-mono font-bold text-amber-900 uppercase">
            Escalating to Tier 2
          </span>
        </div>
      )}

      {/* Delay / Replan Alert */}
      {isDelayed && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <h4 className="text-xs font-bold uppercase">Movement Delay Detected</h4>
              <p className="text-xs text-red-700">
                Primary ambulance stalled. Autonomous replanning agent selecting alternative unit...
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-red-100 text-xs font-bold uppercase text-red-800">
            Rerouting
          </span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Map & Timeline */}
        <div className="lg:col-span-7 space-y-6">
          <div className="h-[400px]">
            <LiveMap incident={incident} responders={responders} className="h-full" />
          </div>

          <EventTimeline events={incident.events} />
        </div>

        {/* Assigned Responder Box */}
        <div className="lg:col-span-5 space-y-4">

          <div className="bg-white rounded-2xl border border-[#E8E2D2] p-6 card-shadow space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE0]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#17202A]">
                Assigned Responder
              </span>
              <span className="text-xs font-mono text-[#800020] font-bold">
                {incident.status === 'EN_ROUTE' ? 'En Route (Live GPS)' : incident.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F3EA] border border-[#E8E2D2] space-y-3">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center border',
                  isTier2 ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-[#F4E8EB] text-[#800020] border-[#e8d5d9]'
                )}>
                  {isTier2 ? <HeartHandshake className="w-5 h-5" /> : <Ambulance className="w-5 h-5" />}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#17202A]">{activeResponder.name}</div>
                  <div className="text-xs text-[#667085]">{activeResponder.organization}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-[#E8E2D2]">
                <div>
                  <span className="text-[10px] text-[#667085] block">Distance</span>
                  <span className="text-[#17202A] font-bold">{activeResponder.distanceKm} km</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#667085] block">ETA</span>
                  <span className="text-emerald-700 font-bold">{incident.estimatedTimeArrival}</span>
                </div>
              </div>
            </div>

            {/* People Involved Dossier */}
            <div className="p-3.5 rounded-xl bg-[#FFFDF8] border border-[#E8E2D2] flex items-center justify-between text-xs">
              <span className="text-[#667085] flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#800020]" />
                <span>People Involved</span>
              </span>
              <span className="font-mono font-bold text-[#17202A]">{incident.peopleInvolved} Patients</span>
            </div>

            <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#E8E2D2] space-y-1.5 text-xs text-[#667085]">
              <span className="font-bold text-[#17202A] block">Citizen Guidance</span>
              <p>Stay in a safe zone clear of moving traffic. Paramedic & first-aid volunteers are en route to your exact coordinates.</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
