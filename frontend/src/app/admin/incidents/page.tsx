'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useEmergency } from '@/context/EmergencyContext';
import { IncidentStatusBadge, SeverityBadge, PriorityBadge } from '@/components/common/Badges';
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Users,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminIncidentsTablePage() {
  const { incident } = useEmergency();
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const sampleIncidents = [
    incident,
    {
      id: 'INC-1035',
      type: 'SAFETY' as const,
      severity: 'MEDIUM' as const,
      priority: 'P3' as const,
      status: 'RESOLVED' as const,
      description: 'Public dispute settled by Sector 7 Police Patrol.',
      address: 'Ulsoor Lake Promenade, Bengaluru',
      location: { lat: 12.9810, lng: 77.6180 },
      reportedAt: '13:45:10',
      estimatedTimeArrival: '00:00',
      assignedResponders: [{ name: 'Police Patrol B' }]
    },
    {
      id: 'INC-1031',
      type: 'ROAD_HAZARD' as const,
      severity: 'LOW' as const,
      priority: 'P4' as const,
      status: 'RESOLVED' as const,
      description: 'Fallen tree branch cleared by community volunteers.',
      address: 'Koramangala 4th Block, Bengaluru',
      location: { lat: 12.9340, lng: 77.6250 },
      reportedAt: '11:15:22',
      estimatedTimeArrival: '00:00',
      assignedResponders: [{ name: 'Community Responder Alpha' }]
    }
  ];

  const filteredIncidents = sampleIncidents.filter((inc) => {
    const matchesSearch = inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.type.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'ALL') return true;
    if (filter === 'ACTIVE') return inc.status !== 'RESOLVED';
    if (filter === 'CRITICAL') return inc.severity === 'CRITICAL' || inc.severity === 'HIGH';
    if (filter === 'RESOLVED') return inc.status === 'RESOLVED';
    return true;
  });

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
      
      {/* Header (Burgundy) */}
      <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-[#800020] via-[#6B001B] to-[#4D0013] text-white border border-[#ff94b0]/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-pink-200">
            Incident Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Live Emergency Incident Registry
          </h1>
          <p className="text-xs text-pink-100/80 mt-1">
            Real-time urban incident stream with multi-criteria filtering and command drill-down
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-pink-200 bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl backdrop-blur-xs">
            Showing <strong className="text-white font-bold">{filteredIncidents.length}</strong> Incidents
          </span>
        </div>
      </div>

      {/* Search & Filter Bar (White) */}
      <div className="p-4 rounded-2xl bg-white border border-[#E8E2D2] card-shadow flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#98A2B3] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search incident ID, type, or address location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F7F3EA] border border-[#E8E2D2] text-xs text-[#17202A] placeholder-[#98A2B3] focus:outline-none focus:border-[#800020]"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'ACTIVE', 'CRITICAL', 'RESOLVED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition shrink-0',
                filter === f
                  ? 'bg-[#800020] text-white shadow-sm'
                  : 'bg-[#F7F3EA] text-[#667085] hover:text-[#17202A] border border-[#E8E2D2]'
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents Table (White) */}
      <div className="rounded-2xl bg-white border border-[#E8E2D2] overflow-hidden card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F3EA] text-[10px] font-mono uppercase text-[#667085] border-b border-[#E8E2D2]">
              <tr>
                <th className="py-3.5 px-4 font-bold">Incident ID</th>
                <th className="py-3.5 px-4 font-bold">Type</th>
                <th className="py-3.5 px-4 font-bold">Severity</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold">Address</th>
                <th className="py-3.5 px-4 font-bold">Responders</th>
                <th className="py-3.5 px-4 font-bold">ETA</th>
                <th className="py-3.5 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EBE0]">
              {filteredIncidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-[#FFFDF8] transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#17202A]">
                    {inc.id}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#17202A]">
                    {inc.type}
                  </td>
                  <td className="py-3.5 px-4">
                    <SeverityBadge severity={inc.severity} />
                  </td>
                  <td className="py-3.5 px-4">
                    <IncidentStatusBadge status={inc.status} />
                  </td>
                  <td className="py-3.5 px-4 text-[#667085] max-w-xs truncate">
                    {inc.address}
                  </td>
                  <td className="py-3.5 px-4 text-[#667085] font-mono">
                    {inc.assignedResponders?.[0]?.name || 'Auto Dispatching'}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                    {inc.status === 'RESOLVED' ? '00:00' : inc.estimatedTimeArrival}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/admin/incidents/${inc.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F4E8EB] text-[#800020] hover:bg-[#800020] hover:text-white border border-[#e8d5d9] font-bold transition text-[11px]"
                    >
                      <span>Command</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
