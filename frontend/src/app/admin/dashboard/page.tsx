'use client';

import React from 'react';
import Link from 'next/link';
import { useEmergency } from '@/context/EmergencyContext';
import { LiveMap } from '@/components/map/LiveMap';
import { EventTimeline } from '@/components/incident/EventTimeline';
import { 
  Activity, 
  Users, 
  Radio, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  RotateCcw,
  HeartHandshake
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminDashboardPage() {
  const { 
    incident, 
    responders, 
    agents, 
    isDelaySimulated, 
    tier1TimeoutSimulated,
    simulateTier1Timeout, 
    simulateResponseDelay, 
    markAsCompleted, 
    resetDemo 
  } = useEmergency();

  const activeResponders = responders.filter((r) => r.status === 'EN_ROUTE' || r.status === 'ASSIGNED').length;
  const availableResponders = responders.filter((r) => r.status === 'AVAILABLE').length;

  const nssUnit = responders.find((r) => r.id === 'NGO-501');

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
      
      {/* Top Header & Simulation Controls (Burgundy) */}
      <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-[#800020] via-[#6B001B] to-[#4D0013] text-white border border-[#ff94b0]/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-pink-200">
            Emergency Operations Command
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Admin Operations Dashboard
          </h1>
          <p className="text-xs text-pink-100/80 mt-1">
            Monitor Tier 1 municipal units and Tier 2 verified NGO/community support network.
          </p>
        </div>

        {/* Demo Scenario Action Strip */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* SIMULATE TIER 1 TIMEOUT / REJECTION */}
          <button
            onClick={simulateTier1Timeout}
            disabled={tier1TimeoutSimulated || incident.currentTier === 'TIER_2'}
            className={cn(
              'px-3.5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 border shadow-sm backdrop-blur-md',
              tier1TimeoutSimulated || incident.currentTier === 'TIER_2'
                ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40 cursor-not-allowed'
                : 'bg-white/10 hover:bg-white/20 text-amber-200 border-amber-300/40'
            )}
            title="Demonstrate Tier 1 Rejection/Timeout to Tier 2 NGO Escalation"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>{tier1TimeoutSimulated || incident.currentTier === 'TIER_2' ? 'TIER 2 NGO ESCALATED' : 'SIMULATE TIER 1 REJECT/TIMEOUT'}</span>
          </button>

          {/* SIMULATE RESPONDER DELAY */}
          <button
            onClick={simulateResponseDelay}
            disabled={isDelaySimulated}
            className={cn(
              'px-3.5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 border shadow-sm backdrop-blur-md',
              isDelaySimulated
                ? 'bg-red-500/20 text-red-200 border-red-400/40 cursor-not-allowed'
                : 'bg-white/10 hover:bg-white/20 text-rose-200 border-rose-300/40'
            )}
            title="Demonstrate Responder Delay & Autonomous Replanning"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{isDelaySimulated ? 'DELAY DETECTED (REPLANNED)' : 'SIMULATE RESPONDER DELAY'}</span>
          </button>

          {incident.status === 'ARRIVED' && (
            <button
              onClick={markAsCompleted}
              className="px-3.5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider bg-white text-[#800020] hover:bg-[#FFFDF8] flex items-center gap-1.5 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>MARK AS COMPLETED</span>
            </button>
          )}

          {/* RESET SIMULATION DEMO */}
          <button
            onClick={resetDemo}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-pink-200 hover:text-white transition shadow-sm backdrop-blur-md"
            title="Reset Demo Simulation to Baseline"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#E8E2D2] card-shadow">
          <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Active Incidents</div>
          <div className="text-2xl font-black text-[#17202A] font-mono mt-1">
            {incident.status === 'RESOLVED' ? '0 Active' : '1 Active'}
          </div>
          <span className="text-[10px] text-red-600 font-semibold">{incident.status === 'RESOLVED' ? 'All Resolved' : 'INC-1042 (P1)'}</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E8E2D2] card-shadow">
          <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Available Responders</div>
          <div className="text-2xl font-black text-emerald-700 font-mono mt-1">{availableResponders} Units</div>
          <span className="text-[10px] text-[#667085]">Automatic Swarm Release</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E8E2D2] card-shadow">
          <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Responders En Route</div>
          <div className="text-2xl font-black text-blue-700 font-mono mt-1">{activeResponders} En Route</div>
          <span className="text-[10px] text-[#667085]">Live Telemetry Active</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E8E2D2] card-shadow">
          <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Tier 2 NGO Escalations</div>
          <div className="text-2xl font-black text-[#800020] font-mono mt-1">
            {incident.currentTier === 'TIER_2' ? '1 Active' : '0 Pending'}
          </div>
          <span className="text-[10px] text-[#667085]">NSS Support Connected</span>
        </div>
      </div>

      {/* Main Grid: Master Live Map + Right Incident Command Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Master Live Map */}
        <div className="lg:col-span-8 space-y-6">
          <div className="h-[420px]">
            <LiveMap incident={incident} responders={responders} className="h-full" />
          </div>

          <EventTimeline events={incident.events} />
        </div>

        {/* Right Quick Panel */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Active Incident Snapshot */}
          <div className="bg-white rounded-2xl border border-[#E8E2D2] p-5 card-shadow space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE0]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#17202A]">Active Incident Focus</span>
              <Link
                href={`/admin/incidents/${incident.id}`}
                className="text-xs font-semibold text-[#800020] hover:underline flex items-center gap-1"
              >
                <span>Command View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#17202A]">{incident.id}</span>
                <span className="font-bold text-red-600 uppercase">{incident.type}</span>
              </div>
              <p className="text-[#667085] line-clamp-2">{incident.description}</p>
              <div className="pt-2 text-xs font-mono flex items-center justify-between text-[#17202A] border-t border-[#F0EBE0]">
                <span>Responder: <strong>{incident.assignedResponder?.name}</strong></span>
                <span className="text-emerald-700 font-bold">{incident.estimatedTimeArrival}</span>
              </div>
            </div>
          </div>

          {/* Tier 2 NGO / Community Network Live Volunteer Card */}
          <div className="bg-white rounded-2xl border border-[#E8E2D2] p-5 card-shadow space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE0]">
              <div className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-[#800020]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#17202A]">Tier 2 NGO & NSS Network</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 font-bold">Verified</span>
            </div>

            <div className="space-y-2 text-xs">
              {responders.filter(r => r.tier === 'TIER_2').map((ngo) => (
                <div key={ngo.id} className="p-2.5 rounded-xl bg-[#F7F3EA] border border-[#E8E2D2] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#17202A]">{ngo.name}</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase">{ngo.status}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#667085]">
                    <span>Available: <strong className="text-[#17202A]">{ngo.availableVolunteers || 12}</strong></span>
                    <span>Assigned: <strong className="text-[#800020]">{ngo.assignedVolunteers || 3}</strong></span>
                    <span>{ngo.distanceKm} km away</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
