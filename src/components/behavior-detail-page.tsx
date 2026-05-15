import { useMemo, useState } from 'react'
import { IconFlask, IconPlayerPlay } from '@tabler/icons-react'

import {
  CategoryBadge,
  LibraryLayerBadge,
  StatusBadge,
} from '@/components/behavior-badges'
import { Button } from '@/components/ui/button'
import { mockBehaviorTestResult } from '@/lib/behavior-parser'
import type { Behavior } from '@/types/behavior'

const detailTabs = ['Overview', 'Performance', 'Testing'] as const

type DetailTab = (typeof detailTabs)[number]

const behaviorDiagnosticMetrics: Record<
  string,
  {
    triggerRate: string
    triggerRateValue: number
    successRate: string
    successRateValue: number
    negativeFeedback: string
    negativeFeedbackValue: number
    syntheticPassRate: string
    syntheticPassRateValue: number
    falsePositives: string
    falsePositivesValue: number
    falseNegatives: string
    falseNegativesValue: number
    conflictSeverity: 'low' | 'medium' | 'high'
    conflictNote: string
    examples: {
      worked: string
      needsReview: string
    }
    recommendation: string
  }
> = {
  'clarify-vague-requests': {
    triggerRate: '14% of conversations',
    triggerRateValue: 14,
    successRate: '89%',
    successRateValue: 89,
    negativeFeedback: '4%',
    negativeFeedbackValue: 4,
    syntheticPassRate: '92%',
    syntheticPassRateValue: 92,
    falsePositives: '6%',
    falsePositivesValue: 6,
    falseNegatives: '11%',
    falseNegativesValue: 11,
    conflictSeverity: 'low',
    conflictNote: 'Minor overlap with concise-answer behaviour in 3 active cases.',
    examples: {
      worked:
        '“Help me pick the right support package” led to a short clarification before the answer.',
      needsReview:
        '“How do I reset my password?” still triggered a clarification when the intent was already clear.',
    },
    recommendation:
      'Narrow the trigger so direct procedural questions do not ask for extra clarification.',
  },
  'steady-executive-tone': {
    triggerRate: '37% of conversations',
    triggerRateValue: 37,
    successRate: '94%',
    successRateValue: 94,
    negativeFeedback: '2%',
    negativeFeedbackValue: 2,
    syntheticPassRate: '96%',
    syntheticPassRateValue: 96,
    falsePositives: '3%',
    falsePositivesValue: 3,
    falseNegatives: '5%',
    falseNegativesValue: 5,
    conflictSeverity: 'low',
    conflictNote: 'No meaningful conflicts detected in the last 7 days.',
    examples: {
      worked:
        'Pricing and renewal answers stayed concise, calm, and high-trust across recent sessions.',
      needsReview:
        'A few troubleshooting replies felt overly formal when the user expected a lighter tone.',
    },
    recommendation:
      'Consider a slight relaxation for support flows that need warmer, more conversational phrasing.',
  },
  'refuse-sensitive-data': {
    triggerRate: '3% of conversations',
    triggerRateValue: 3,
    successRate: '82%',
    successRateValue: 82,
    negativeFeedback: '9%',
    negativeFeedbackValue: 9,
    syntheticPassRate: '78%',
    syntheticPassRateValue: 78,
    falsePositives: '8%',
    falsePositivesValue: 8,
    falseNegatives: '14%',
    falseNegativesValue: 14,
    conflictSeverity: 'medium',
    conflictNote: 'Potential overlap with escalation logic on regulated queries.',
    examples: {
      worked:
        'The agent declined a request for account secrets and redirected the user to a secure channel.',
      needsReview:
        'A billing question mentioning account details was blocked too early instead of being safely redirected.',
    },
    recommendation:
      'Tune the refusal logic to distinguish unsafe disclosure from routine account-help requests.',
  },
}

interface BehaviorDetailPageProps {
  behavior: Behavior
  onEdit: (behavior: Behavior) => void
}

export function BehaviorDetailPage({ behavior, onEdit }: BehaviorDetailPageProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('Overview')
  const [query, setQuery] = useState(
    'I need help with this, but I am not sure what details you need from me.',
  )
  const [hasRunTest, setHasRunTest] = useState(false)

  const testResult = useMemo(
    () => mockBehaviorTestResult(behavior, query),
    [behavior, query],
  )
  const metrics = behaviorDiagnosticMetrics[behavior.id]
  const conflictTone =
    metrics?.conflictSeverity === 'high'
      ? {
          badge: 'High severity',
          badgeClass: 'bg-[#feefee] text-[#d2271b]',
          borderClass: 'border-[#fca7a5]',
        }
      : metrics?.conflictSeverity === 'medium'
        ? {
            badge: 'Needs attention',
            badgeClass: 'bg-[#fff2c0] text-[#936400]',
            borderClass: 'border-[#ffeedd]',
          }
        : {
            badge: 'Stable',
            badgeClass: 'bg-[#e5fff9] text-[#077b6b]',
            borderClass: 'border-[#cdfed5]',
          }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-normal uppercase tracking-[0.16em] text-[#5d7289]">
            Selected behaviour
          </p>
          <h3 className="mt-1 text-[16px] font-medium leading-5 text-[#282829]">
            {behavior.name}
          </h3>
        </div>
        <Button
          onClick={() => onEdit(behavior)}
          className="bg-[#077b6b] text-white hover:bg-[#02473e]"
        >
          Edit behaviour
        </Button>
      </div>

      <div className="border-b border-[#dddfe3]">
        <div className="flex flex-wrap items-end gap-0">
          {detailTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={
                activeTab === tab
                  ? 'rounded-t-[8px] border-b-[3px] border-[#077b6b] px-4 pb-[13px] pt-3 text-[14px] font-medium leading-[1.14] text-[#282829]'
                  : 'rounded-t-[8px] px-4 pb-4 pt-3 text-[14px] font-medium leading-[1.14] text-[#676d7a] hover:bg-[#f1f2f4] hover:text-[#282829]'
              }
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'Overview' ? (
        <section className="rounded-[8px] border border-[#dddfe3] bg-white p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <LibraryLayerBadge layer={behavior.libraryLayer} />
                <CategoryBadge category={behavior.category} />
                <StatusBadge status={behavior.status} />
                {!behavior.enabled ? (
                  <span className="inline-flex rounded-full border border-[#dddfe3] bg-[#f1f2f4] px-2.5 py-1 text-xs font-normal text-[#676d7a]">
                    Disabled
                  </span>
                ) : null}
              </div>
              <div className="space-y-2">
                <h2 className="text-[24px] font-medium tracking-tight text-[#282829]">
                  {behavior.name}
                </h2>
                <p className="max-w-3xl text-[14px] leading-[1.5] text-[#616870]">
                  {behavior.description}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[8px] border border-[#dddfe3] bg-[#f9f9fa] p-5 md:col-span-2">
              <p className="text-xs font-normal uppercase tracking-[0.18em] text-[#5d7289]">
                Original ask
              </p>
              <p className="mt-3 text-[14px] leading-[1.5] text-[#282829]">
                {behavior.originalInstruction}
              </p>
            </div>
            <div className="rounded-[8px] border border-[#dddfe3] bg-[#f9f9fa] p-5">
              <p className="text-xs font-normal uppercase tracking-[0.18em] text-[#5d7289]">
                System translation: when this applies
              </p>
              <p className="mt-3 text-[14px] leading-[1.5] text-[#282829]">
                {behavior.condition}
              </p>
            </div>
            <div className="rounded-[8px] border border-[#dddfe3] bg-[#f9f9fa] p-5">
              <p className="text-xs font-normal uppercase tracking-[0.18em] text-[#5d7289]">
                System translation: the agent will
              </p>
              <p className="mt-3 text-[14px] leading-[1.5] text-[#282829]">
                {behavior.behavior}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === 'Performance' && metrics ? (
        <section className="rounded-[8px] border border-[#dddfe3] bg-white p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-[20px] font-medium tracking-tight text-[#282829]">
                Behaviour diagnostics
              </h3>
              <p className="text-[14px] leading-[1.5] text-[#616870]">
                Deeper metrics to understand how this behaviour is performing in production and where it may need tuning.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[12px] border border-[#dddfe3] bg-[#f9f9fa] p-5">
                <p className="text-xs font-normal uppercase tracking-[0.18em] text-[#5d7289]">
                  Trigger rate
                </p>
                <p className="mt-3 text-[24px] font-medium leading-7 text-[#282829]">
                  {metrics.triggerRateValue}%
                </p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e4e7e7]">
                  <div
                    className="h-full rounded-full bg-[#077b6b]"
                    style={{ width: `${metrics.triggerRateValue}%` }}
                  />
                </div>
                <p className="mt-3 text-[12px] leading-4 text-[#676d7a]">
                  {metrics.triggerRate}
                </p>
              </div>
              <div className="rounded-[12px] border border-[#dddfe3] bg-[#f9f9fa] p-5">
                <p className="text-xs font-normal uppercase tracking-[0.18em] text-[#5d7289]">
                  Success rate
                </p>
                <p className="mt-3 text-[24px] font-medium leading-7 text-[#282829]">
                  {metrics.successRate}
                </p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e4e7e7]">
                  <div
                    className="h-full rounded-full bg-[#0b7e2f]"
                    style={{ width: `${metrics.successRateValue}%` }}
                  />
                </div>
                <p className="mt-3 text-[12px] leading-4 text-[#676d7a]">
                  Successful executions across recent sessions.
                </p>
              </div>
              <div className="rounded-[12px] border border-[#dddfe3] bg-[#f9f9fa] p-5">
                <p className="text-xs font-normal uppercase tracking-[0.18em] text-[#5d7289]">
                  Negative feedback
                </p>
                <p className="mt-3 text-[24px] font-medium leading-7 text-[#282829]">
                  {metrics.negativeFeedback}
                </p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e4e7e7]">
                  <div
                    className="h-full rounded-full bg-[#d2271b]"
                    style={{ width: `${metrics.negativeFeedbackValue}%` }}
                  />
                </div>
                <p className="mt-3 text-[12px] leading-4 text-[#676d7a]">
                  Responses that were marked down or sent for review.
                </p>
              </div>
              <div className="rounded-[12px] border border-[#dddfe3] bg-[#f9f9fa] p-5">
                <p className="text-xs font-normal uppercase tracking-[0.18em] text-[#5d7289]">
                  Synthetic pass rate
                </p>
                <p className="mt-3 text-[24px] font-medium leading-7 text-[#282829]">
                  {metrics.syntheticPassRate}
                </p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e4e7e7]">
                  <div
                    className="h-full rounded-full bg-[#1169da]"
                    style={{ width: `${metrics.syntheticPassRateValue}%` }}
                  />
                </div>
                <p className="mt-3 text-[12px] leading-4 text-[#676d7a]">
                  Current pass rate across synthetic validation prompts.
                </p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[12px] border border-[#dddfe3] bg-[#f9f9fa] p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-normal uppercase tracking-[0.18em] text-[#5d7289]">
                    Failure analysis
                  </p>
                  <p className="text-[12px] leading-4 text-[#676d7a]">
                    False positives vs false negatives
                  </p>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#e4e7e7]">
                  <div className="flex h-full w-full">
                    <div
                      className="h-full bg-[#f27a38]"
                      style={{
                        width: `${
                          (metrics.falsePositivesValue /
                            (metrics.falsePositivesValue + metrics.falseNegativesValue)) *
                          100
                        }%`,
                      }}
                    />
                    <div
                      className="h-full bg-[#d2271b]"
                      style={{
                        width: `${
                          (metrics.falseNegativesValue /
                            (metrics.falsePositivesValue + metrics.falseNegativesValue)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[8px] border border-[#ffeedd] bg-white px-4 py-3">
                    <p className="text-[12px] leading-4 text-[#936400]">False positives</p>
                    <p className="mt-1 text-[18px] font-medium leading-5 text-[#282829]">
                      {metrics.falsePositives}
                    </p>
                  </div>
                  <div className="rounded-[8px] border border-[#fdd5d5] bg-white px-4 py-3">
                    <p className="text-[12px] leading-4 text-[#d2271b]">False negatives</p>
                    <p className="mt-1 text-[18px] font-medium leading-5 text-[#282829]">
                      {metrics.falseNegatives}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className={`rounded-[12px] border bg-[#f9f9fa] p-5 ${conflictTone?.borderClass ?? 'border-[#dddfe3]'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-normal uppercase tracking-[0.18em] text-[#5d7289]">
                      Conflict and overlap
                    </p>
                    <p className="mt-3 text-[14px] leading-[1.5] text-[#282829]">
                      {metrics.conflictNote}
                    </p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[12px] font-medium leading-4 ${conflictTone?.badgeClass ?? 'bg-[#f1f2f4] text-[#676d7a]'}`}
                  >
                    {conflictTone?.badge ?? 'Stable'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-[12px] border border-[#dddfe3] bg-[#f9f9fa] p-5">
                <p className="text-xs font-normal uppercase tracking-[0.18em] text-[#5d7289]">
                  Recent examples
                </p>
                <div className="mt-4 space-y-3">
                  <div className="rounded-[8px] border border-[#cdfed5] bg-white px-4 py-3">
                    <p className="text-[12px] font-medium leading-4 text-[#077b6b]">Worked well</p>
                    <p className="mt-1 text-[14px] leading-[1.5] text-[#282829]">
                      {metrics.examples.worked}
                    </p>
                  </div>
                  <div className="rounded-[8px] border border-[#fff2c0] bg-white px-4 py-3">
                    <p className="text-[12px] font-medium leading-4 text-[#936400]">Needs review</p>
                    <p className="mt-1 text-[14px] leading-[1.5] text-[#282829]">
                      {metrics.examples.needsReview}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[12px] border border-[#dddfe3] bg-[#f9f9fa] p-5">
                <p className="text-xs font-normal uppercase tracking-[0.18em] text-[#5d7289]">
                  Suggested improvement
                </p>
                <div className="mt-4 rounded-[8px] border border-[#dddfe3] bg-white px-4 py-4">
                  <p className="text-[14px] leading-[1.5] text-[#282829]">
                    {metrics.recommendation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === 'Testing' ? (
        <section className="rounded-[8px] border border-[#dddfe3] bg-white p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-[8px] bg-[#282829] p-3 text-white">
              <IconFlask className="size-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-[20px] font-medium tracking-tight text-[#282829]">
                Test this behaviour
              </h3>
              <p className="max-w-2xl text-[14px] leading-[1.5] text-[#616870]">
                Try a sample message to see whether this behaviour should trigger and
                how the system would respond.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="test-query"
                className="text-sm font-normal text-[#282829]"
              >
                Test query
              </label>
              <textarea
                id="test-query"
                rows={4}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-[8px] border border-[#dddfe3] bg-white px-4 py-3 text-sm text-[#282829] outline-none transition focus:border-[#b9bdc7]"
              />
            </div>

            <Button
              onClick={() => setHasRunTest(true)}
              className="bg-[#077b6b] text-white hover:bg-[#02473e]"
            >
              <IconPlayerPlay className="size-4" />
              Run test
            </Button>
          </div>

          {hasRunTest ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[8px] border border-[#dddfe3] bg-[#f9f9fa] p-5">
                <p className="text-xs font-normal uppercase tracking-[0.18em] text-[#5d7289]">
                  Triggered
                </p>
                <p className="mt-3 text-base font-normal text-[#282829]">
                  {testResult.triggered ? 'Yes' : 'No'}
                </p>
              </div>
              <div className="rounded-[8px] border border-[#dddfe3] bg-[#f9f9fa] p-5">
                <p className="text-xs font-normal uppercase tracking-[0.18em] text-[#5d7289]">
                  Result
                </p>
                <p className="mt-3 text-base font-normal text-[#282829]">
                  {testResult.result}
                </p>
              </div>
              <div className="rounded-[8px] border border-[#dddfe3] bg-[#f9f9fa] p-5">
                <p className="text-xs font-normal uppercase tracking-[0.18em] text-[#5d7289]">
                  Expected behaviour
                </p>
                <p className="mt-3 text-[14px] leading-[1.5] text-[#282829]">
                  {testResult.expectedBehavior}
                </p>
              </div>
              <div className="rounded-[8px] border border-[#dddfe3] bg-[#f9f9fa] p-5">
                <p className="text-xs font-normal uppercase tracking-[0.18em] text-[#5d7289]">
                  Generated response
                </p>
                <p className="mt-3 text-[14px] leading-[1.5] text-[#282829]">
                  {testResult.generatedResponse}
                </p>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  )
}
