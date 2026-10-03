'use client';

import React from 'react';
import { IncidentStatus, IncidentSeverity, IncidentPriority, ResponderType, ResponseTier, AgentStatus } from '@/types/emergency';
import { cn } from '@/lib/utils';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Radio, 
  Ambulance, 
  Shield, 
  Flame, 
  HeartHandshake, 
  Users,
  Sparkles 
} from 'lucide-react';

export function IncidentStatusBadge({ status, className }: { status: IncidentStatus; className?: string }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'REPORTING':
      case 'ANALYZING':
      case 'SEARCHING_TIER_1':
      case 'SEARCHING_TIER_2':
        return { label: status.replace(/_/g, ' '), bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock };
      case 'TIER_1_ASSIGNED':
      case 'TIER_2_ASSIGNED':
      case 'ACCEPTED':
      case 'EN_ROUTE':
        return { label: status === 'EN_ROUTE' ? 'RESPONDER EN ROUTE' : status.replace(/_/g, ' '), bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: Radio };
      case 'TIER_1_TIMEOUT':
      case 'DELAY_DETECTED':
        return { label: 'DELAY DETECTED', bg: 'bg-red-50 text-red-700 border-red-200', icon: AlertTriangle };
      case 'ESCALATING':
      case 'REPLANNING':
        return { label: 'AUTONOMOUS ESCALATION', bg: 'bg-purple-50 text-purple-700 border-purple-200', icon: Sparkles };
      case 'REASSIGNED':
        return { label: 'NEW RESPONDER ASSIGNED', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 };
      case 'ARRIVED':
        return { label: 'ARRIVED ON SCENE', bg: 'bg-teal-50 text-teal-700 border-teal-200', icon: CheckCircle2 };
      case 'RESOLVED':
        return { label: 'RESOLVED', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 };
      default:
        return { label: status, bg: 'bg-slate-100 text-slate-700 border-slate-200', icon: Clock };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider border',
      config.bg,
      className
    )}>
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: IncidentSeverity }) {
  const map = {
    LOW: 'bg-slate-100 text-slate-700 border-slate-200',
    MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
    HIGH: 'bg-orange-50 text-orange-700 border-orange-200 font-bold',
    CRITICAL: 'bg-red-50 text-red-700 border-red-200 font-bold'
  };

  return (
    <span className={cn('px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase border', map[severity])}>
      {severity}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: IncidentPriority }) {
  const map = {
    P1: 'bg-red-100 text-red-700 border-red-200 font-black',
    P2: 'bg-orange-100 text-orange-700 border-orange-200 font-bold',
    P3: 'bg-amber-100 text-amber-700 border-amber-200 font-semibold',
    P4: 'bg-blue-100 text-blue-700 border-blue-200'
  };

  return (
    <span className={cn('px-2 py-0.5 rounded text-[11px] font-mono tracking-tight border', map[priority])}>
      {priority}
    </span>
  );
}

export function TierBadge({ tier }: { tier: ResponseTier }) {
  return (
    <span className={cn(
      'px-2 py-0.5 rounded text-[11px] font-bold uppercase border tracking-wider',
      tier === 'TIER_1'
        ? 'bg-blue-50 text-blue-700 border-blue-200'
        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
    )}>
      {tier === 'TIER_1' ? 'Tier 1 Primary' : 'Tier 2 NGO'}
    </span>
  );
}

export function ResponderTypeBadge({ type }: { type: ResponderType }) {
  const getIcon = () => {
    switch (type) {
      case 'AMBULANCE':
        return { icon: Ambulance, text: 'Ambulance (Tier 1)', color: 'text-blue-700 bg-blue-50 border-blue-200' };
      case 'POLICE':
        return { icon: Shield, text: 'Police (Tier 1)', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
      case 'FIRE':
        return { icon: Flame, text: 'Fire (Tier 1)', color: 'text-orange-700 bg-orange-50 border-orange-200' };
      case 'NGO':
        return { icon: HeartHandshake, text: 'Verified NGO (Tier 2)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      default:
        return { icon: Users, text: 'Community Volunteer', color: 'text-slate-700 bg-slate-100 border-slate-200' };
    }
  };

  const item = getIcon();
  const Icon = item.icon;

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border', item.color)}>
      <Icon className="w-3.5 h-3.5" />
      {item.text}
    </span>
  );
}

export function AgentStatusBadge({ status }: { status: AgentStatus }) {
  const map = {
    STANDBY: 'text-slate-600 bg-slate-100 border-slate-200',
    ANALYZING: 'text-blue-700 bg-blue-50 border-blue-200',
    ACTIVE: 'text-blue-700 bg-blue-50 border-blue-200 font-semibold',
    MONITORING: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    COMPLETE: 'text-slate-700 bg-slate-100 border-slate-200',
    ESCALATED: 'text-red-700 bg-red-50 border-red-200 font-bold'
  };

  return (
    <span className={cn('px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border', map[status])}>
      {status}
    </span>
  );
}
