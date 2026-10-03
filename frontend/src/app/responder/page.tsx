'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useEmergency } from '@/context/EmergencyContext';
import { LiveMap } from '@/components/map/LiveMap';
import { 
  Radio, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Navigation, 
  ArrowRight,
  ShieldCheck,
  Truck,
  HeartHandshake
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ResponderPage() {
  const { 
    incident, 
    responders, 
    acceptIncidentByResponder, 
    rejectIncidentByResponder,
    markResponderArrived,
    markAsCompleted
  } = useEmergency();

  const activeUnit = incident.assignedResponder || responders[0];
  const isAssignedToThisUnit = activeUnit.id === 'AMB-101' || incident.status === 'EN_ROUTE' || incident.status === 'ARRIVED';
  const isArrived = incident.status === 'ARRIVED' || incident.status === 'RESOLVED';
  const isCompleted = incident.status === 'RESOLVED';

  const handleAccept = () => {
    acceptIncidentByResponder(activeUnit.id);
  };

  const handleReject = () => {
    rejectIncidentByResponder(activeUnit.id);
  };

  return (
    <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
      
      {/* Top Header Card (Burgundy) */}
      <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-[#800020] via-[#6B001B] to-[#4D0013] text-white border border-[#ff94b0]/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-pink-200">
            Official Emergency Unit Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Responder Dashboard
          </h1>
          <p className="text-xs text-pink-100/80 mt-1">
            Unit: <strong className="text-white font-bold">{activeUnit.name}</strong> • Vehicle: <span className="font-mono font-bold text-pink-200">{activeUnit.plateNumber}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase font-bold text-pink-200 block">Current Operational Status</span>
            <span className={cn(
              'px-3 py-1 rounded-xl text-xs font-mono font-bold uppercase border inline-block mt-1 backdrop-blur-xs',
              isCompleted || incident.status === 'RESOLVED' || activeUnit.status === 'AVAILABLE'
                ? 'bg-emerald-400/20 text-emerald-200 border-emerald-400/40'
                : 'bg-emerald-400/20 text-emerald-200 border-emerald-400/40'
            )}>
              {isCompleted ? 'AVAILABLE (READY FOR TASK)' : incident.status.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Tactical Map */}
        <div className="lg:col-span-7 h-[420px]">
          <LiveMap incident={incident} responders={responders} className="h-full" />
        </div>

        {/* Assignment Action Card */}
        <div className="lg:col-span-5 space-y-4">
          
          {incident.status === 'ESCALATING' || incident.currentTier === 'TIER_2' ? (
            <div className="bg-white rounded-2xl border border-[#E8E2D2] p-6 card-shadow text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#17202A]">Assignment Escalated to Tier 2 NGO</h3>
              <p className="text-xs text-[#667085] leading-relaxed">
                Unit rejected or timed out. Escalation Agent transferred incident to verified local NGO support.
              </p>
              <div className="pt-2 text-[11px] font-mono text-emerald-700 font-bold">
                Unit Status: AVAILABLE for next urban priority
              </div>
            </div>
          ) : isCompleted ? (
            <div className="bg-white rounded-2xl border border-[#E8E2D2] p-6 card-shadow text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#17202A]">Incident Completed & Resolved</h3>
              <p className="text-xs text-[#667085] leading-relaxed">
                Response completed. Patients safely transferred. Responder unit is now available.
              </p>
              <span className="inline-block px-3 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">
                STATUS: AVAILABLE (FREE)
              </span>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E8E2D2] p-6 card-shadow space-y-5">
              
              {/* Emergency Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 block mb-1">
                    New Emergency Request
                  </span>
                  <h2 className="text-2xl font-black text-[#17202A] font-mono">
                    {incident.id}
                  </h2>
                  <p className="text-xs font-bold text-red-600 uppercase mt-0.5">
                    {incident.type} • High Priority
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#667085] uppercase block">Est. ETA</span>
                  <div className="text-2xl font-black font-mono text-emerald-700">
                    {incident.status === 'ARRIVED' ? '00:00' : incident.estimatedTimeArrival}
                  </div>
                  <span className="text-[10px] text-[#667085]">{activeUnit.distanceKm} km away</span>
                </div>
              </div>

              {/* Details & Location */}
              <div className="p-3.5 rounded-xl bg-[#F7F3EA] border border-[#E8E2D2] space-y-1.5 text-xs">
                <span className="text-[10px] font-bold text-[#667085] uppercase">Incident Details</span>
                <p className="text-[#17202A] leading-relaxed">
                  {incident.description}
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-[#667085] border-t border-[#E8E2D2]">
                  <MapPin className="w-3.5 h-3.5 text-[#800020] shrink-0" />
                  <span className="truncate">{incident.address}</span>
                </div>
              </div>

              {/* Workflow States: Assigned / En Route / Arrived / Mark As Completed */}
              {incident.status === 'EN_ROUTE' ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold text-center flex items-center justify-center gap-2">
                    <Radio className="w-4 h-4 animate-pulse" />
                    <span>STATUS: EN ROUTE (SIREN ACTIVE)</span>
                  </div>

                  <button
                    onClick={markResponderArrived}
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>MARK ARRIVED ON SCENE</span>
                  </button>

                  <Link
                    href={`/responder/navigation/${incident.id}`}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-[#800020] bg-[#F4E8EB] hover:bg-[#ebdce0] transition flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>OPEN TURN-BY-TURN HUD</span>
                  </Link>
                </div>
              ) : incident.status === 'ARRIVED' ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold text-center flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>STATUS: ARRIVED ON SCENE • TRIAGE IN PROGRESS</span>
                  </div>

                  {/* STEP 8: MARK AS COMPLETED BUTTON */}
                  <button
                    onClick={markAsCompleted}
                    className="w-full py-4 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider text-white btn-burgundy shadow-md transition flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-5 h-5" />
                    <span>MARK AS COMPLETED (RELEASE RESPONDER)</span>
                  </button>
                </div>
              ) : (
                /* Step 3: Accept / Reject Buttons */
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleAccept}
                    className="py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ACCEPT</span>
                  </button>

                  <button
                    onClick={handleReject}
                    className="py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>REJECT</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Unit Capabilities */}
          <div className="bg-white rounded-2xl border border-[#E8E2D2] p-4 card-shadow space-y-2">
            <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider block">
              Unit Equipment & Capabilities
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeUnit.capabilities.map((cap, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-[#F7F3EA] text-[10px] font-mono text-[#17202A] border border-[#E8E2D2]"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
