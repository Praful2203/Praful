'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEmergency } from '@/context/EmergencyContext';
import { UserRole } from '@/types/emergency';
import { 
  Shield, 
  User, 
  Ambulance, 
  ArrowRight,
  Phone,
  KeyRound,
  Truck,
  CheckCircle2,
  Lock,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentRole } = useEmergency();

  // Responder Modal State
  const [showResponderModal, setShowResponderModal] = useState(false);
  const [responderMobile, setResponderMobile] = useState('+91 98450 12345');
  const [responderOtp, setResponderOtp] = useState('482910');
  const [vehicleNumber, setVehicleNumber] = useState('KA-01-EA-9912');
  const [isVerifyingResponder, setIsVerifyingResponder] = useState(false);

  // User/Citizen Modal State
  const [showUserModal, setShowUserModal] = useState(false);
  const [userContact, setUserContact] = useState('citizen@bangalore.org / +91 98765 43210');
  const [userOtp, setUserOtp] = useState('519342');
  const [isVerifyingUser, setIsVerifyingUser] = useState(false);

  // Admin Modal State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminContact, setAdminContact] = useState('admin.command@bangalore.gov.in / +91 98765 00112');
  const [adminOtp, setAdminOtp] = useState('739201');
  const [isVerifyingAdmin, setIsVerifyingAdmin] = useState(false);

  const handleSelectRole = (role: UserRole, targetPath: string) => {
    if (role === 'RESPONDER') {
      setShowResponderModal(true);
      return;
    }
    if (role === 'USER') {
      setShowUserModal(true);
      return;
    }
    if (role === 'ADMIN') {
      setShowAdminModal(true);
      return;
    }
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifyingAdmin(true);

    setTimeout(() => {
      setIsVerifyingAdmin(false);
      setShowAdminModal(false);
      setCurrentRole('ADMIN');
      router.push('/admin/dashboard');
    }, 700);
  };

  const handleResponderLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifyingResponder(true);

    setTimeout(() => {
      setIsVerifyingResponder(false);
      setShowResponderModal(false);
      setCurrentRole('RESPONDER');
      router.push('/responder');
    }, 700);
  };

  const handleUserLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifyingUser(true);

    setTimeout(() => {
      setIsVerifyingUser(false);
      setShowUserModal(false);
      setCurrentRole('USER');
      router.push('/user');
    }, 600);
  };

  const roleBlocks = [
    {
      role: 'ADMIN' as UserRole,
      title: 'ADMIN',
      icon: Shield,
      points: [
        'Monitor emergencies in real time',
        'Manage Tier 1 and Tier 2 responders',
        'View live active incidents & route maps',
        'Monitor NGO & community support'
      ],
      btnText: 'LOGIN AS ADMIN',
      href: '/admin/dashboard'
    },
    {
      role: 'USER' as UserRole,
      title: 'USER',
      icon: User,
      points: [
        'Report an emergency instantly',
        'Automatically share GPS location',
        'Track assigned responder en route',
        'View live incident status & completion'
      ],
      btnText: 'LOGIN AS USER',
      href: '/user'
    },
    {
      role: 'RESPONDER' as UserRole,
      title: 'RESPONDER',
      icon: Ambulance,
      points: [
        'For ambulance & emergency responders',
        'Secure login using registered details',
        'Accept or reject emergency assignments',
        'Turn-by-turn navigation & status updates'
      ],
      btnText: 'LOGIN AS RESPONDER',
      href: '/responder'
    }
  ];

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
      
      {/* Header */}
      <div className="text-center space-y-2 mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-[#667085]">
          Hyperlocal Autonomous Emergency Response Platform
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17202A] tracking-tight">
          Select Your Portal
        </h1>
        <p className="text-xs sm:text-sm text-[#667085] max-w-lg mx-auto">
          Choose your operational role to access your dedicated emergency response workspace.
        </p>
      </div>

      {/* Three Clean Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {roleBlocks.map((block) => {
          const Icon = block.icon;
          return (
            <div
              key={block.role}
              className="bg-white rounded-2xl border border-[#E8E2D2] p-7 card-shadow hover:card-shadow-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-[#F7F3EA] border border-[#E8E2D2] flex items-center justify-center text-[#800020] group-hover:scale-105 transition">
                  <Icon className="w-6 h-6" />
                </div>

                {/* Role Title */}
                <div>
                  <h2 className="text-xl font-bold text-[#17202A] tracking-tight">
                    {block.title}
                  </h2>
                  
                  {/* Bullet Points */}
                  <ul className="mt-3 space-y-1.5 text-xs text-[#667085]">
                    {block.points.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#800020] font-bold mt-0.5">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Burgundy Login Button */}
              <div className="pt-6 mt-4 border-t border-[#F7F3EA]">
                <button
                  onClick={() => handleSelectRole(block.role, block.href)}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider btn-burgundy flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>{block.btnText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADMIN COMMAND LOGIN MODAL */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E2D2] max-w-md w-full p-6 modal-shadow space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE0]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#F4E8EB] text-[#800020]">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#17202A]">Admin Command Portal</h3>
                  <span className="text-[10px] text-[#667085]">Emergency Governance & Control Room</span>
                </div>
              </div>
              <button
                onClick={() => setShowAdminModal(false)}
                className="text-[#98A2B3] hover:text-[#17202A] text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdminLoginSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#17202A] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#800020]" />
                  <span>Official Email / Mobile Number</span>
                </label>
                <input
                  type="text"
                  value={adminContact}
                  onChange={(e) => setAdminContact(e.target.value)}
                  required
                  placeholder="admin@bangalore.gov.in / +91 98765 00112"
                  className="w-full p-3 rounded-xl border border-[#E8E2D2] bg-[#F7F3EA] text-[#17202A] font-medium focus:outline-none focus:border-[#800020]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#17202A] flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#800020]" />
                  <span>One-Time Password (OTP)</span>
                </label>
                <input
                  type="text"
                  value={adminOtp}
                  onChange={(e) => setAdminOtp(e.target.value)}
                  required
                  placeholder="• • • • • •"
                  className="w-full p-2.5 rounded-xl border border-[#E8E2D2] bg-[#F7F3EA] text-[#17202A] font-mono tracking-widest text-center text-sm font-bold focus:outline-none focus:border-[#800020]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isVerifyingAdmin}
                  className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider btn-burgundy flex items-center justify-center gap-2 shadow-sm"
                >
                  {isVerifyingAdmin ? (
                    <span>AUTHENTICATING ADMIN CREDENTIALS...</span>
                  ) : (
                    <>
                      <span>CONTINUE TO DASHBOARD</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* USER LOGIN MODAL */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E2D2] max-w-md w-full p-6 modal-shadow space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE0]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#F4E8EB] text-[#800020]">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#17202A]">Continue as Citizen</h3>
                  <span className="text-[10px] text-[#667085]">Fast Citizen Emergency Portal</span>
                </div>
              </div>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-[#98A2B3] hover:text-[#17202A] text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUserLoginSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#17202A] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#800020]" />
                  <span>Email address / Mobile number</span>
                </label>
                <input
                  type="text"
                  value={userContact}
                  onChange={(e) => setUserContact(e.target.value)}
                  required
                  placeholder="Enter email or mobile number"
                  className="w-full p-3 rounded-xl border border-[#E8E2D2] bg-[#F7F3EA] text-[#17202A] font-medium focus:outline-none focus:border-[#800020]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#17202A] flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#800020]" />
                  <span>One-Time Password (OTP)</span>
                </label>
                <input
                  type="text"
                  value={userOtp}
                  onChange={(e) => setUserOtp(e.target.value)}
                  required
                  placeholder="• • • • • •"
                  className="w-full p-2.5 rounded-xl border border-[#E8E2D2] bg-[#F7F3EA] text-[#17202A] font-mono tracking-widest text-center text-sm font-bold focus:outline-none focus:border-[#800020]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isVerifyingUser}
                  className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider btn-burgundy flex items-center justify-center gap-2 shadow-sm"
                >
                  {isVerifyingUser ? (
                    <span>AUTHENTICATING CITIZEN SESSION...</span>
                  ) : (
                    <>
                      <span>CONTINUE TO DASHBOARD</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESPONDER OFFICIAL LOGIN MODAL */}
      {showResponderModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E2D2] max-w-md w-full p-6 modal-shadow space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE0]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#F4E8EB] text-[#800020]">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#17202A]">Official Responder Verification</h3>
                  <span className="text-[10px] text-[#667085]">Registered Unit Portal • Simulated Demo</span>
                </div>
              </div>
              <button
                onClick={() => setShowResponderModal(false)}
                className="text-[#98A2B3] hover:text-[#17202A] text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleResponderLoginSubmit} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="font-bold text-[#17202A] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#800020]" />
                  <span>Registered Mobile Number</span>
                </label>
                <input
                  type="text"
                  value={responderMobile}
                  onChange={(e) => setResponderMobile(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-[#E8E2D2] bg-[#F7F3EA] text-[#17202A] font-mono focus:outline-none focus:border-[#800020]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#17202A] flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#800020]" />
                  <span>One-Time Password (OTP)</span>
                </label>
                <input
                  type="text"
                  value={responderOtp}
                  onChange={(e) => setResponderOtp(e.target.value)}
                  required
                  placeholder="• • • • • •"
                  className="w-full p-2.5 rounded-xl border border-[#E8E2D2] bg-[#F7F3EA] text-[#17202A] font-mono tracking-widest text-center text-sm font-bold focus:outline-none focus:border-[#800020]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#17202A] flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#800020]" />
                  <span>Registered Vehicle / Unit Plate</span>
                </label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-[#E8E2D2] bg-[#F7F3EA] text-[#17202A] font-mono font-bold focus:outline-none focus:border-[#800020]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isVerifyingResponder}
                  className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider btn-burgundy flex items-center justify-center gap-2 shadow-sm"
                >
                  {isVerifyingResponder ? (
                    <span>VERIFYING RESPONDER CREDENTIALS...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>AUTHENTICATE & ENTER CONSOLE</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Footer Differentiator */}
      <div className="mt-10 text-center text-xs text-[#98A2B3]">
        Tier 1 Primary Responders • Tier 2 NSS & Verified NGOs • Autonomous Escalation Engine
      </div>
    </div>
  );
}
