import type { Alert, Device, Incident, RailwayLocation, RiskLevel } from './types'

export const RAILWAY_LOCATIONS: RailwayLocation[] = [
  { name: 'Station Entry', x: 12, y: 24, kind: 'station' },
  { name: 'Platform 1', x: 34, y: 16, kind: 'platform' },
  { name: 'Platform 2', x: 34, y: 34, kind: 'platform' },
  { name: 'Platform 3', x: 58, y: 20, kind: 'platform' },
  { name: 'Platform 4', x: 58, y: 40, kind: 'platform' },
  { name: 'Coach B4', x: 76, y: 30, kind: 'coach' },
  { name: 'Parcel Area', x: 22, y: 62, kind: 'parcel' },
  { name: 'Railway Yard', x: 50, y: 74, kind: 'yard' },
  { name: 'Tunnel Entrance', x: 82, y: 66, kind: 'tunnel' },
]

export const LOCATION_NAMES = RAILWAY_LOCATIONS.map((l) => l.name)

export const SCENARIOS = [
  {
    id: 'normal',
    label: 'Normal Situation',
    classification: 'Normal Activity',
    risk: 'NORMAL' as RiskLevel,
    baseScore: 8,
    description: 'Routine patrol data with no anomalies detected.',
  },
  {
    id: 'suspicious',
    label: 'Suspicious Object',
    classification: 'Suspicious Object Detected',
    risk: 'MEDIUM' as RiskLevel,
    baseScore: 58,
    description: 'Unattended object identified in a monitored zone.',
  },
  {
    id: 'narcotics',
    label: 'Possible Narcotics-Related Alert',
    classification: 'Possible Narcotics-Related Event',
    risk: 'HIGH' as RiskLevel,
    baseScore: 84,
    description: 'Simulated sensor pattern flagged for field verification.',
  },
  {
    id: 'explosive',
    label: 'Possible Explosive-Related Alert',
    classification: 'Possible Explosive-Related Event',
    risk: 'CRITICAL' as RiskLevel,
    baseScore: 93,
    description: 'Simulated high-priority pattern requiring immediate review.',
  },
  {
    id: 'comm-failure',
    label: 'Device Communication Failure',
    classification: 'Device Communication Failure',
    risk: 'LOW' as RiskLevel,
    baseScore: 22,
    description: 'Field device lost link with the control room.',
  },
  {
    id: 'intrusion',
    label: 'Restricted Area Intrusion',
    classification: 'Restricted Area Intrusion',
    risk: 'HIGH' as RiskLevel,
    baseScore: 79,
    description: 'Movement detected inside a restricted railway zone.',
  },
]

export const INITIAL_DEVICES: Device[] = [
  { id: 'QD-01', type: 'Quadruped', status: 'ONLINE', location: 'Railway Yard', battery: 78, lastUpdated: '2 min ago', activity: 'Patrolling' },
  { id: 'QD-02', type: 'Quadruped', status: 'ONLINE', location: 'Platform 3', battery: 65, lastUpdated: '1 min ago', activity: 'Under-coach inspection' },
  { id: 'QD-03', type: 'Quadruped', status: 'ONLINE', location: 'Tunnel Entrance', battery: 54, lastUpdated: '4 min ago', activity: 'Tunnel sweep' },
  { id: 'QD-04', type: 'Quadruped', status: 'OFFLINE', location: 'Parcel Area', battery: 12, lastUpdated: '38 min ago', activity: 'Charging' },
  { id: 'HH-01', type: 'Handheld', status: 'ONLINE', location: 'Station Entry', battery: 90, lastUpdated: 'Just now', activity: 'Field screening' },
  { id: 'HH-02', type: 'Handheld', status: 'OFFLINE', location: 'Platform 2', battery: 41, lastUpdated: '22 min ago', activity: 'Last known position' },
  { id: 'HH-03', type: 'Handheld', status: 'ONLINE', location: 'Parcel Area', battery: 73, lastUpdated: '3 min ago', activity: 'Parcel screening' },
  { id: 'HH-04', type: 'Handheld', status: 'ONLINE', location: 'Platform 4', battery: 68, lastUpdated: '1 min ago', activity: 'Field screening' },
]

export const INITIAL_ALERTS: Alert[] = [
  { id: 'RV-2026-001', type: 'Suspicious Security Event', riskLevel: 'HIGH', deviceId: 'HH-03', location: 'Parcel Area', timestamp: '10:47:12', status: 'UNDER REVIEW', confidence: 87 },
  { id: 'RV-2026-002', type: 'Suspicious Object Detected', riskLevel: 'MEDIUM', deviceId: 'QD-02', location: 'Coach B4', timestamp: '10:41:03', status: 'ACTIVE', confidence: 62 },
  { id: 'RV-2026-003', type: 'Routine Screening', riskLevel: 'LOW', deviceId: 'HH-01', location: 'Platform 2', timestamp: '10:32:44', status: 'ACKNOWLEDGED', confidence: 24 },
  { id: 'RV-2026-004', type: 'Restricted Area Intrusion', riskLevel: 'HIGH', deviceId: 'QD-03', location: 'Tunnel Entrance', timestamp: '09:58:19', status: 'INVESTIGATING', confidence: 81 },
  { id: 'RV-2026-005', type: 'Device Communication Failure', riskLevel: 'LOW', deviceId: 'HH-02', location: 'Platform 2', timestamp: '09:36:50', status: 'RESOLVED', confidence: 18 },
]

export const INITIAL_INCIDENTS: Incident[] = [
  { id: 'RV-001', location: 'Platform 2', device: 'HH-01', classification: 'Suspicious Event', riskLevel: 'LOW', timestamp: '10:15:02', status: 'OPEN', confidence: 31 },
  { id: 'RV-002', location: 'Coach B4', device: 'QD-02', classification: 'Security Alert', riskLevel: 'HIGH', timestamp: '10:42:33', status: 'INVESTIGATING', confidence: 79 },
  { id: 'RV-003', location: 'Parcel Area', device: 'HH-03', classification: 'Normal Activity', riskLevel: 'LOW', timestamp: '11:05:41', status: 'CLOSED', confidence: 12 },
  { id: 'RV-004', location: 'Tunnel Entrance', device: 'QD-03', classification: 'Restricted Area Intrusion', riskLevel: 'HIGH', timestamp: '09:58:19', status: 'INVESTIGATING', confidence: 81 },
  { id: 'RV-005', location: 'Railway Yard', device: 'QD-01', classification: 'Normal Activity', riskLevel: 'NORMAL', timestamp: '08:20:11', status: 'CLOSED', confidence: 6 },
  { id: 'RV-006', location: 'Platform 3', device: 'QD-02', classification: 'Suspicious Object Detected', riskLevel: 'MEDIUM', timestamp: '11:22:07', status: 'OPEN', confidence: 58 },
]
