'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Incident, 
  Responder, 
  AgentInfo, 
  NotificationItem, 
  EmergencyType, 
  UserRole,
  ResponseTier
} from '@/types/emergency';
import { INITIAL_INCIDENT, MOCK_RESPONDERS, INITIAL_AGENTS } from '@/lib/mockData';
import { formatTime } from '@/lib/utils';

interface EmergencyContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  incident: Incident;
  responders: Responder[];
  agents: Record<string, AgentInfo>;
  notifications: NotificationItem[];
  isDelaySimulated: boolean;
  tier1TimeoutSimulated: boolean;
  reportEmergency: (data: { type: EmergencyType; description: string; peopleInvolved: number; address: string; location: { lat: number; lng: number } }) => Promise<string>;
  acceptIncidentByResponder: (responderId: string) => void;
  rejectIncidentByResponder: (responderId: string) => void;
  acceptIncidentByNGO: (ngoId: string) => void;
  rejectIncidentByNGO: (ngoId: string) => void;
  simulateTier1Timeout: () => void;
  simulateResponseDelay: () => void;
  markResponderArrived: () => void;
  markAsCompleted: () => void;
  resolveIncident: () => void;
  resetDemo: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationsRead: () => void;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

const ROLE_STORAGE_KEY = 'aura911_user_role';

export function EmergencyProvider({ children }: { children: ReactNode }) {
  // 1. Role State with localStorage Persistence & route auto-sync
  const [currentRole, setCurrentRoleState] = useState<UserRole>('USER');
  const [isHydrated, setIsHydrated] = useState(false);

  const [incident, setIncident] = useState<Incident>(INITIAL_INCIDENT);
  const [responders, setResponders] = useState<Responder[]>(MOCK_RESPONDERS);
  const [agents, setAgents] = useState<Record<string, AgentInfo>>(INITIAL_AGENTS);
  const [isDelaySimulated, setIsDelaySimulated] = useState<boolean>(false);
  const [tier1TimeoutSimulated, setTier1TimeoutSimulated] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'NOTIF-1',
      timestamp: '15:04',
      title: 'Ambulance A En Route',
      message: 'Ambulance A (Alpha-1) accepted the assignment and is navigating to the scene.',
      type: 'INFO',
      read: false,
      targetRole: 'ALL',
      incidentId: 'INC-1042'
    }
  ]);

  // Load persisted role from localStorage on initial mount
  useEffect(() => {
    try {
      const savedRole = localStorage.getItem(ROLE_STORAGE_KEY) as UserRole | null;
      if (savedRole && (savedRole === 'ADMIN' || savedRole === 'USER' || savedRole === 'RESPONDER' || savedRole === 'NGO')) {
        setCurrentRoleState(savedRole);
      } else {
        // If on /responder route, infer RESPONDER, if on /admin route, infer ADMIN
        const path = window.location.pathname;
        if (path.startsWith('/responder')) {
          setCurrentRoleState('RESPONDER');
          localStorage.setItem(ROLE_STORAGE_KEY, 'RESPONDER');
        } else if (path.startsWith('/admin')) {
          setCurrentRoleState('ADMIN');
          localStorage.setItem(ROLE_STORAGE_KEY, 'ADMIN');
        } else {
          setCurrentRoleState('USER');
          localStorage.setItem(ROLE_STORAGE_KEY, 'USER');
        }
      }
    } catch (e) {
      console.error('Storage access error:', e);
    }
    setIsHydrated(true);
  }, []);

  // Update localStorage whenever role changes
  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, role);
    } catch (e) {
      console.error('Storage write error:', e);
    }
  };

  // Smooth realistic marker movement
  useEffect(() => {
    if (incident.status === 'EN_ROUTE' && !isDelaySimulated) {
      const interval = setInterval(() => {
        setResponders((prev) =>
          prev.map((r) => {
            const activeId = incident.assignedResponder?.id || 'AMB-101';
            if (r.id === activeId && r.distanceKm > 0.2) {
              const newDist = Math.max(0.2, Number((r.distanceKm - 0.05).toFixed(2)));
              const target = incident.location;
              const ratio = 0.04;
              return {
                ...r,
                distanceKm: newDist,
                location: {
                  lat: r.location.lat + (target.lat - r.location.lat) * ratio,
                  lng: r.location.lng + (target.lng - r.location.lng) * ratio
                }
              };
            }
            return r;
          })
        );
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [incident.status, isDelaySimulated, incident.location, incident.assignedResponder]);

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `NOTIF-${Date.now()}`,
      timestamp: formatTime(new Date()).slice(0, 5),
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const reportEmergency = async (data: {
    type: EmergencyType;
    description: string;
    peopleInvolved: number;
    address: string;
    location: { lat: number; lng: number };
  }): Promise<string> => {
    
    // Call real backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: data.type,
        description: data.description,
        location: data.location
      }),
    });

    if (!response.ok) throw new Error('Backend failed to create incident');
    const result = await response.json();
    const realIncident = result.incident;
    const realResponderId = realIncident.assigned_responder_id;
    
    const assignedUnit = responders.find(r => r.id === realResponderId) || responders[0];

    const newInc: Incident = {
      ...INITIAL_INCIDENT,
      id: realIncident.id,
      type: data.type,
      description: data.description,
      severity: result.severity,
      peopleInvolved: data.peopleInvolved,
      location: data.location,
      address: data.address,
      reportedAt: formatTime(new Date()).slice(0, 5),
      status: 'ASSIGNED',
      currentTier: 'TIER_1',
      assignedResponder: assignedUnit,
      assignedResponders: [assignedUnit],
      events: [
        {
          id: `EVT-${Date.now()}-1`,
          timestamp: formatTime(new Date()).slice(0, 5),
          timeFormatted: formatTime(new Date()).slice(0, 5),
          title: 'Incident reported',
          description: `Citizen reported: ${data.type}`,
          type: 'INFO'
        },
        {
          id: `EVT-${Date.now()}-2`,
          timestamp: formatTime(new Date()).slice(0, 5),
          timeFormatted: formatTime(new Date()).slice(0, 5),
          title: 'AI classification completed',
          description: `Classified: ${data.type} • ${result.severity} Severity • Rationale: ${result.ai_rationale}`,
          type: 'AGENT_ACTION',
          agent: 'INCIDENT_INTELLIGENCE'
        }
      ]
    };

    setIncident(newInc);
    setIsDelaySimulated(false);
    setTier1TimeoutSimulated(false);

    addNotification({
      title: 'Emergency Ticket Created',
      message: `${realIncident.id} created via Groq AI. Dispatching responders.`,
      type: 'INFO',
      targetRole: 'ALL',
      incidentId: realIncident.id
    });

    return realIncident.id;
  };

  // ACCEPT FLOW (Tier 1 Responder)
  const acceptIncidentByResponder = (responderId: string) => {
    const time = '15:03';
    const responder = responders.find((r) => r.id === responderId) || MOCK_RESPONDERS[0];

    setResponders((prev) =>
      prev.map((r) => (r.id === responderId ? { ...r, status: 'EN_ROUTE', currentIncidentId: 'INC-1042' } : r))
    );

    setIncident((prev) => ({
      ...prev,
      status: 'EN_ROUTE',
      assignedResponder: { ...responder, status: 'EN_ROUTE' },
      assignedResponders: [{ ...responder, status: 'EN_ROUTE' }],
      events: [
        ...prev.events,
        {
          id: `EVT-${Date.now()}`,
          timestamp: time,
          timeFormatted: time,
          title: 'Ambulance accepted',
          description: `${responder.name} accepted the emergency request and is en route`,
          type: 'SUCCESS',
          tier: responder.tier,
          responderId
        }
      ]
    }));

    addNotification({
      title: 'Ambulance Accepted',
      message: `${responder.name} accepted the emergency request. ETA: ${responder.eta}.`,
      type: 'SUCCESS',
      targetRole: 'ALL',
      incidentId: 'INC-1042'
    });
  };

  // REJECT FLOW -> Escalation Agent Searches Tier 2 Verified NGOs / Community Responders
  const triggerEscalationToTier2 = (reason: 'REJECTED' | 'TIMEOUT') => {
    if (tier1TimeoutSimulated) return;
    setTier1TimeoutSimulated(true);

    const time1 = '15:04';

    // Step 1: Flag rejection / timeout
    setIncident((prev) => ({
      ...prev,
      status: 'ESCALATING',
      currentTier: 'TIER_2',
      events: [
        ...prev.events,
        {
          id: `EVT-${Date.now()}-1`,
          timestamp: time1,
          timeFormatted: time1,
          title: reason === 'REJECTED' ? 'Ambulance rejected the request' : 'Response window expired',
          description: reason === 'REJECTED' ? 'Ambulance A rejected the assignment due to local obstruction' : 'No Tier 1 responder accepted within response window',
          type: 'ALERT',
          tier: 'TIER_1'
        },
        {
          id: `EVT-${Date.now()}-2`,
          timestamp: time1,
          timeFormatted: time1,
          title: 'Searching verified NGO/community responders...',
          description: 'Escalation Agent actively querying verified Tier 2 NGO & NSS volunteer network',
          type: 'AGENT_ACTION',
          agent: 'ESCALATION'
        }
      ]
    }));

    setAgents((prev) => ({
      ...prev,
      ESCALATION: {
        ...prev.ESCALATION,
        status: 'ACTIVE',
        currentTask: 'Activating Tier 2 verified NGO network',
        lastAction: 'Searching verified NGO/community responders',
        timestamp: time1
      },
      RESPONDER_DISCOVERY: {
        ...prev.RESPONDER_DISCOVERY,
        currentTask: 'Evaluating NSS Emergency Support – Central Unit (1.8 km)',
        lastAction: 'NGO responder found (12 available volunteers)',
        timestamp: time1
      }
    }));

    addNotification({
      title: 'Ambulance Rejected — Escalating to Tier 2',
      message: 'Searching verified NGO/community responders...',
      type: 'WARNING',
      targetRole: 'ALL',
      incidentId: 'INC-1042'
    });

    // Step 2: NSS NGO assigned and automatically accepted smoothly after 2.2 seconds
    setTimeout(() => {
      const time2 = '15:05';
      const ngoUnit = MOCK_RESPONDERS.find((r) => r.id === 'NGO-501')!;

      // Deduct 1 volunteer from available and add to assigned (12 -> 11 available, 3 -> 4 assigned)
      setResponders((prev) =>
        prev.map((r) => {
          if (r.id === 'NGO-501') {
            return {
              ...r,
              status: 'EN_ROUTE',
              currentIncidentId: 'INC-1042',
              availableVolunteers: 11,
              assignedVolunteers: 4
            };
          }
          return r;
        })
      );

      setIncident((prev) => ({
        ...prev,
        status: 'EN_ROUTE',
        currentTier: 'TIER_2',
        assignedResponder: { ...ngoUnit, status: 'EN_ROUTE', availableVolunteers: 11, assignedVolunteers: 4 },
        assignedResponders: [{ ...ngoUnit, status: 'EN_ROUTE' }],
        estimatedTimeArrival: '05:45',
        events: [
          ...prev.events,
          {
            id: `EVT-${Date.now()}-3`,
            timestamp: time2,
            timeFormatted: time2,
            title: 'NGO responder assigned',
            description: 'NSS Emergency Support – Central Unit assigned to incident',
            type: 'SUCCESS',
            tier: 'TIER_2',
            responderId: 'NGO-501'
          },
          {
            id: `EVT-${Date.now()}-4`,
            timestamp: time2,
            timeFormatted: '15:06',
            title: 'NGO accepted • En route',
            description: 'NSS Emergency Support volunteers en route • ETA 05:45',
            type: 'SUCCESS',
            tier: 'TIER_2',
            responderId: 'NGO-501'
          }
        ]
      }));

      setAgents((prev) => ({
        ...prev,
        ESCALATION: {
          ...prev.ESCALATION,
          status: 'COMPLETE',
          lastAction: 'Tier 2 NSS Support successfully assigned',
          timestamp: time2
        },
        MONITORING: {
          ...prev.MONITORING,
          status: 'MONITORING',
          currentTask: 'Monitoring NSS Emergency Support en route',
          lastAction: 'Speed nominal: 42 km/h',
          timestamp: time2
        }
      }));

      addNotification({
        title: 'NSS NGO Accepted & En Route',
        message: 'NSS Emergency Support accepted INC-1042. ETA: 05:45.',
        type: 'SUCCESS',
        targetRole: 'ALL',
        incidentId: 'INC-1042'
      });
    }, 2200);
  };

  const rejectIncidentByResponder = (responderId: string) => {
    triggerEscalationToTier2('REJECTED');
  };

  const simulateTier1Timeout = () => {
    triggerEscalationToTier2('TIMEOUT');
  };

  const acceptIncidentByNGO = (ngoId: string) => {
    acceptIncidentByResponder(ngoId);
  };

  const rejectIncidentByNGO = (ngoId: string) => {
    const time = '15:06';
    const redCross = MOCK_RESPONDERS.find((r) => r.id === 'NGO-502')!;

    setIncident((prev) => ({
      ...prev,
      assignedResponder: { ...redCross, status: 'EN_ROUTE' },
      events: [
        ...prev.events,
        {
          id: `EVT-${Date.now()}`,
          timestamp: time,
          timeFormatted: time,
          title: 'Red Cross First Aid Unit assigned',
          description: 'Alternative Tier 2 NGO dispatched • ETA 06:30',
          type: 'SUCCESS',
          tier: 'TIER_2',
          responderId: 'NGO-502'
        }
      ]
    }));
  };

  // Response Delay Scenario
  const simulateResponseDelay = () => {
    if (isDelaySimulated) return;
    setIsDelaySimulated(true);

    const time1 = '15:05';

    setResponders((prev) =>
      prev.map((r) => (r.id === 'AMB-101' ? { ...r, status: 'DELAYED', speedKmh: 0 } : r))
    );

    setIncident((prev) => ({
      ...prev,
      status: 'DELAY_DETECTED',
      delayReason: 'Responder movement stopped unexpectedly on MG Road (0 km/h for >120s)',
      updatedTimeArrival: '12:45',
      events: [
        ...prev.events,
        {
          id: `EVT-${Date.now()}-1`,
          timestamp: time1,
          timeFormatted: time1,
          title: 'Response delay detected',
          description: 'Monitoring Agent detected abnormal vehicle stoppage on MG Road',
          type: 'ALERT',
          agent: 'MONITORING',
          responderId: 'AMB-101'
        },
        {
          id: `EVT-${Date.now()}-2`,
          timestamp: time1,
          timeFormatted: time1,
          title: 'Replanning Agent activated',
          description: 'Searching available Tier 1 and Tier 2 alternatives',
          type: 'AGENT_ACTION',
          agent: 'REPLANNING'
        }
      ]
    }));

    setAgents((prev) => ({
      ...prev,
      MONITORING: {
        ...prev.MONITORING,
        status: 'ESCALATED',
        lastAction: 'Movement anomaly detected on primary unit',
        timestamp: time1
      },
      REPLANNING: {
        ...prev.REPLANNING,
        status: 'ACTIVE',
        currentTask: 'Evaluating Ambulance B (3.4 km, ETA 06:10)',
        lastAction: 'Alternative response plan formulated',
        timestamp: time1
      }
    }));

    addNotification({
      title: 'Response Delay Detected',
      message: 'Ambulance A delayed. Replanning Agent selecting alternative.',
      type: 'WARNING',
      targetRole: 'ADMIN',
      incidentId: 'INC-1042'
    });

    // Reassign smoothly
    setTimeout(() => {
      const time2 = '15:06';
      const ambB = MOCK_RESPONDERS.find((r) => r.id === 'AMB-102')!;

      setResponders((prev) =>
        prev.map((r) => {
          if (r.id === 'AMB-102') return { ...r, status: 'EN_ROUTE', currentIncidentId: 'INC-1042' };
          if (r.id === 'AMB-101') return { ...r, status: 'DELAYED' };
          return r;
        })
      );

      setIncident((prev) => ({
        ...prev,
        status: 'EN_ROUTE',
        assignedResponder: { ...ambB, status: 'EN_ROUTE' },
        assignedResponders: [{ ...ambB, status: 'EN_ROUTE' }],
        estimatedTimeArrival: '06:10',
        events: [
          ...prev.events,
          {
            id: `EVT-${Date.now()}-3`,
            timestamp: time2,
            timeFormatted: time2,
            title: 'Ambulance B assigned as new responder',
            description: 'Autonomous reassignment confirmed • ETA 06:10 via Bypass',
            type: 'SUCCESS',
            tier: 'TIER_1',
            responderId: 'AMB-102'
          }
        ]
      }));

      setAgents((prev) => ({
        ...prev,
        REPLANNING: {
          ...prev.REPLANNING,
          status: 'COMPLETE',
          lastAction: 'Ambulance B reassigned smoothly in 3.8s',
          timestamp: time2
        }
      }));

      addNotification({
        title: 'New Responder Assigned',
        message: 'Ambulance B (Bravo-2) is now navigating to INC-1042. ETA: 06:10.',
        type: 'SUCCESS',
        targetRole: 'ALL',
        incidentId: 'INC-1042'
      });
    }, 3000);
  };

  const markResponderArrived = () => {
    const time = '15:10';
    setIncident((prev) => ({
      ...prev,
      status: 'ARRIVED',
      estimatedTimeArrival: '00:00',
      events: [
        ...prev.events,
        {
          id: `EVT-${Date.now()}`,
          timestamp: time,
          timeFormatted: time,
          title: 'Responder arrived at scene',
          description: 'Emergency team on-site. Immediate medical triage initiated.',
          type: 'SUCCESS'
        }
      ]
    }));

    addNotification({
      title: 'Responder Arrived on Scene',
      message: 'Responder has reached the incident location.',
      type: 'SUCCESS',
      targetRole: 'ALL',
      incidentId: 'INC-1042'
    });
  };

  // STEP 13: COMPLETION FLOW & AUTOMATIC RESPONDER RELEASE (11 -> 12 Available)
  const markAsCompleted = () => {
    const time = '15:18';

    setIncident((prev) => ({
      ...prev,
      status: 'RESOLVED',
      events: [
        ...prev.events,
        {
          id: `EVT-${Date.now()}`,
          timestamp: time,
          timeFormatted: time,
          title: 'Incident completed & resolved',
          description: 'Response completed. Patients safely stabilized and transferred. Responder released back to network.',
          type: 'SUCCESS'
        }
      ]
    }));

    // Auto release responder & restore volunteer counts (e.g., NSS 11 -> 12 available, 4 -> 3 assigned)
    setResponders((prev) =>
      prev.map((r) => {
        if (r.id === 'NGO-501') {
          return {
            ...r,
            status: 'AVAILABLE',
            currentIncidentId: null,
            availableVolunteers: 12,
            assignedVolunteers: 3
          };
        }
        if (r.currentIncidentId === 'INC-1042' || r.status === 'EN_ROUTE' || r.status === 'ARRIVED') {
          return { ...r, status: 'AVAILABLE', currentIncidentId: null };
        }
        return r;
      })
    );

    addNotification({
      title: 'Incident Completed — Responder Released',
      message: 'INC-1042 marked as completed. Responder is now AVAILABLE for new assignments.',
      type: 'SUCCESS',
      targetRole: 'ALL',
      incidentId: 'INC-1042'
    });
  };

  const resolveIncident = () => {
    markAsCompleted();
  };

  const resetDemo = () => {
    setIncident(INITIAL_INCIDENT);
    setResponders(MOCK_RESPONDERS);
    setAgents(INITIAL_AGENTS);
    setIsDelaySimulated(false);
    setTier1TimeoutSimulated(false);
    addNotification({
      title: 'Demo Environment Reset',
      message: 'Simulation state restored to baseline.',
      type: 'INFO',
      targetRole: 'ADMIN'
    });
  };

  return (
    <EmergencyContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        incident,
        responders,
        agents,
        notifications,
        isDelaySimulated,
        tier1TimeoutSimulated,
        reportEmergency,
        acceptIncidentByResponder,
        rejectIncidentByResponder,
        acceptIncidentByNGO,
        rejectIncidentByNGO,
        simulateTier1Timeout,
        simulateResponseDelay,
        markResponderArrived,
        markAsCompleted,
        resolveIncident,
        resetDemo,
        addNotification,
        markNotificationsRead
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
}

export function useEmergency() {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
}
