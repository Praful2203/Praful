'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEmergency } from '@/context/EmergencyContext';
import { LiveMap } from '@/components/map/LiveMap';
import { EventTimeline } from '@/components/incident/EventTimeline';
import { IncidentStatusBadge, SeverityBadge, TierBadge } from '@/components/common/Badges';
import { EmergencyType } from '@/types/emergency';
import { 
  MapPin, 
  Ambulance, 
  HeartHandshake, 
  ArrowRight,
  AlertTriangle,
  Flame,
  HeartPulse,
  ShieldAlert,
  Construction,
  HelpCircle,
  Users,
  Shield,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UserDashboardPage() {
  const router = useRouter();
  const { incident, responders, reportEmergency } = useEmergency();

  // Emergency Modal State for all categories
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<EmergencyType>('ACCIDENT');
  const [selectedPeople, setSelectedPeople] = useState<number>(2);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeResponder = incident.assignedResponder || responders[0];
  const isTier2 = incident.currentTier === 'TIER_2';
  const isCompleted = incident.status === 'RESOLVED';

  const categoryConfigs: Record<EmergencyType, { label: string; desc: string; subtitle: string; placeholder: string; icon: any }> = {
    ACCIDENT: {
      label: 'Accident Report',
      subtitle: 'Specify casualty scale & details for rapid trauma dispatch',
      desc: 'Vehicle collision, road trauma',
      placeholder: 'Describe accident details (e.g. Two-wheeler collision near Gate 2)...',
      icon: AlertTriangle
    },
    MEDICAL: {
      label: 'Medical Emergency',
      subtitle: 'Specify patient count & symptoms for ambulance ALS dispatch',
      desc: 'Cardiac, severe illness, stroke',
      placeholder: 'Describe medical emergency (e.g. Unconscious patient, severe chest pain)...',
      icon: HeartPulse
    },
    FIRE: {
      label: 'Fire Hazard Report',
      subtitle: 'Specify people affected & hazard location for fire rescue',
      desc: 'Building fire, electrical hazard',
      placeholder: 'Describe fire outbreak (e.g. Electrical fire in building basement)...',
      icon: Flame
    },
    SAFETY: {
      label: 'Public Safety Alert',
      subtitle: 'Specify crowd scale & threat level for police response',
      desc: 'Physical threat, active dispute',
      placeholder: 'Describe safety incident (e.g. Physical altercation, crowd unrest)...',
      icon: ShieldAlert
    },
    ROAD_HAZARD: {
      label: 'Road Hazard Report',
      subtitle: 'Specify obstruction & people impacted for rapid clearance',
      desc: 'Obstruction, fallen tree',
      placeholder: 'Describe road hazard (e.g. Large tree branch blocking arterial road)...',
      icon: Construction
    },
    OTHER: {
      label: 'General Emergency',
      subtitle: 'Specify assistance needed & people involved',
      desc: 'General emergency assistance',
      placeholder: 'Describe emergency situation...',
      icon: HelpCircle
    }
  };

  const emergencyCategories: { type: EmergencyType; label: string; desc: string; icon: any }[] = [
    { type: 'ACCIDENT', label: 'Accident', desc: 'Vehicle collision, road...', icon: AlertTriangle },
    { type: 'MEDICAL', label: 'Medical', desc: 'Cardiac, severe illness,...', icon: HeartPulse },
    { type: 'SAFETY', label: 'Safety', desc: 'Physical threat, active...', icon: ShieldAlert },
    { type: 'ROAD_HAZARD', label: 'Road Hazard', desc: 'Obstruction, fallen tree', icon: Construction },
    { type: 'OTHER', label: 'Other', desc: 'General emergency...', icon: HelpCircle }
  ];

  const handleCategoryClick = (type: EmergencyType) => {
    setSelectedCategory(type);
    setDescription(type === 'ACCIDENT' ? 'Two-wheeler accident near the main gate. 2 people involved.' : '');
    setShowModal(true);
  };

  const handleModalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const incId = await reportEmergency({
        type: selectedCategory,
        description: description,
        peopleInvolved: 2, // Default or dynamic
        address: 'Auto-detected Location',
        location: { lat: 12.9716, lng: 77.5946 }
      });
      
      setIsSubmitting(false);
      router.push(`/incident/${incId}`);
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  const currentConfig = categoryConfigs[selectedCategory];
  const CurrentModalIcon = currentConfig.icon;

  return (
    <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      
      {/* 3. PRIMARY EMERGENCY CARD: CITIZEN EMERGENCY RESPONSE (Burgundy Background with Subtle Neon Glow & ResQNet Logo) */}
      <div className="rounded-3xl p-7 sm:p-9 bg-gradient-to-br from-[#800020] via-[#660019] to-[#4D0013] text-white border-2 border-[#ff94b0]/40 neon-burgundy-card relative overflow-hidden">
        
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/25 text-pink-200 text-xs font-mono font-bold tracking-wider mb-2 border border-pink-300/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>AI DISPATCH SYSTEM ACTIVE</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                🤖 AI EMERGENCY RESPONSE AGENT
              </h1>
              <p className="text-xs sm:text-sm text-pink-100/80 max-w-xl mt-1 leading-relaxed">
                Report what happened below. Our Groq-powered AI will automatically analyze the severity and dispatch the nearest relevant emergency swarms.
              </p>
            </div>

            {/* ResQNet Exact 1st Logo (Transparent Background) */}
            <div className="flex items-center shrink-0">
              <Image
                src="/resqnet-logo-transparent.png"
                alt="ResQNet - Faster Response | Safer Communities"
                width={210}
                height={58}
                className="h-12 w-auto object-contain drop-shadow-md"
                priority
              />
            </div>
          </div>

          {/* AI EMERGENCY FORM */}
          <div className="bg-white/10 p-5 rounded-2xl border border-white/20 backdrop-blur-md space-y-4">
            <div>
              <label className="text-xs font-bold text-white mb-1.5 block">Emergency Type ▼</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value as EmergencyType)}
                className="w-full bg-white/20 text-white p-3 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                <option value="ACCIDENT" className="text-black">1. Accident</option>
                <option value="MEDICAL" className="text-black">2. Medical</option>
                <option value="SAFETY" className="text-black">3. Safety</option>
                <option value="ROAD_HAZARD" className="text-black">4. Road Hazard</option>
                <option value="OTHER" className="text-black">5. Other</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs font-bold text-white mb-1.5 block">Briefly describe what happened?</label>
              <textarea 
                rows={3}
                placeholder="e.g. There was a collision between two cars near the main gate..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white/20 text-white placeholder-pink-100/50 p-3 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <MapPin className="w-4 h-4" />
                <span>Location detected automatically</span>
              </div>
              
              <button
                onClick={handleModalSubmit}
                disabled={isSubmitting || !description}
                className="py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-wider bg-white text-[#800020] hover:bg-gray-100 transition shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? 'ANALYZING...' : '[ ANALYZE & ASSIGN ]'}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* POPUP MODAL FOR ALL CATEGORIES (WITH PEOPLE INVOLVED + DESCRIPTION SECTION) */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E8E2D2] max-w-lg w-full p-7 modal-shadow space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE0]">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-[#F4E8EB] text-[#800020]">
                  <CurrentModalIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#17202A]">{currentConfig.label}</h3>
                  <span className="text-xs text-[#667085]">{currentConfig.subtitle}</span>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#98A2B3] hover:text-[#17202A] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* People Involved Selector (Hidden for Road Hazard) */}
            {selectedCategory !== 'ROAD_HAZARD' && (
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-[#17202A] flex items-center gap-1.5 uppercase tracking-wider">
                  <Users className="w-3.5 h-3.5 text-[#800020]" />
                  <span>How many people are involved?</span>
                </label>

                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {[1, 2, 3, 4, 5, 6, '7+'].map((num, idx) => {
                    const val = typeof num === 'number' ? num : 7;
                    const isSelected = selectedPeople === val;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedPeople(val)}
                        className={cn(
                          'py-3 rounded-xl border text-sm font-black font-mono transition flex items-center justify-center',
                          isSelected
                            ? 'bg-[#800020] text-white border-[#800020] shadow-md shadow-[#800020]/20 ring-2 ring-[#800020]/30'
                            : 'bg-[#F7F3EA] text-[#17202A] border-[#E8E2D2] hover:bg-white hover:border-[#800020]'
                        )}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Description Section */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#17202A] flex items-center gap-1.5 uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5 text-[#800020]" />
                <span>Incident Description & Details</span>
              </label>
              <textarea
                rows={selectedCategory === 'ROAD_HAZARD' ? 4 : 2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={currentConfig.placeholder}
                className="w-full p-3 rounded-xl border border-[#E8E2D2] bg-[#F7F3EA] text-xs text-[#17202A] placeholder-[#98A2B3] focus:outline-none focus:border-[#800020] transition resize-none"
              />
            </div>

            {/* Auto-Captured Location Box */}
            <div className="p-3 rounded-xl bg-[#F7F3EA] border border-[#E8E2D2] space-y-1 text-xs font-mono">
              <span className="text-[10px] text-[#667085] uppercase font-bold block">Location Automatically Captured</span>
              <div className="text-[#17202A] font-bold">12.9716, 77.5946 • Main Gate Corridor, Bengaluru</div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleModalSubmit}
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider btn-burgundy flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>DISPATCHING EMERGENCY SWARM...</span>
              ) : (
                <>
                  <span>
                    {selectedCategory === 'ROAD_HAZARD'
                      ? 'CONFIRM & DISPATCH ROAD CLEARANCE AID'
                      : `CONFIRM & DISPATCH AID (${selectedPeople} PEOPLE)`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </div>
        </div>
      )}

      {/* Active Incident Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#17202A]">Your Active Incident Tracking</h2>
          <Link
            href={`/incident/${incident.id}`}
            className="text-xs font-semibold text-[#800020] hover:underline flex items-center gap-1"
          >
            <span>Full Tracking HUD</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Active Incident Card */}
        <div className="bg-white rounded-2xl border border-[#E8E2D2] p-6 card-shadow space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EBE0]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold font-mono text-[#17202A]">{incident.id}</span>
                <span className="text-xs font-bold text-red-600 uppercase">{incident.type}</span>
                <span className="px-2 py-0.5 rounded bg-[#F4E8EB] text-[#800020] text-[11px] font-mono font-bold border border-[#e8d5d9]">
                  {incident.peopleInvolved} People Involved
                </span>
                <SeverityBadge severity={incident.severity} />
                <TierBadge tier={incident.currentTier} />
              </div>
              <p className="text-xs text-[#667085] mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#800020]" />
                <span>{incident.address}</span>
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-[#667085] uppercase block">Estimated Arrival</span>
              <span className="text-2xl font-black font-mono text-emerald-700">
                {isCompleted ? 'RESOLVED' : incident.status === 'ARRIVED' ? 'ON SCENE' : incident.estimatedTimeArrival}
              </span>
            </div>
          </div>

          {/* Map + Timeline Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Live Map */}
            <div className="lg:col-span-7 h-[360px]">
              <LiveMap incident={incident} responders={responders} className="h-full" />
            </div>

            {/* Responder & Event Summary */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Assigned Responder Unit Card */}
              <div className="p-4 rounded-xl bg-[#F7F3EA] border border-[#E8E2D2] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-[#667085]">Current Assigned Responder</span>
                  <IncidentStatusBadge status={incident.status} />
                </div>

                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center border',
                    isTier2 ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-[#F4E8EB] text-[#800020] border-[#e8d5d9]'
                  )}>
                    {isTier2 ? <HeartHandshake className="w-5 h-5" /> : <Ambulance className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#17202A]">{activeResponder.name}</div>
                    <div className="text-[11px] text-[#667085]">{activeResponder.organization}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-[#E8E2D2]">
                  <div>
                    <span className="text-[10px] text-[#667085] block">Distance</span>
                    <span className="text-[#17202A] font-bold">{activeResponder.distanceKm} km away</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#667085] block">ETA</span>
                    <span className="text-emerald-700 font-bold">{activeResponder.eta} min</span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <EventTimeline events={incident.events} />
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
