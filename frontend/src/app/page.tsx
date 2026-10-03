'use client';

import React from 'react';
import Link from 'next/link';
import { useEmergency } from '@/context/EmergencyContext';
import { LiveMap } from '@/components/map/LiveMap';
import { 
  AlertOctagon, 
  MapPin, 
  Clock, 
  Ambulance, 
  ShieldCheck, 
  ArrowRight, 
  HeartHandshake,
  Shield
} from 'lucide-react';

export default function LandingPage() {
  const { incident, responders } = useEmergency();

  return (
    <div className="flex-1 flex flex-col">
      
      {/* Hero Section */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Location Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8E2D2] text-[#17202A] text-xs font-semibold card-shadow">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-calm-pulse" />
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Location detected: Bengaluru Central Corridor</span>
            </div>

            {/* Hero Heading */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#17202A] leading-tight">
                Emergency happens.<br />
                <span className="text-[#800020]">
                  Response should happen automatically.
                </span>
              </h1>
              <p className="text-base text-[#667085] max-w-xl leading-relaxed">
                Report an incident once and let intelligent coordination handle Tier 1 primary dispatch, real-time telemetry monitoring, and autonomous Tier 2 NSS & NGO escalation.
              </p>
            </div>

            {/* Primary Action Buttons (Burgundy) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/login"
                className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider btn-burgundy shadow-md transition flex items-center justify-center gap-2"
              >
                <span>LOGIN AS ADMIN / USER / RESPONDER</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/report"
                className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-[#17202A] bg-white hover:bg-[#F7F3EA] border border-[#E8E2D2] card-shadow transition flex items-center justify-center gap-2"
              >
                <AlertOctagon className="w-4 h-4 text-[#800020]" />
                <span>REPORT EMERGENCY</span>
              </Link>
            </div>

            {/* Network Overview Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              <div className="p-3.5 rounded-xl bg-white border border-[#E8E2D2] card-shadow">
                <div className="text-[10px] font-bold text-[#667085] uppercase">Responders Online</div>
                <div className="text-lg font-black text-[#17202A] font-mono mt-0.5">12 Units</div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#E8E2D2] card-shadow">
                <div className="text-[10px] font-bold text-[#667085] uppercase">Tier 1 Primary</div>
                <div className="text-lg font-black text-blue-700 font-mono mt-0.5">4 Ambulances</div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#E8E2D2] card-shadow">
                <div className="text-[10px] font-bold text-[#667085] uppercase">Tier 2 NGOs</div>
                <div className="text-lg font-black text-emerald-700 font-mono mt-0.5">3 Connected</div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#E8E2D2] card-shadow">
                <div className="text-[10px] font-bold text-[#667085] uppercase">Active Incidents</div>
                <div className="text-lg font-black text-[#800020] font-mono mt-0.5">1 Active</div>
              </div>
            </div>

          </div>

          {/* Right Column: Live City Map */}
          <div className="lg:col-span-5 h-[400px]">
            <LiveMap incident={incident} responders={responders} className="h-full" />
          </div>

        </div>
      </section>

      {/* Emergency Lifecycle 2-Tier Architecture Section */}
      <section className="py-14 bg-white border-t border-b border-[#E8E2D2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#800020]">
              Autonomous Escalation Hierarchy
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17202A]">
              How the Platform Responds
            </h2>
            <p className="text-xs sm:text-sm text-[#667085]">
              Intelligent multi-tier dispatch ensures emergencies receive rapid assistance without manual delays.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Tier 1 Box */}
            <div className="p-6 rounded-2xl bg-[#F7F3EA] border border-[#E8E2D2] space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#F4E8EB] text-[#800020] flex items-center justify-center font-bold text-xs">
                  01
                </div>
                <h3 className="text-base font-bold text-[#17202A]">Tier 1 — Primary Emergency Responders</h3>
              </div>
              <p className="text-xs text-[#667085] leading-relaxed">
                First priority dispatch to municipal ambulances, police patrol, and fire services. Evaluated by shortest response corridor and trauma capabilities.
              </p>
            </div>

            {/* Tier 2 Box */}
            <div className="p-6 rounded-2xl bg-[#F7F3EA] border border-[#E8E2D2] space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  02
                </div>
                <h3 className="text-base font-bold text-[#17202A]">Tier 2 — NSS & Verified Local NGO Network</h3>
              </div>
              <p className="text-xs text-[#667085] leading-relaxed">
                If Tier 1 responders are unavailable or delayed, the Escalation Agent autonomously searches and assigns verified NSS volunteers and NGO support groups.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
