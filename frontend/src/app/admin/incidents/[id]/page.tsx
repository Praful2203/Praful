'use client';

import React from 'react';
import Link from 'next/link';
import { useEmergency } from '@/context/EmergencyContext';
import { LiveMap } from '@/components/map/LiveMap';
import { EventTimeline } from '@/components/incident/EventTimeline';
import { IncidentStatusBadge, SeverityBadge, TierBadge } from '@/components/common/Badges';
import { 
  MapPin, 
  Clock, 
  Ambulance, 
  HeartHandshake, 
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function IncidentCommandViewPage() {
  const { incident, responders, isDelaySimulated, simulateResponseDelay, resolveIncident, resetDemo } = useEmergency();

  const isDelayed = incident.status === 'DELAY_DETECTED' || incident.status === 'REPLANNING';
  const isTier2 = incident.currentTier === 'TIER_2';
  const activeResponder = incident.assignedResponder || responders[0];

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
      
      {/* Top Header Command Bar (Burgundy) */}
      <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-[#800020] via-[#6B001B] to-[#4D0013] text-white border border-[#ff94b0]/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xl font-black text-white font-mono tracking-tight">
              INCIDENT {incident.id}
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-white/20 text-white text-xs font-bold uppercase tracking-wider border border-white/30 backdrop-blur-xs">
              {incident.type}
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
          <p className="text-xs text-pink-100/80 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-pink-200 shrink-0" />
            <span className="truncate">{incident.address}</span>
            <span className="text-pink-300/60">•</span>
            <span>Reported at {incident.reportedAt}</span>
          </p>
        </div>

        {/* Demo Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={simulateResponseDelay}
            disabled={isDelaySimulated}
            className={cn(
              'px-3.5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 border shadow-sm backdrop-blur-md',
              isDelaySimulated
                ? 'bg-red-500/20 text-red-200 border-red-400/40 cursor-not-allowed'
                : 'bg-white/10 hover:bg-white/20 text-rose-200 border-rose-300/40'
            )}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{isDelaySimulated ? 'DELAY SIMULATED' : 'SIMULATE RESPONDER DELAY'}</span>
          </button>

          {incident.status === 'ARRIVED' && (
            <button
              onClick={resolveIncident}
              className="px-3.5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider bg-white text-[#800020] hover:bg-[#FFFDF8] shadow-sm flex items-center gap-1.5 font-black"
            >
              <CheckCircle2 className="w-4 h-4 text-[#800020]" />
              <span>RESOLVE INCIDENT</span>
            </button>
          )}

          <button
            onClick={resetDemo}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-pink-200 hover:text-white transition shadow-sm backdrop-blur-md"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Delay Alert Callout */}
      {isDelayed && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <h4 className="text-xs font-bold uppercase">Movement Anomaly Detected</h4>
              <p className="text-xs text-red-700">
                Ambulance A halted on Chokepoint. Replanning Agent selecting alternative unit...
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-red-100 text-xs font-mono font-bold text-red-800 uppercase">
            Escalation Active
          </span>
        </div>
      )}

      {/* Grid: Live Map Left, Incident Dossier & Timeline Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="h-[440px]">
            <LiveMap incident={incident} responders={responders} className="h-full" />
          </div>

          <EventTimeline events={incident.events} />
        </div>

        <div className="lg:col-span-4 space-y-4">
          
          {/* Incident Dossier */}
          <div className="bg-white rounded-2xl border border-[#E8E2D2] p-5 card-shadow space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#17202A] block">
              Incident Summary
            </span>
            <div className="text-xs text-[#17202A] bg-[#F7F3EA] p-3 rounded-xl border border-[#E8E2D2] leading-relaxed">
              {incident.description}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
              <div className="p-2.5 rounded-lg bg-[#F7F3EA] border border-[#E8E2D2]">
                <span className="text-[10px] text-[#667085] block">People Involved</span>
                <span className="text-[#17202A] font-bold">{incident.peopleInvolved} Patients</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F7F3EA] border border-[#E8E2D2]">
                <span className="text-[10px] text-[#667085] block">AI Confidence</span>
                <span className="text-emerald-700 font-bold">{incident.confidenceScore}%</span>
              </div>
            </div>
          </div>

          {/* Assigned Responder Dossier */}
          <div className="bg-white rounded-2xl border border-[#E8E2D2] p-5 card-shadow space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#17202A] block">
              Assigned Responder
            </span>
            
            <div className="p-3.5 rounded-xl bg-[#F7F3EA] border border-[#E8E2D2] space-y-2">
              <div className="flex items-center gap-2">
                {isTier2 ? <HeartHandshake className="w-4 h-4 text-emerald-700" /> : <Ambulance className="w-4 h-4 text-blue-700" />}
                <div>
                  <div className="text-xs font-bold text-[#17202A]">{activeResponder.name}</div>
                  <div className="text-[10px] text-[#667085]">{activeResponder.organization}</div>
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
          </div>

        </div>
      </div>

    </div>
  );
}
