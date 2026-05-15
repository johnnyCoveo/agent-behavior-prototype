import { useState, type ComponentType } from 'react'
import {
  IconBrain,
  IconBuilding,
  IconChartBar,
  IconChevronDown,
  IconChevronRight,
  IconDatabase,
  IconGridDots,
  IconHelpCircle,
  IconHome,
  IconMessages,
  IconRocket,
  IconSearch,
  IconShoppingCart,
} from '@tabler/icons-react'

import adminConsoleLogo from '@/assets/admin-console-logo.svg'
import { cn } from '@/lib/utils'

export type NavChild = {
  label: string
  active?: boolean
  badge?: string
  icon?: ComponentType<{ className?: string }>
}

export type NavSection = {
  label: string
  icon: ComponentType<{ className?: string }>
  defaultExpanded?: boolean
  children?: NavChild[]
  active?: boolean
}

export const defaultQuickLinks: NavChild[] = [
  { label: 'First Steps', icon: IconRocket },
  { label: 'Home', icon: IconHome },
]

export const defaultSections: NavSection[] = [
  {
    label: 'Content',
    icon: IconDatabase,
    defaultExpanded: false,
    children: [
      { label: 'Sources' },
      { label: 'Log Browser' },
      { label: 'Fields' },
      { label: 'Content Browser' },
      { label: 'Extensions' },
      { label: 'Security Identities' },
      { label: 'Crawling Modules' },
    ],
  },
  {
    label: 'Commerce',
    icon: IconShoppingCart,
    defaultExpanded: false,
    children: [{ label: 'Catalogs' }, { label: 'Storefront Associations' }],
  },
  {
    label: 'Service',
    icon: IconMessages,
    defaultExpanded: false,
    children: [{ label: 'Case Assist' }, { label: 'Insight Panel' }],
  },
  {
    label: 'Search',
    icon: IconSearch,
    defaultExpanded: false,
    children: [
      { label: 'Query Pipelines' },
      { label: 'Conditions' },
      { label: 'Relevance Inspector' },
      { label: 'Search Pages' },
      { label: 'In-Product Experience' },
    ],
  },
  {
    label: 'AI & ML',
    icon: IconBrain,
    defaultExpanded: true,
    active: true,
    children: [
      { label: 'Models' },
      { label: 'MCP Server' },
      { label: 'Agents', active: true, badge: 'Beta' },
    ],
  },
  {
    label: 'Analytics',
    icon: IconChartBar,
    defaultExpanded: false,
    children: [
      { label: 'Reports' },
      { label: 'Data Health' },
      { label: 'Advanced Reports' },
      { label: 'Visit Browser' },
      { label: 'Raw Data' },
      { label: 'Dimensions' },
      { label: 'Properties', badge: 'Beta' },
      { label: 'Named Filters' },
      { label: 'Permission Filters' },
    ],
  },
  {
    label: 'Organization',
    icon: IconBuilding,
    defaultExpanded: false,
    children: [
      { label: 'Projects' },
      { label: 'Settings' },
      { label: 'License & Usage', badge: 'Beta' },
      { label: 'Groups' },
      { label: 'Members' },
      { label: 'Temporary Access' },
      { label: 'API Keys' },
      { label: 'Activity Browser' },
      { label: 'System Performance' },
      { label: 'Notifications' },
      { label: 'Resource Snapshots' },
    ],
  },
  {
    label: 'Coveo Only',
    icon: IconHelpCircle,
    defaultExpanded: false,
    children: [
      { label: 'Cluster' },
      { label: 'Indexes' },
      { label: 'Organizations' },
      { label: 'Global Groups' },
    ],
  },
]

function SidebarLeaf({
  label,
  icon: Icon,
}: {
  label: string
  icon?: ComponentType<{ className?: string }>
}) {
  return (
    <button
      type="button"
      className="flex h-10 w-full items-center gap-3 rounded-[8px] px-2 py-3 text-left text-[14px] font-medium leading-4 text-white transition hover:bg-white/5"
    >
      {Icon ? <Icon className="size-5 text-white/40" /> : null}
      <span className="opacity-90">{label}</span>
    </button>
  )
}

function SidebarSection({
  section,
  expanded,
  onToggle,
}: {
  section: NavSection
  expanded: boolean
  onToggle: () => void
}) {
  const Icon = section.icon

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'flex h-10 w-full items-center gap-3 rounded-[8px] px-2 py-3 text-left text-[14px] font-medium leading-4 transition',
          section.active
            ? 'text-white'
            : 'text-white/90 hover:bg-white/5',
        )}
      >
        <Icon className={cn('size-5', section.active ? 'text-white/40' : 'text-white/40')} />
        <span className="flex-1">{section.label}</span>
        {section.children?.length ? (
          expanded ? (
            <IconChevronDown className="size-4 text-white/55" />
          ) : (
            <IconChevronRight className="size-4 text-white/55" />
          )
        ) : null}
      </button>

      {expanded && section.children?.length ? (
        <div className="ml-4 pl-4">
          <div className="space-y-1 py-1">
            {section.children.map((child) => (
              <button
                key={child.label}
                type="button"
                className={cn(
                  'flex h-8 w-full items-center justify-between rounded-[8px] px-2 py-2 text-left text-[14px] font-medium leading-4 transition',
                  child.active
                    ? 'bg-[rgba(7,123,107,0.4)] text-[#1CEBCF]'
                    : 'text-white/72 hover:bg-white/5 hover:text-white/92',
                )}
              >
                <span>{child.label}</span>
                {child.badge ? (
                  <span className="rounded-full border border-white/12 bg-white/10 px-2.5 py-0.5 text-[12px] font-normal leading-4 text-white">
                    {child.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function AppSidebar({
  quickLinks = defaultQuickLinks,
  sections = defaultSections,
  logoSrc = adminConsoleLogo,
  logoAlt = 'Admin Console logo',
}: {
  quickLinks?: NavChild[]
  sections?: NavSection[]
  logoSrc?: string
  logoAlt?: string
}) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        sections.map((section) => [section.label, Boolean(section.defaultExpanded)]),
      ),
  )

  return (
    <aside
      className="sticky top-0 flex h-screen w-[15rem] flex-col items-start gap-2 overflow-hidden bg-[#180037] pb-6 text-white"
      style={{
        background:
          'radial-gradient(180% 60% at 8% -12%, #18d4bb 0%, transparent 40%), #180037',
      }}
    >
      <div className="flex min-h-[60px] w-full items-center gap-3 px-3 py-0 text-white">
        <button
          type="button"
          className="grid size-10 place-items-center rounded bg-white/10 text-white transition hover:bg-white/16"
          aria-label="Switch applications"
        >
          <IconGridDots className="size-[18px]" />
        </button>

        <img
          src={logoSrc}
          alt={logoAlt}
          className="h-6 w-auto"
        />
      </div>

      <div className="custom-scrollbar-overlay flex-1 overflow-y-auto px-2 pb-6">
        <div className="space-y-3">
          <div className="relative">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/45" />
            <input
              type="search"
              placeholder="Navigate..."
              className="h-9 w-full rounded-[8px] border border-white/12 bg-transparent pl-10 pr-[58px] text-[14px] font-normal text-white outline-none placeholder:text-white/45"
            />
            <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 text-[11px] text-white/45">
              <kbd className="rounded bg-white/8 px-1.5 py-0.5 font-sans text-[11px]">⌘</kbd>
              <span>+</span>
              <kbd className="rounded bg-white/8 px-1.5 py-0.5 font-sans text-[11px]">K</kbd>
            </div>
          </div>

          <div className="space-y-1">
            {quickLinks.map((link) => (
              <SidebarLeaf
                key={link.label}
                label={link.label}
                icon={link.icon}
              />
            ))}
          </div>

          <div className="space-y-1">
            {sections.map((section) => (
              <SidebarSection
                key={section.label}
                section={section}
                expanded={Boolean(expandedSections[section.label])}
                onToggle={() =>
                  setExpandedSections((current) => ({
                    ...current,
                    [section.label]: !current[section.label],
                  }))
                }
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
