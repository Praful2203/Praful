'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEmergency } from '@/context/EmergencyContext';
import { LiveMap } from '@/components/map/LiveMap';
import { 
  Navigation, 
  ArrowUp, 
  CornerUpLeft, 
  CornerUpRight, 
  CheckCircle2, 
  MapPin, 
  Volume2, 
  ShieldCheck 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ResponderNavigationPage() {
  const router = useRouter();
  const { incident, responders, markResponderArrived, resolveIncident } = useEmergency();
  const [stepIndex, setStepIndex] = useState(0);

  const turnInstructions = [
    { text: 'Continue straight on MG Road Expressway for 600 m', icon: ArrowUp, dist: '600 m' },
    { text: 'Turn left onto Innovation Avenue in 200 m', icon: CornerUpLeft, dist: '200 m' },
    { text: 'Turn right at Tech Zone Gate 2 perimeter', icon: CornerUpRight, dist: '50 m' },
    { text: 'Incident location reached on right side', icon: MapPin, dist: '0 m' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev < turnInstructions.length - 1 ? prev + 1 : prev));
    }, 4500);
    return () => clearInterval(timer);
  }, [turnInstructions.length]);

  const currentStep = turnInstructions[stepIndex];
  const StepIcon = currentStep.icon;

  const isArrived = incident.status === 'ARRIVED' || incident.status === 'RESOLVED';

  return (
    <div className="flex-1 flex flex-col min-h-[calc(100vh-4rem)] p-4 sm:p-6 max-w-6xl mx-auto w-full space-y-4">
      
      {/* Top HUD Nav Header (Burgundy) */}
      <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-[#800020] via-[#6B001B] to-[#4D0013] text-white border border-[#ff94b0]/30 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-2xl bg-white/10 text-pink-200 border border-white/20 backdrop-blur-xs">
            <Navigation className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-pink-200 block">
              Turn-by-Turn Navigation HUD
            </span>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight font-mono">
              Target: {incident.id} ({incident.type})
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4 text-right">
          <div>
            <span className="text-[10px] font-mono text-pink-200 uppercase block">ETA</span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-300 drop-shadow-sm">
              {isArrived ? '00:00' : incident.estimatedTimeArrival}
            </span>
          </div>
        </div>
      </div>

      {/* Floating Maneuver Banner */}
      <div className="bg-white rounded-2xl border border-blue-200 p-4 card-shadow flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-600 text-white shadow-sm">
            <StepIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 block">
              Next Maneuver • {currentStep.dist}
            </span>
            <p className="text-base font-bold text-[#17202A] mt-0.5">
              {currentStep.text}
            </p>
          </div>
        </div>

        <button className="p-2 rounded-lg bg-[#F7F3EA] text-[#667085] hover:text-[#17202A]">
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Live Map Area */}
      <div className="h-[400px]">
        <LiveMap incident={incident} responders={responders} className="h-full" />
      </div>

      {/* Bottom Action Footer */}
      <div className="bg-white rounded-2xl border border-[#E8E2D2] p-4 card-shadow flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-[#667085]">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Status: <strong>{isArrived ? 'Arrived on Scene' : 'En Route with Priority'}</strong></span>
        </div>

        <div>
          {!isArrived ? (
            <button
              onClick={markResponderArrived}
              className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>MARK ARRIVED ON SCENE</span>
            </button>
          ) : (
            <button
              onClick={() => {
                resolveIncident();
                router.push('/responder');
              }}
              className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>RESOLVE & CLOSE INCIDENT</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
