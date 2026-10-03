export type UserRole = 'ADMIN' | 'USER' | 'RESPONDER' | 'NGO';

export type EmergencyType = 'ACCIDENT' | 'MEDICAL' | 'FIRE' | 'SAFETY' | 'ROAD_HAZARD' | 'OTHER';
export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IncidentPriority = 'P1' | 'P2' | 'P3' | 'P4';
export type ResponseTier = 'TIER_1' | 'TIER_2';

export type IncidentStatus = 
  | 'REPORTED'
  | 'REPORTING'
  | 'ANALYZING'
  | 'TIER_1_SEARCH'
  | 'SEARCHING_TIER_1'
  | 'TIER_1_ASSIGNED'
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'EN_ROUTE'
  | 'ARRIVED'
  | 'COMPLETED'
  | 'REJECTED'
  | 'TIER_1_TIMEOUT'
  | 'ESCALATING'
  | 'TIER_2_SEARCH'
  | 'SEARCHING_TIER_2'
  | 'TIER_2_ASSIGNED'
  | 'NGO_ASSIGNED'
  | 'NGO_ACCEPTED'
  | 'DELAY_DETECTED'
  | 'REPLANNING'
  | 'REASSIGNED'
  | 'RESOLVED';

export type ResponderType = 'AMBULANCE' | 'POLICE' | 'FIRE' | 'NGO' | 'COMMUNITY';
export type ResponderStatus = 'AVAILABLE' | 'ASSIGNED' | 'EN_ROUTE' | 'ARRIVED' | 'COMPLETED' | 'DELAYED' | 'OFFLINE';

export type AgentType = 
  | 'SUPERVISOR'
  | 'INCIDENT_INTELLIGENCE'
  | 'RESPONDER_DISCOVERY'
  | 'RESPONSE_PLANNER'
  | 'COMMUNICATION'
  | 'MONITORING'
  | 'ESCALATION'
  | 'REPLANNING';

export type AgentStatus = 'STANDBY' | 'ANALYZING' | 'ACTIVE' | 'MONITORING' | 'COMPLETE' | 'ESCALATED';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Responder {
  id: string;
  name: string;
  tier: ResponseTier;
  type: ResponderType;
  status: ResponderStatus;
  location: Coordinates;
  address: string;
  eta: string;
  distanceKm: number;
  speedKmh?: number;
  phone?: string;
  plateNumber?: string;
  organization?: string;
  availableVolunteers?: number;
  assignedVolunteers?: number;
  currentIncidentId?: string | null;
  capabilities: string[];
}

export interface IncidentEvent {
  id: string;
  timestamp: string;
  timeFormatted: string;
  title: string;
  description: string;
  type: 'INFO' | 'WARNING' | 'ALERT' | 'SUCCESS' | 'AGENT_ACTION';
  tier?: ResponseTier;
  agent?: AgentType;
  responderId?: string;
}

export interface AgentInfo {
  id: AgentType;
  name: string;
  role: string;
  status: AgentStatus;
  currentTask: string;
  lastAction: string;
  timestamp: string;
  toolsUsed: string[];
  confidence?: number;
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  type: 'CRITICAL' | 'WARNING' | 'SUCCESS' | 'INFO';
  read: boolean;
  targetRole: 'ALL' | 'USER' | 'RESPONDER' | 'ADMIN' | 'NGO';
  incidentId?: string;
}

export interface Incident {
  id: string;
  type: EmergencyType;
  severity: IncidentSeverity;
  priority: IncidentPriority;
  status: IncidentStatus;
  currentTier: ResponseTier;
  description: string;
  peopleInvolved: number;
  location: Coordinates;
  address: string;
  landmark: string;
  reportedAt: string;
  reportedBy: string;
  confidenceScore: number;
  assignedResponder?: Responder;
  assignedResponders: Responder[];
  backupResponders: Responder[];
  events: IncidentEvent[];
  agentStates: Record<AgentType, AgentInfo>;
  routeCoordinates: Coordinates[];
  estimatedTimeArrival: string;
  updatedTimeArrival?: string;
  delayReason?: string;
  isDelaySimulated?: boolean;
}
