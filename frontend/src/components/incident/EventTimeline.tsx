'use client';

import React from 'react';
import { IncidentEvent } from '@/types/emergency';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Radio, 
  Sparkles,
  HeartHandshake
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventTimelineProps {
  events: IncidentEvent[];
  className?: string;
}

export function EventTimeline({ events, className }: EventTimelineProps) {
  return (
    <div className={cn('bg-white rounded-2xl border border-[#E8E2D2] p-5 card-shadow space-y-4', className)}>
      <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE0]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#667085]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#17202A]">
            Response Timeline
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#667085] bg-[#F7F3EA] px-2 py-0.5 rounded border border-[#E8E2D2]">
          {events.length} Events
        </span>
      </div>

      <div className="space-y-4">
        {events.map((evt, idx) => (
          <div key={evt.id} className="relative pl-6 flex items-start justify-between gap-3 text-xs">
            {/* Timeline Line */}
            {idx !== events.length - 1 && (
              <span className="absolute left-2.5 top-5 -bottom-4 w-px bg-[#E8E2D2]" />
            )}

            {/* Icon Dot */}
            <div className={cn(
              'absolute left-0 top-0.5 w-5 h-5 rounded-full flex items-center justify-center border',
              evt.type === 'ALERT' && 'bg-red-50 border-red-300 text-red-600',
              evt.type === 'SUCCESS' && 'bg-emerald-50 border-emerald-300 text-emerald-600',
              evt.type === 'AGENT_ACTION' && 'bg-purple-50 border-purple-300 text-purple-600',
              evt.type === 'INFO' && 'bg-blue-50 border-blue-300 text-blue-600'
            )}>
              {evt.type === 'ALERT' ? (
                <AlertTriangle className="w-3 h-3" />
              ) : evt.type === 'SUCCESS' ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : evt.type === 'AGENT_ACTION' ? (
                <Sparkles className="w-3 h-3" />
              ) : (
                <Clock className="w-3 h-3" />
              )}
            </div>

            {/* Event Content */}
            <div className="flex-1">
              <div className="font-semibold text-[#17202A] flex items-center gap-2">
                <span>{evt.title}</span>
                {evt.tier && (
                  <span className={cn(
                    'text-[9px] px-1.5 py-0.2 rounded font-mono uppercase font-bold border',
                    evt.tier === 'TIER_1' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  )}>
                    {evt.tier === 'TIER_1' ? 'Tier 1' : 'Tier 2 NGO'}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#667085] mt-0.5">{evt.description}</p>
            </div>

            {/* Timestamp */}
            <span className="font-mono text-[11px] text-[#98A2B3] shrink-0">{evt.timeFormatted}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
