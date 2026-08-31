import type { Alert, Device, Incident, RiskLevel } from './types'

const RISK_WEIGHT: Record<RiskLevel, number> = {
  NORMAL: 5,
  LOW: 22,
  MEDIUM: 55,
  HIGH: 80,
  CRITICAL: 95,
}

export function deriveStats(devices: Device[], alerts: Alert[], incidents: Incident[]) {
  const activeDevices = devices.filter((d) => d.status === 'ONLINE').length
  const totalDevices = devices.length
  const criticalThreats = alerts.filter(
    (a) => a.riskLevel === 'CRITICAL' || a.riskLevel === 'HIGH',
  ).length
  const activeAlerts = alerts.filter((a) => a.status === 'ACTIVE').length

  const avgRisk =
    alerts.length === 0
      ? 0
      : Math.round(
          alerts.reduce((sum, a) => sum + RISK_WEIGHT[a.riskLevel], 0) / alerts.length,
        )

  const distribution: { level: RiskLevel; count: number }[] = (
    ['NORMAL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as RiskLevel[]
  ).map((level) => ({
    level,
    count: alerts.filter((a) => a.riskLevel === level).length,
  }))

  const openIncidents = incidents.filter((i) => i.status !== 'CLOSED').length

  return {
    activeDevices,
    totalDevices,
    criticalThreats,
    activeAlerts,
    avgRisk,
    distribution,
    openIncidents,
    totalAlerts: alerts.length,
  }
}

export function riskLabel(score: number): RiskLevel {
  if (score >= 90) return 'CRITICAL'
  if (score >= 70) return 'HIGH'
  if (score >= 40) return 'MEDIUM'
  if (score >= 15) return 'LOW'
  return 'NORMAL'
}
