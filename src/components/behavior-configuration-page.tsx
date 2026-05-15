import { useMemo, useState } from 'react'
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconArrowDownRight,
  IconArrowUpRight,
  IconChevronDown,
  IconChevronLeft,
  IconHelp,
  IconPencil,
  IconShieldCheck,
  IconSparkles,
  IconUserCircle,
  IconX,
} from '@tabler/icons-react'

import { AddBehaviorModal } from '@/components/add-behavior-modal'
import { AppSidebar } from '@/components/app-sidebar'
import { BehaviorDetailPage } from '@/components/behavior-detail-page'
import { Button } from '@/components/ui/button'
import { mockAgents } from '@/data/mock-agents'
import { initialBehaviors } from '@/data/mock-behaviors'
import type { Agent } from '@/types/agent'
import type { Behavior } from '@/types/behavior'

const topLevelTabs = ['Overview', 'Tools', 'Behaviour', 'Testing', 'Activity'] as const

const behaviorCardMetrics: Record<
  string,
  {
    triggerCount: string
    successRate: string
    lastTriggered: string
    needsReview?: boolean
  }
> = {
  'clarify-vague-requests': {
    triggerCount: '1,284',
    successRate: '89%',
    lastTriggered: 'Last triggered 2h ago',
  },
  'steady-executive-tone': {
    triggerCount: '3,492',
    successRate: '94%',
    lastTriggered: 'Last triggered 14m ago',
  },
  'refuse-sensitive-data': {
    triggerCount: '218',
    successRate: '82%',
    lastTriggered: 'Last triggered 9h ago',
    needsReview: true,
  },
}
const behaviorMetrics = [
  {
    label: 'Total behaviour trigger rate',
    value: '42%',
    trend: '+4.8%',
    direction: 'up',
    note: 'Share of responses influenced by at least one behaviour.',
  },
  {
    label: 'Guardrail intervention rate',
    value: '9.4%',
    trend: '-1.2%',
    direction: 'down',
    note: 'Requests where policy or safety behaviours intervened.',
  },
  {
    label: 'Behaviour conflict',
    value: '3 active',
    trend: '+1',
    direction: 'up',
    note: 'Potential overlaps or contradictory behaviour instructions.',
  },
  {
    label: 'Behaviour success rate',
    value: '91%',
    trend: '+2.3%',
    direction: 'up',
    note: 'Cases where the intended behaviour appeared to execute correctly.',
  },
] as const

export function BehaviorConfigurationPage() {
  const [agents] = useState<Agent[]>(mockAgents)
  const [behaviors, setBehaviors] = useState<Behavior[]>(initialBehaviors)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBehavior, setSelectedBehavior] = useState<Behavior | null>(null)
  const [editingBehavior, setEditingBehavior] = useState<Behavior | null>(null)
  const [starterInstruction, setStarterInstruction] = useState('')
  const [metricTooltip, setMetricTooltip] = useState<{
    text: string
    x: number
    y: number
  } | null>(null)
  const [iconTooltip, setIconTooltip] = useState<{
    text: string
    x: number
    y: number
  } | null>(null)

  const selectedAgent = useMemo(() => agents[0] ?? null, [agents])
  const visibleBehaviors = useMemo(
    () => behaviors.filter((behavior) => behavior.libraryLayer !== 'Default internal'),
    [behaviors],
  )

  const handleSaveBehavior = (nextBehavior: Behavior) => {
    setBehaviors((current) => {
      const exists = current.some((behavior) => behavior.id === nextBehavior.id)

      if (exists) {
        return current.map((behavior) =>
          behavior.id === nextBehavior.id ? nextBehavior : behavior,
        )
      }

      return [nextBehavior, ...current]
    })

    setIsModalOpen(false)
    setEditingBehavior(null)
    setStarterInstruction('')
    setSelectedBehavior(nextBehavior)
  }

  return (
    <main className="h-screen overflow-hidden bg-[#f6f8fb] text-slate-950">
      <div className="grid h-screen grid-cols-[15rem_minmax(0,1fr)]">
        <AppSidebar />

        <div className="flex h-screen min-w-0 flex-col overflow-hidden">
          <header className="sticky top-0 z-20 h-[3.75rem] shrink-0 border-b border-[#dddfe3] bg-white">
            <div className="flex h-full items-center justify-between gap-6 px-6">
              <div className="flex items-center gap-10">
                <div className="flex items-end gap-3">
                  <label className="pb-2 text-[14px] leading-4 text-[#616870]">
                    Organization:
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      className="flex h-9 min-w-[20.5rem] items-center justify-between rounded-[8px] border border-[#dddfe3] bg-white px-3 text-[#282829]"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="max-w-[12.5rem] truncate text-[14px] leading-4">
                          LBergeron SF Dev
                        </span>
                        <span className="inline-flex h-5 items-center rounded-full border border-[rgba(103,109,122,0.1)] bg-[rgba(103,109,122,0.1)] px-3 text-[12px] leading-4 text-[#26292f]">
                          Trial
                        </span>
                      </div>
                      <IconChevronDown className="size-4 shrink-0 text-[#676d7a]" />
                    </button>
                  </div>
                </div>

                <div className="relative flex items-end gap-3">
                  <label className="pb-2 text-[14px] leading-4 text-[#616870]">
                    Project:
                  </label>
                  <div className="relative flex items-center gap-3">
                    <button
                      type="button"
                      className="flex h-9 min-w-[20.5rem] items-center justify-between rounded-[8px] border border-[#dddfe3] bg-white px-3 text-[#282829]"
                    >
                      <span className="truncate text-[14px] leading-4 text-[#616870]">
                        No project selected
                      </span>
                      <IconChevronDown className="size-4 shrink-0 text-[#676d7a]" />
                    </button>

                    <div className="flex items-center gap-2 rounded-[4px] border-2 border-[rgba(103,109,122,0.1)] bg-[rgba(103,109,122,0.1)] px-2 py-2 text-[14px] leading-4 text-[#282829]">
                      <IconAlertCircle className="size-4 shrink-0 text-[#676d7a]" />
                      <span>Project filtering doesn&apos;t apply to this panel.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="grid size-9 place-items-center rounded-[4px] text-[#077b6b] transition hover:bg-[rgba(7,123,107,0.16)]"
                  aria-label="Help"
                >
                  <IconHelp className="size-5" />
                </button>
                <button
                  type="button"
                  className="grid size-9 place-items-center rounded-[4px] text-[#077b6b] transition hover:bg-[rgba(7,123,107,0.16)]"
                  aria-label="User menu"
                >
                  <IconUserCircle className="size-5" />
                </button>
              </div>
            </div>
          </header>

          <div className="min-w-0 flex-1 overflow-y-auto bg-[#f9f9fa] px-8 py-10">
            {selectedAgent ? (
              <div className="mx-auto max-w-[1240px] space-y-10">
                <div className="flex flex-col gap-8">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-5">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-[14px] font-medium leading-4 text-[#077b6b]"
                      >
                        <IconChevronLeft className="size-4" />
                        <span>Agents</span>
                      </button>

                      <div className="space-y-2">
                        <h1 className="text-[40px] font-medium leading-[1.2] text-[#282829]">
                          {selectedAgent.name}
                        </h1>
                        <p className="text-[16px] leading-[1.14] text-[#676d7a]">
                          View information about your AI agent.
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="h-11 rounded-[12px] border-[#dddfe3] bg-white px-6 text-[14px] font-medium text-[#077b6b] hover:bg-[#f6f7f9]"
                    >
                      Manage agent
                    </Button>
                  </div>

                  <div className="border-b border-[#dddfe3]">
                    <div className="flex flex-wrap items-end gap-0">
                      {topLevelTabs.map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          className={
                            tab === 'Behaviour'
                              ? 'rounded-t-[8px] border-b-[3px] border-[#077b6b] px-4 pb-[13px] pt-3 text-[14px] font-medium leading-[1.14] text-[#282829]'
                              : 'rounded-t-[8px] px-4 pb-4 pt-3 text-[14px] font-medium leading-[1.14] text-[#676d7a] hover:bg-[#f1f2f4] hover:text-[#282829]'
                          }
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <section className="w-full space-y-6">
                  <div className="flex items-end justify-between gap-6">
                    <div className="space-y-2">
                      <h3 className="text-[24px] font-medium leading-[1.33] text-[#282829]">
                        Behaviour
                      </h3>
                      <p className="text-[14px] leading-[1.14] text-[#676d7a]">
                        Manage the behaviours that define how this agent should respond,
                        apply guardrails, and handle ambiguous requests.
                      </p>
                    </div>

                    <Button
                      onClick={() => {
                        setEditingBehavior(null)
                        setStarterInstruction('')
                        setIsModalOpen(true)
                      }}
                      className="h-10 rounded-[8px] bg-[#077b6b] px-4 text-[14px] font-medium text-white hover:bg-[#02473e]"
                    >
                      Add behaviour
                    </Button>
                  </div>

                  <div className="space-y-4 pt-4">
                    <h4 className="text-[16px] font-medium leading-5 text-[#282829]">
                      Behaviour metrics
                    </h4>

                    <div className="grid gap-4 xl:grid-cols-4">
                      {behaviorMetrics.map((metric) => {
                        const TrendIcon =
                          metric.direction === 'down' ? IconArrowDownRight : IconArrowUpRight
                        const trendColorClass =
                          metric.direction === 'down' ? 'text-[#d2271b]' : 'text-[#0b7e2f]'

                        return (
                          <button
                            key={metric.label}
                            type="button"
                            className="relative inline-flex w-full flex-col items-start rounded-[16px] border border-[#dddfe3] bg-white p-4 text-left shadow-[0px_1px_2px_0px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.05),0px_-0.5px_1px_0px_rgba(0,0,0,0.02)] transition hover:border-[#077b6b]"
                            onMouseEnter={(event) =>
                              setMetricTooltip({
                                text: metric.note,
                                x: event.clientX,
                                y: event.clientY,
                              })
                            }
                            onMouseMove={(event) =>
                              setMetricTooltip({
                                text: metric.note,
                                x: event.clientX,
                                y: event.clientY,
                              })
                            }
                            onMouseLeave={() => setMetricTooltip(null)}
                          >
                            <div className="flex w-full flex-col gap-3">
                              <div className="flex items-center gap-2">
                                <p className="text-[14px] font-medium leading-[1.14] text-[#282829]">
                                  {metric.label}
                                </p>
                              </div>

                              <div className="flex flex-wrap items-end gap-2">
                                <h2 className="text-[32px] font-normal leading-[1.35] text-[#282829]">
                                  {metric.value}
                                </h2>
                                <div className="flex flex-col gap-0">
                                  <div
                                    className={`flex flex-wrap items-center gap-1 text-[14px] leading-[1.14] ${trendColorClass}`}
                                  >
                                    <span>{metric.trend}</span>
                                    <span>
                                      <TrendIcon className="size-4" />
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    <div className="space-y-4 pt-4">
                      <h4 className="text-[16px] font-medium leading-5 text-[#282829]">
                        Behaviors
                      </h4>

                      <div className="overflow-hidden rounded-[8px] border border-[#dddfe3] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.05),0px_-0.5px_1px_0px_rgba(0,0,0,0.02)]">
                        <div className="border-b border-[#dddfe3] bg-[#f9f9fa] px-6 py-3">
                          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                            <div className="xl:min-w-0 xl:flex-1">
                              <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#5d7289]">
                                Behavior
                              </p>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:min-w-[19rem] xl:max-w-[20rem]">
                              <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#5d7289]">
                                Trigger count
                              </p>
                              <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#5d7289]">
                                Success rate
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="divide-y divide-[#dddfe3]">
                          {visibleBehaviors.map((behavior) => {
                            const sourceMeta =
                              behavior.libraryLayer === 'Shared'
                                ? {
                                    label: 'Template',
                                    icon: IconSparkles,
                                  }
                                : behavior.libraryLayer === 'Custom'
                                  ? {
                                      label: 'Custom',
                                      icon: IconPencil,
                                    }
                                  : {
                                      label: 'Default',
                                      icon: IconShieldCheck,
                                    }

                            const SourceIcon = sourceMeta.icon

                            return (
                              <button
                                key={behavior.id}
                                type="button"
                                onClick={() => setSelectedBehavior(behavior)}
                                className="w-full px-6 py-5 text-left transition hover:bg-[#fcfcfd]"
                              >
                                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                                  <div className="min-w-0 flex-1 space-y-3">
                                    <div className="space-y-2">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span
                                          className="inline-flex items-center text-[#676d7a]"
                                          aria-label={sourceMeta.label}
                                          onMouseEnter={(event) =>
                                            setIconTooltip({
                                              text: sourceMeta.label,
                                              x: event.clientX,
                                              y: event.clientY,
                                            })
                                          }
                                          onMouseMove={(event) =>
                                            setIconTooltip({
                                              text: sourceMeta.label,
                                              x: event.clientX,
                                              y: event.clientY,
                                            })
                                          }
                                          onMouseLeave={() => setIconTooltip(null)}
                                        >
                                          <SourceIcon className="size-4" />
                                        </span>
                                        <h4 className="text-[16px] font-medium leading-5 text-[#282829]">
                                          {behavior.name}
                                        </h4>
                                        <span
                                          className={
                                            behavior.enabled
                                              ? 'inline-flex size-2.5 rounded-full bg-[#0b7e2f]'
                                              : 'inline-flex size-2.5 rounded-full bg-[#959cab]'
                                          }
                                          aria-label={behavior.enabled ? 'Enabled' : 'Disabled'}
                                          onMouseEnter={(event) =>
                                            setIconTooltip({
                                              text: behavior.enabled ? 'Enabled' : 'Disabled',
                                              x: event.clientX,
                                              y: event.clientY,
                                            })
                                          }
                                          onMouseMove={(event) =>
                                            setIconTooltip({
                                              text: behavior.enabled ? 'Enabled' : 'Disabled',
                                              x: event.clientX,
                                              y: event.clientY,
                                            })
                                          }
                                          onMouseLeave={() => setIconTooltip(null)}
                                        />
                                        {behaviorCardMetrics[behavior.id]?.needsReview ? (
                                          <span
                                            className="inline-flex items-center text-[#b84b11]"
                                            aria-label="Needs review"
                                            onMouseEnter={(event) =>
                                              setIconTooltip({
                                                text: 'Needs review',
                                                x: event.clientX,
                                                y: event.clientY,
                                              })
                                            }
                                            onMouseMove={(event) =>
                                              setIconTooltip({
                                                text: 'Needs review',
                                                x: event.clientX,
                                                y: event.clientY,
                                              })
                                            }
                                            onMouseLeave={() => setIconTooltip(null)}
                                          >
                                            <IconAlertTriangle className="size-4" />
                                          </span>
                                        ) : null}
                                      </div>
                                    </div>

                                    <p className="max-w-3xl text-[14px] leading-5 text-[#3b3e46]">
                                      {behavior.summary}
                                    </p>
                                  </div>

                                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:min-w-[19rem] xl:max-w-[20rem]">
                                    <p className="text-[16px] font-medium leading-5 text-[#282829]">
                                      {behaviorCardMetrics[behavior.id]?.triggerCount ?? '0'}
                                    </p>
                                    <p className="text-[16px] font-medium leading-5 text-[#282829]">
                                      {behaviorCardMetrics[behavior.id]?.successRate ?? '0%'}
                                    </p>
                                  </div>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <AddBehaviorModal
        open={isModalOpen}
        mode={editingBehavior ? 'edit' : 'create'}
        behavior={editingBehavior}
        initialInstruction={starterInstruction}
        onClose={() => {
          setIsModalOpen(false)
          setEditingBehavior(null)
          setStarterInstruction('')
        }}
        onSave={handleSaveBehavior}
      />

      {selectedBehavior ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="relative max-h-[92vh] w-full max-w-5xl overflow-auto rounded-[24px] border border-[#dddfe3] bg-[#f9f9fa] p-6 shadow-[0px_12px_12px_-7px_rgba(0,0,0,0.04),0px_28px_23px_-7px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.05)]">
            <button
              type="button"
              onClick={() => setSelectedBehavior(null)}
              className="absolute right-5 top-5 inline-flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:text-slate-950"
              aria-label="Close behavior details"
            >
              <IconX className="size-4" />
            </button>

            <BehaviorDetailPage
              behavior={selectedBehavior}
              onEdit={(behavior) => {
                setEditingBehavior(behavior)
                setIsModalOpen(true)
                setSelectedBehavior(null)
              }}
            />
          </div>
        </div>
      ) : null}

      {metricTooltip ? (
        <div
          className="pointer-events-none fixed z-[60] max-w-[16rem] rounded-[8px] bg-[#282829] px-3 py-2 text-[12px] leading-[1.33] text-white shadow-lg"
          style={{
            left: metricTooltip.x + 14,
            top: metricTooltip.y + 14,
          }}
        >
          {metricTooltip.text}
        </div>
      ) : null}

      {iconTooltip ? (
        <div
          className="pointer-events-none fixed z-[60] max-w-[12rem] rounded-[8px] bg-[#282829] px-3 py-2 text-[12px] leading-[1.33] text-white shadow-lg"
          style={{
            left: iconTooltip.x + 14,
            top: iconTooltip.y + 14,
          }}
        >
          {iconTooltip.text}
        </div>
      ) : null}
    </main>
  )
}
