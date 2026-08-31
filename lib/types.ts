export type RiskLevel = 'NORMAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type DeviceType = 'Quadruped' | 'Handheld'
export type DeviceStatus = 'ONLINE' | 'OFFLINE'

export type AlertStatus =
  | 'ACTIVE'
  | 'ACKNOWLEDGED'
  | 'UNDER REVIEW'
  | 'INVESTIGATING'
  | 'RESOLVED'

export type IncidentStatus = 'OPEN' | 'INVESTIGATING' | 'CLOSED'

export interface Device {
  id: string
  type: DeviceType
  status: DeviceStatus
  location: string
  battery: number
  lastUpdated: string
  activity: string
}

export interface Alert {
  id: string
  type: string
  riskLevel: RiskLevel
  deviceId: string
  location: string
  timestamp: string
  status: AlertStatus
  confidence: number
}

export interface Incident {
  id: string
  location: string
  device: string
  classification: string
  riskLevel: RiskLevel
  timestamp: string
  status: IncidentStatus
  confidence: number
}

export interface RailwayLocation {
  name: string
  /** schematic map coordinates as percentages 0-100 */
  x: number
  y: number
  kind: 'station' | 'platform' | 'coach' | 'parcel' | 'yard' | 'tunnel'
}
