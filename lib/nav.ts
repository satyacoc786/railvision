import {
  BellRing,
  ClipboardList,
  Cpu,
  Info,
  LayoutDashboard,
  MapPinned,
  MonitorPlay,
  Network,
  RefreshCw,
  ScanLine,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/monitoring', label: 'Live Monitoring', icon: MonitorPlay },
  { href: '/simulator', label: 'Threat Simulator', icon: ScanLine },
  { href: '/alerts', label: 'Alerts', icon: BellRing },
  { href: '/map', label: 'Railway Map', icon: MapPinned },
  { href: '/incidents', label: 'Incidents', icon: ClipboardList },
  { href: '/devices', label: 'Devices', icon: Cpu },
  { href: '/sync', label: 'Offline Sync', icon: RefreshCw },
  { href: '/architecture', label: 'System Architecture', icon: Network },
  { href: '/about', label: 'About Railvision', icon: Info },
]
