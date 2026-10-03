'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEmergency } from '@/context/EmergencyContext';
import { UserRole } from '@/types/emergency';
import { 
  Shield, 
  User, 
  Ambulance, 
  Bell, 
  RotateCcw, 
  Menu, 
  X,
  Radio,
  HeartHandshake
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
}

export function NavigationBar() {
  const pathname = usePathname();
  const { currentRole, incident, notifications, resetDemo, markNotificationsRead } = useEmergency();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoginPage = pathname === '/login';
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Removed "Report Incident" link for clean streamlined in-dashboard modal flow
  const roleNavItems: Record<UserRole, NavItem[]> = {
    USER: [
      { name: 'Dashboard', href: '/user' },
      { name: 'Live Tracking', href: `/incident/${incident.id}` }
    ],
    RESPONDER: [
      { name: 'Responder Console', href: '/responder' },
      { name: 'Turn-by-Turn HUD', href: `/responder/navigation/${incident.id}` }
    ],
    ADMIN: [
      { name: 'EOC Dashboard', href: '/admin/dashboard' },
      { name: 'Incidents', href: '/admin/incidents' },
      { name: 'Command View', href: `/admin/incidents/${incident.id}` },
      { name: 'Analytics', href: '/admin/analytics' }
    ],
    NGO: [
      { name: 'NGO Dashboard', href: '/responder' },
      { name: 'Navigation', href: `/responder/navigation/${incident.id}` }
    ]
  };

  const navLinks: NavItem[] = roleNavItems[currentRole] || roleNavItems.USER;

  return (
    <header className="sticky top-0 z-50 border-b border-[#E8E2D2] bg-[#F7F3EA]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#800020] text-white shadow-sm">
              <Shield className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-[#17202A]">
                ResQNet
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EAE4D5] text-[#667085]">
                Emergency Platform
              </span>
            </div>
          </Link>

          {/* Navigation Links (Role Filtered) */}
          {!isLoginPage && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((item: NavItem) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition',
                    pathname === item.href
                      ? 'bg-white text-[#800020] card-shadow border border-[#E8E2D2]'
                      : 'text-[#667085] hover:text-[#17202A] hover:bg-white/60'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}

          {/* Right Controls: Role Badge, Reset, Notifications, Switch Role */}
          <div className="flex items-center gap-2.5">
            {!isLoginPage && (
              <>
                {/* Active Role Indicator */}
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#E8E2D2] text-xs font-semibold text-[#17202A]">
                  <span className="text-[10px] uppercase text-[#667085]">Role:</span>
                  <span className="text-[#800020] font-bold">{currentRole}</span>
                </div>

                {/* Switch Role Link */}
                <Link
                  href="/login"
                  className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#FFFDF8] border border-[#E8E2D2] text-xs font-medium text-[#667085] hover:text-[#17202A] transition"
                  title="Switch User Role"
                >
                  Switch Role
                </Link>

                {/* Reset Simulation Demo */}
                <button
                  onClick={resetDemo}
                  title="Reset Demo Simulation"
                  className="p-1.5 rounded-lg bg-white hover:bg-[#FFFDF8] border border-[#E8E2D2] text-[#667085] hover:text-[#17202A] transition"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Notification Feed */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      if (!showNotifications) markNotificationsRead();
                    }}
                    className="relative p-1.5 rounded-lg bg-white hover:bg-[#FFFDF8] border border-[#E8E2D2] text-[#667085] hover:text-[#17202A] transition"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#800020] text-[9px] font-bold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white border border-[#E8E2D2] modal-shadow p-4 z-50 animate-in fade-in">
                      <div className="flex items-center justify-between pb-2.5 border-b border-[#F0EBE0]">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#17202A]">
                          Live Notification Feed
                        </span>
                        <span className="text-[10px] text-[#667085]">{notifications.length} updates</span>
                      </div>

                      <div className="max-h-64 overflow-y-auto divide-y divide-[#F0EBE0] mt-2">
                        {notifications.map((n) => (
                          <div key={n.id} className="py-2.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className={cn(
                                'text-xs font-semibold',
                                n.type === 'WARNING' && 'text-amber-700',
                                n.type === 'CRITICAL' && 'text-red-700',
                                n.type === 'SUCCESS' && 'text-emerald-700',
                                n.type === 'INFO' && 'text-blue-700'
                              )}>
                                {n.title}
                              </span>
                              <span className="text-[10px] font-mono text-[#98A2B3]">{n.timestamp}</span>
                            </div>
                            <p className="text-xs text-[#667085] mt-0.5 leading-relaxed">{n.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg bg-white border border-[#E8E2D2] text-[#667085]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8E2D2] bg-[#F7F3EA] px-4 py-4 space-y-2">
          {navLinks.map((item: NavItem) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2 rounded-lg text-xs font-semibold text-[#17202A] bg-white border border-[#E8E2D2]"
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2 rounded-lg text-xs font-semibold text-[#800020] bg-white border border-[#E8E2D2]"
          >
            Switch Role (Admin / User / Responder)
          </Link>
        </div>
      )}
    </header>
  );
}
