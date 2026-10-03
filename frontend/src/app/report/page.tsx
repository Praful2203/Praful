'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertOctagon, MapPin, Loader2 } from 'lucide-react';

export default function ReportIncidentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium',
  });
  const [assignmentResult, setAssignmentResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/incidents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          location: { lat: 12.9716, lng: 77.5946 }, // Defaulting to Bengaluru for demo
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to report incident');
      }

      const data = await response.json();
      setAssignmentResult(data);
    } catch (error) {
      console.error(error);
      alert('Error reporting incident. Is the backend running?');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-[#E8E2D2]">
        
        {/* Header */}
        <div className="bg-[#800020] px-6 py-8 text-center text-white">
          <AlertOctagon className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-black tracking-tight">Report Emergency</h2>
          <p className="text-sm opacity-80 mt-2">Our AI Dispatcher will assign the closest responder immediately.</p>
        </div>

        {/* Form */}
        {!assignmentResult ? (
          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
            
            <div>
              <label htmlFor="title" className="block text-sm font-bold text-[#17202A] mb-1">Incident Type</label>
              <input
                type="text"
                id="title"
                required
                className="w-full px-4 py-3 rounded-xl border border-[#E8E2D2] focus:ring-2 focus:ring-[#800020] focus:border-transparent outline-none transition"
                placeholder="e.g. Fire in building, Heart attack"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-bold text-[#17202A] mb-1">Details</label>
              <textarea
                id="description"
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-[#E8E2D2] focus:ring-2 focus:ring-[#800020] focus:border-transparent outline-none transition resize-none"
                placeholder="Provide as much detail as possible..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="severity" className="block text-sm font-bold text-[#17202A] mb-1">Severity</label>
              <select
                id="severity"
                className="w-full px-4 py-3 rounded-xl border border-[#E8E2D2] focus:ring-2 focus:ring-[#800020] focus:border-transparent outline-none transition bg-white"
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
              >
                <option value="low">Low - Non-life threatening</option>
                <option value="medium">Medium - Urgent assistance needed</option>
                <option value="high">High - Severe emergency</option>
                <option value="critical">Critical - Immediate life threat</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-sm text-[#667085] bg-[#F7F3EA] p-3 rounded-lg">
              <MapPin className="w-4 h-4 text-[#800020]" />
              <span>Location will be automatically attached via GPS.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-[#800020] hover:bg-[#660019] shadow-lg hover:shadow-xl transition flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Dispatching...</span>
                </>
              ) : (
                <>
                  <AlertOctagon className="w-5 h-5" />
                  <span>Send Alert</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="px-6 py-10 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <AlertOctagon className="w-8 h-8 text-emerald-600" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-black text-[#17202A]">Responder Assigned!</h3>
              <p className="text-sm text-[#667085]">Help is on the way.</p>
            </div>

            {assignmentResult.assigned_responder_id && (
              <div className="bg-[#F7F3EA] p-4 rounded-xl text-left border border-[#E8E2D2]">
                <h4 className="text-xs font-bold text-[#800020] uppercase tracking-wider mb-2">AI Dispatch Rationale</h4>
                <p className="text-sm text-[#17202A] italic">"{assignmentResult.ai_rationale}"</p>
              </div>
            )}

            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-[#17202A] bg-white border border-[#E8E2D2] shadow-sm hover:bg-gray-50 transition"
            >
              Back to Home
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
