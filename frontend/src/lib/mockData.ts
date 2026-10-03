import { Incident, Responder, AgentInfo } from '@/types/emergency';

export const INITIAL_CITY_CENTER = { lat: 12.9716, lng: 77.5946 };

export const MOCK_RESPONDERS: Responder[] = [
  // TIER 1: Primary Emergency Units (Ambulance, Police, Municipal Corporation, Fire)
  {
    id: 'AMB-101',
    name: 'Ambulance A (Alpha-1)',
    tier: 'TIER_1',
    type: 'AMBULANCE',
    status: 'AVAILABLE',
    location: { lat: 12.9785, lng: 77.5852 },
    address: 'Central Emergency Base, MG Road',
    eta: '04:20',
    distanceKm: 2.1,
    speedKmh: 46,
    plateNumber: 'KA-01-EA-9912',
    organization: 'City Emergency Medical Service (Tier 1)',
    capabilities: ['Advanced Life Support (ALS)', 'Ventilator', 'Paramedic Team']
  },
  {
    id: 'CORP-301',
    name: 'Municipal Corporation Clearance Unit 3',
    tier: 'TIER_1',
    type: 'COMMUNITY',
    status: 'AVAILABLE',
    location: { lat: 12.9760, lng: 77.5880 },
    address: 'BBMP Central Rapid Road Maintenance Depot',
    eta: '05:10',
    distanceKm: 1.9,
    speedKmh: 38,
    plateNumber: 'KA-01-MG-4412',
    organization: 'City Municipal Corporation Road Works (Tier 1)',
    capabilities: ['Hydraulic Crane', 'Obstruction Removal Crew', 'Debris Clearing Equipment', 'Traffic Cone Cordon']
  },
  {
    id: 'AMB-102',
    name: 'Ambulance B (Bravo-2)',
    tier: 'TIER_1',
    type: 'AMBULANCE',
    status: 'AVAILABLE',
    location: { lat: 12.9645, lng: 77.6120 },
    address: 'Indiranagar Medical Station',
    eta: '06:10',
    distanceKm: 3.4,
    speedKmh: 50,
    plateNumber: 'KA-01-EA-8841',
    organization: 'City Emergency Medical Service (Tier 1)',
    capabilities: ['Basic Life Support (BLS)', 'Oxygen Rig']
  },
  {
    id: 'POL-201',
    name: 'Police Patrol Unit 4',
    tier: 'TIER_1',
    type: 'POLICE',
    status: 'AVAILABLE',
    location: { lat: 12.9740, lng: 77.5990 },
    address: 'Sector 4 Police Post',
    eta: '03:40',
    distanceKm: 1.8,
    speedKmh: 48,
    plateNumber: 'KA-01-P-3301',
    organization: 'City Police Service (Tier 1)',
    capabilities: ['Traffic Diversion', 'Scene Security']
  },

  // TIER 2: Verified Local NGO & Community Volunteer Units (NSS, Red Cross, etc.)
  {
    id: 'NGO-501',
    name: 'NSS Emergency Support – Central Unit',
    tier: 'TIER_2',
    type: 'NGO',
    status: 'AVAILABLE',
    location: { lat: 12.9730, lng: 77.5910 },
    address: 'NSS Community Volunteer Center',
    eta: '05:45',
    distanceKm: 1.8,
    speedKmh: 42,
    plateNumber: 'KA-04-NSS-101',
    organization: 'NSS Emergency Support (Tier 2 NGO)',
    availableVolunteers: 12,
    assignedVolunteers: 3,
    capabilities: ['Trauma Triage', 'AED Certified', 'Volunteer Stretcher Team']
  },
  {
    id: 'NGO-502',
    name: 'Red Cross First Aid Mobile Unit',
    tier: 'TIER_2',
    type: 'NGO',
    status: 'AVAILABLE',
    location: { lat: 12.9680, lng: 77.6010 },
    address: 'Red Cross Community Post, Residency Road',
    eta: '06:30',
    distanceKm: 2.8,
    plateNumber: 'KA-04-RC-201',
    organization: 'Indian Red Cross Society (Tier 2 NGO)',
    availableVolunteers: 8,
    assignedVolunteers: 2,
    capabilities: ['First Aid Post', 'Trained Paramedic Volunteers']
  },
  {
    id: 'NGO-503',
    name: 'St. John Ambulance Community Brigade',
    tier: 'TIER_2',
    type: 'NGO',
    status: 'AVAILABLE',
    location: { lat: 12.9800, lng: 77.6050 },
    address: 'St. John Volunteer Outpost, Ulsoor',
    eta: '07:15',
    distanceKm: 3.2,
    organization: 'St. John Community Brigade (Tier 2)',
    availableVolunteers: 6,
    assignedVolunteers: 1,
    capabilities: ['CPR Certified Volunteers', 'First Response Kit']
  }
];

export const INITIAL_AGENTS: Record<string, AgentInfo> = {
  SUPERVISOR: {
    id: 'SUPERVISOR',
    name: 'Supervisor Agent',
    role: 'Coordinates multi-agent workflow & response governance',
    status: 'ACTIVE',
    currentTask: 'Supervising Tier 1 and Tier 2 response lifecycle',
    lastAction: 'Delegated priority assessment to Incident Intelligence',
    timestamp: '15:02',
    toolsUsed: ['Workflow Engine', 'State Synchronizer']
  },
  INCIDENT_INTELLIGENCE: {
    id: 'INCIDENT_INTELLIGENCE',
    name: 'Incident Intelligence Agent',
    role: 'Understands citizen report & classifies severity',
    status: 'COMPLETE',
    currentTask: 'Classified: Accident (High Severity / P1)',
    lastAction: 'Computed 91% confidence score',
    timestamp: '15:02',
    toolsUsed: ['NLP Triage', 'Severity Matrix'],
    confidence: 91
  },
  RESPONDER_DISCOVERY: {
    id: 'RESPONDER_DISCOVERY',
    name: 'Responder Discovery Agent',
    role: 'Searches Tier 1 primary and Tier 2 NGO units',
    status: 'COMPLETE',
    currentTask: 'Tier 1 primary units evaluated',
    lastAction: 'Identified nearest available emergency clearance unit',
    timestamp: '15:03',
    toolsUsed: ['Spatial KD-Tree', 'Availability Index']
  },
  RESPONSE_PLANNER: {
    id: 'RESPONSE_PLANNER',
    name: 'Response Planner Agent',
    role: 'Formulates primary and backup response corridor',
    status: 'COMPLETE',
    currentTask: 'Primary corridor calculated for responder',
    lastAction: 'Dispatched emergency unit with Tier 2 NSS standby',
    timestamp: '15:03',
    toolsUsed: ['Route Optimizer', 'Triage Match']
  },
  COMMUNICATION: {
    id: 'COMMUNICATION',
    name: 'Communication Agent',
    role: 'Sends clean notifications to User, Responder & Admin',
    status: 'ACTIVE',
    currentTask: 'Live status synced with citizen tracking view',
    lastAction: 'Dispatch notification delivered to assigned unit',
    timestamp: '15:04',
    toolsUsed: ['Notification Stream', 'Telemetry Broadcaster']
  },
  MONITORING: {
    id: 'MONITORING',
    name: 'Monitoring Agent',
    role: 'Monitors velocity, response timeouts & SLA milestones',
    status: 'MONITORING',
    currentTask: 'Monitoring assigned unit en route',
    lastAction: 'Speed verified: 46 km/h nominal along corridor',
    timestamp: '15:04',
    toolsUsed: ['GPS Velocity Tracker', 'Timeout Detector']
  },
  ESCALATION: {
    id: 'ESCALATION',
    name: 'Escalation Agent',
    role: 'Activates Tier 2 NGO response if Tier 1 times out or delays',
    status: 'STANDBY',
    currentTask: 'Standby - monitoring Tier 1 response SLA window',
    lastAction: 'Tier 2 NSS Support primed for immediate failover',
    timestamp: '15:02',
    toolsUsed: ['Tier 2 NGO Evaluator', 'Auto-Escalation Engine']
  },
  REPLANNING: {
    id: 'REPLANNING',
    name: 'Replanning Agent',
    role: 'Finds alternative routes and units upon obstacle detection',
    status: 'STANDBY',
    currentTask: 'Standby - watching traffic choke points',
    lastAction: 'Backup corridor calculated via Expressway Bypass',
    timestamp: '15:02',
    toolsUsed: ['Dynamic Rerouter', 'Alternative Unit Matcher']
  }
};

export const INITIAL_INCIDENT: Incident = {
  id: 'INC-1042',
  type: 'ACCIDENT',
  severity: 'HIGH',
  priority: 'P1',
  status: 'EN_ROUTE',
  currentTier: 'TIER_1',
  description: 'Two-wheeler accident near the main gate. 2 people involved with visible head trauma.',
  peopleInvolved: 2,
  location: { lat: 12.9716, lng: 77.5946 },
  address: 'Main Gate Corridor, Central Avenue, Tech Zone, Bengaluru',
  landmark: 'Opposite Innovation Gate 2',
  reportedAt: '15:02',
  reportedBy: 'Citizen GPS Direct',
  confidenceScore: 91,
  assignedResponder: MOCK_RESPONDERS[0], // Ambulance A (Alpha-1)
  assignedResponders: [MOCK_RESPONDERS[0]],
  backupResponders: [MOCK_RESPONDERS[4]], // NSS Support NGO
  routeCoordinates: [
    { lat: 12.9785, lng: 77.5852 },
    { lat: 12.9765, lng: 77.5880 },
    { lat: 12.9740, lng: 77.5915 },
    { lat: 12.9716, lng: 77.5946 }
  ],
  estimatedTimeArrival: '04:20',
  events: [
    {
      id: 'EVT-1',
      timestamp: '15:02',
      timeFormatted: '15:02',
      title: 'Incident reported',
      description: 'Emergency reported by citizen near Main Gate',
      type: 'INFO'
    },
    {
      id: 'EVT-2',
      timestamp: '15:02',
      timeFormatted: '15:02',
      title: 'AI classification completed',
      description: 'Emergency classified • High Priority (P1) • 91% confidence',
      type: 'AGENT_ACTION',
      agent: 'INCIDENT_INTELLIGENCE'
    },
    {
      id: 'EVT-3',
      timestamp: '15:03',
      timeFormatted: '15:03',
      title: 'Primary responder requested',
      description: 'Emergency response unit selected and alerted',
      type: 'INFO',
      tier: 'TIER_1',
      responderId: 'AMB-101'
    },
    {
      id: 'EVT-4',
      timestamp: '15:03',
      timeFormatted: '15:03',
      title: 'Responder accepted',
      description: 'Tier 1 response unit acknowledged assignment',
      type: 'SUCCESS',
      tier: 'TIER_1',
      responderId: 'AMB-101'
    },
    {
      id: 'EVT-5',
      timestamp: '15:04',
      timeFormatted: '15:04',
      title: 'Responder en route',
      description: 'Navigating to incident location • ETA 04:20',
      type: 'SUCCESS',
      tier: 'TIER_1',
      responderId: 'AMB-101'
    }
  ],
  agentStates: INITIAL_AGENTS as any
};
