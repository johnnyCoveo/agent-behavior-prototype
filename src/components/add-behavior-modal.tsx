import { useEffect, useMemo, useState } from 'react'
import { IconCheck, IconSparkles, IconX } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import {
  buildBehaviorName,
  createBehaviorFromDraft,
  interpretInstruction,
} from '@/lib/behavior-parser'
import type { Behavior, BehaviorCategory, BehaviorDraft } from '@/types/behavior'
import { behaviorCategories } from '@/types/behavior'

interface AddBehaviorModalProps {
  open: boolean
  mode: 'create' | 'edit'
  behavior?: Behavior | null
  initialInstruction?: string
  onClose: () => void
  onSave: (behavior: Behavior) => void
}

const emptyDraft: BehaviorDraft = {
  name: '',
  instruction: '',
  category: 'Clarification',
  condition: '',
  behavior: '',
}

const starterTemplates = [
  {
    name: 'Clarify vague requests',
    instruction:
      'When users ask vague questions, ask a clarifying question before answering.',
  },
  {
    name: 'Cite trusted sources',
    instruction:
      'When the answer relies on retrieved content, include concise source citations the client can review.',
  },
  {
    name: 'Protect sensitive information',
    instruction:
      'Do not share sensitive personal or account information, and redirect users to a safer next step.',
  },
  {
    name: 'Stay concise by default',
    instruction:
      'Keep answers concise unless the user explicitly asks for a detailed explanation.',
  },
  {
    name: 'Offer next steps',
    instruction:
      'After answering, suggest a clear next step the user can take when it is helpful.',
  },
  {
    name: 'Escalate billing issues',
    instruction:
      'When a billing request requires account-specific changes, explain the limitation and direct the user to the correct support path.',
  },
  {
    name: 'Use a professional tone',
    instruction:
      'Respond in a professional, confident tone and avoid slang or overly casual phrasing.',
  },
  {
    name: 'Summarize long answers',
    instruction:
      'When the answer is long, begin with a short summary before providing more detail.',
  },
  {
    name: 'Ask one question at a time',
    instruction:
      'When clarification is needed, ask one focused question instead of listing multiple questions at once.',
  },
  {
    name: 'Refuse unsupported claims',
    instruction:
      'Do not make claims that are not supported by trusted content or explicit system knowledge.',
  },
  {
    name: 'Recommend relevant content',
    instruction:
      'When appropriate, recommend the most relevant article, page, or resource for the user to review next.',
  },
  {
    name: 'Avoid legal advice',
    instruction:
      'Do not provide legal advice and direct users to a qualified legal professional when needed.',
  },
  {
    name: 'Avoid financial advice',
    instruction:
      'Do not provide financial advice and redirect users toward general educational information instead.',
  },
  {
    name: 'Confirm before sensitive actions',
    instruction:
      'Before suggesting a sensitive action, ask the user to confirm their intent and explain any important implications.',
  },
  {
    name: 'Explain limitations clearly',
    instruction:
      'When the agent cannot help, explain the limitation clearly and provide the best available alternative.',
  },
  {
    name: 'Prefer step-by-step guidance',
    instruction:
      'When answering task-based questions, structure the response as clear step-by-step guidance.',
  },
  {
    name: 'Keep brand language consistent',
    instruction:
      'Use approved brand language and avoid wording that feels off-brand or overly technical.',
  },
  {
    name: 'Handle frustrated users carefully',
    instruction:
      'When users seem frustrated, acknowledge the friction, stay calm, and focus on the fastest path to resolution.',
  },
  {
    name: 'Surface uncertainty honestly',
    instruction:
      'If confidence is low, say so clearly and avoid sounding more certain than the evidence allows.',
  },
  {
    name: 'Use plain language',
    instruction:
      'Prefer plain language and avoid internal jargon unless the user is clearly asking in technical terms.',
  },
  {
    name: 'Close with a check-in',
    instruction:
      'End complex answers by asking whether the user wants a shorter summary or a deeper explanation.',
  },
] as const

export function AddBehaviorModal({
  open,
  mode,
  behavior,
  initialInstruction,
  onClose,
  onSave,
}: AddBehaviorModalProps) {
  const [step, setStep] = useState(1)
  const [entryMode, setEntryMode] = useState<'describe' | 'library' | null>(null)
  const [draft, setDraft] = useState<BehaviorDraft>(emptyDraft)

  useEffect(() => {
    if (!open) {
      return
    }

    if (behavior) {
      setDraft({
        name: behavior.name,
        instruction:
          behavior.originalInstruction ||
          `When ${behavior.condition.toLowerCase()}, ${behavior.behavior.toLowerCase()}.`,
        category: behavior.category,
        condition: behavior.condition,
        behavior: behavior.behavior,
      })
      setEntryMode('describe')
      setStep(3)
      return
    }

    setDraft({
      ...emptyDraft,
      instruction: initialInstruction ?? '',
    })
    setEntryMode(initialInstruction ? 'describe' : null)
    setStep(initialInstruction ? 2 : 1)
  }, [behavior, initialInstruction, open])

  const interpretation = useMemo(
    () => interpretInstruction(draft.instruction),
    [draft.instruction],
  )

  const canContinueFromStepOne = draft.instruction.trim().length > 10
  const canContinueFromStepThree =
    draft.condition.trim().length > 0 &&
    draft.behavior.trim().length > 0 &&
    draft.name.trim().length > 0

  if (!open) {
    return null
  }

  const applyInterpretation = () => {
    setDraft((current) => ({
      ...current,
      name: current.name || interpretation.name,
      condition: interpretation.condition,
      behavior: interpretation.behavior,
    }))
    setStep(3)
  }

  const handleUseTemplate = (instruction: string) => {
    setDraft((current) => ({
      ...current,
      instruction,
    }))
    setTimeout(() => {
      const nextInterpretation = interpretInstruction(instruction)
      setDraft((current) => ({
        ...current,
        instruction,
        name: current.name || nextInterpretation.name,
        condition: nextInterpretation.condition,
        behavior: nextInterpretation.behavior,
      }))
      setStep(3)
    }, 0)
  }

  const handleSave = () => {
    const nextBehavior = createBehaviorFromDraft(
      {
        ...draft,
        name: draft.name || buildBehaviorName(draft.behavior),
      },
      behavior ? behavior.status : 'custom',
      behavior?.id,
    )

    onSave(nextBehavior)
  }

  const stepLabel =
    mode === 'create' ? 'Add behaviour' : `Edit ${behavior?.name ?? 'behaviour'}`

  const stepItems = [
    { title: 'Choose path' },
    { title: entryMode === 'library' ? 'Browse library' : 'Describe intent' },
    { title: 'Refine behaviour' },
    { title: 'Save behaviour' },
  ] as const

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[24px] border border-[#dddfe3] bg-[#f9f9fa] shadow-[0px_12px_12px_-7px_rgba(0,0,0,0.04),0px_28px_23px_-7px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.05)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 inline-flex size-9 items-center justify-center rounded-full border border-[#dddfe3] bg-white text-[#676d7a] transition hover:text-[#282829]"
          aria-label="Close behaviour modal"
        >
          <IconX className="size-4" />
        </button>

        <div className="flex-1 overflow-auto px-6 py-6 md:px-8 md:py-8">
          <div className="space-y-6">
            <div className="space-y-2">
            <h2 className="text-[24px] font-medium leading-[1.33] text-[#282829]">
              {stepLabel}
            </h2>
            <p className="max-w-2xl text-[14px] leading-[1.5] text-[#676d7a]">
              Describe what should happen, review how the system interprets it,
              then refine the behaviour before saving it.
            </p>
            </div>

            <div className="grid gap-3 md:grid-cols-4 md:gap-4">
              {stepItems.map((item, index) => {
                const value = index + 1
                const isCompleted = step > value
                const isActive = step === value

                return (
                  <div key={item.title} className="min-w-0">
                    <div className="flex items-center">
                      <div className="flex shrink-0 items-center">
                      <div
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full border text-[13px] font-medium ${
                          isCompleted
                            ? 'border-[#077b6b] bg-[#077b6b] text-white'
                            : isActive
                              ? 'border-[#077b6b] bg-white text-[#077b6b]'
                              : 'border-[#dddfe3] bg-white text-[#676d7a]'
                        }`}
                      >
                        {isCompleted ? <IconCheck className="size-4" /> : value}
                      </div>
                      <p
                        className={`ml-3 text-[12px] leading-[1.2] ${
                          isActive || isCompleted
                            ? 'font-medium text-[#282829]'
                            : 'text-[#676d7a]'
                        }`}
                      >
                        {item.title}
                      </p>
                      </div>

                      {value < stepItems.length ? (
                        <div
                          className={`ml-3 h-px flex-1 ${
                            step > value ? 'bg-[#077b6b]' : 'bg-[#dddfe3]'
                          }`}
                        />
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="rounded-[16px] border border-[#dddfe3] bg-white p-5 md:p-6">
              {step === 1 ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEntryMode('describe')
                        setStep(2)
                      }}
                      className="rounded-[12px] border border-[#dddfe3] bg-[#f9f9fa] px-5 py-5 text-left transition hover:border-[#b9bdc7] hover:bg-white"
                    >
                      <div className="space-y-2">
                        <div className="flex size-20 items-center justify-center rounded-[12px] border border-dashed border-[#c4c9cf] bg-white text-[11px] font-medium uppercase tracking-[0.12em] text-[#8f969e]">
                          Visual
                        </div>
                        <h3 className="text-[16px] font-medium leading-5 text-[#282829]">
                          Describe what you want
                        </h3>
                        <p className="text-[14px] leading-[1.5] text-[#676d7a]">
                          Write the behaviour in plain language and let the system translate it.
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEntryMode('library')
                        setStep(2)
                      }}
                      className="rounded-[12px] border border-[#dddfe3] bg-[#f9f9fa] px-5 py-5 text-left transition hover:border-[#b9bdc7] hover:bg-white"
                    >
                      <div className="space-y-2">
                        <div className="flex size-20 items-center justify-center rounded-[12px] border border-dashed border-[#c4c9cf] bg-white text-[11px] font-medium uppercase tracking-[0.12em] text-[#8f969e]">
                          Visual
                        </div>
                        <h3 className="text-[16px] font-medium leading-5 text-[#282829]">
                          Pick from the library
                        </h3>
                        <p className="text-[14px] leading-[1.5] text-[#676d7a]">
                          Browse existing templates and start from one that already fits your use case.
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              ) : null}

              {step === 2 && entryMode === 'library' ? (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-[16px] font-medium leading-5 text-[#282829]">
                      Browse behaviour library
                    </h3>
                    <p className="text-[14px] leading-[1.5] text-[#676d7a]">
                      Select a template to use as your starting point.
                    </p>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-3">
                    {starterTemplates.map((template) => (
                      <button
                        key={template.name}
                        type="button"
                        onClick={() => handleUseTemplate(template.instruction)}
                        className="rounded-[12px] border border-[#dddfe3] bg-[#f9f9fa] px-4 py-4 text-left transition hover:border-[#b9bdc7] hover:bg-white"
                      >
                        <div className="space-y-3">
                          <h4 className="text-[14px] font-medium leading-5 text-[#282829]">
                            {template.name}
                          </h4>
                          <p className="text-[13px] leading-[1.5] text-[#676d7a]">
                            {template.instruction}
                          </p>
                          <p className="text-[12px] font-medium leading-4 text-[#077b6b]">
                            Use template
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {step === 2 && entryMode === 'describe' ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="instruction"
                      className="text-[14px] font-medium text-[#282829]"
                    >
                      Describe what you want the agent to do
                    </label>
                    <textarea
                      id="instruction"
                      value={draft.instruction}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          instruction: event.target.value,
                        }))
                      }
                      rows={8}
                      placeholder="When users ask vague questions, ask a clarifying question before answering."
                      className="w-full rounded-[8px] border border-[#dddfe3] bg-[#f1f2f4] px-4 py-3 text-[14px] text-[#282829] outline-none transition focus:border-[#b9bdc7] focus:bg-white"
                    />
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="grid gap-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-[8px] border border-[#dddfe3] bg-[#f9f9fa] p-5">
                      <p className="text-xs font-normal uppercase tracking-[0.18em] text-[#5d7289]">
                        Original ask
                      </p>
                      <p className="mt-3 text-[14px] leading-[1.5] text-[#282829]">
                        {draft.instruction}
                      </p>
                    </div>
                    <div className="rounded-[8px] border border-[#dddfe3] bg-[#f9f9fa] p-5">
                      <p className="text-xs font-normal uppercase tracking-[0.18em] text-[#5d7289]">
                        System translation
                      </p>
                      <div className="mt-3 space-y-2 text-[14px] leading-[1.5] text-[#282829]">
                        <p>{interpretation.condition}</p>
                        <p>{interpretation.behavior}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[1.1fr,0.9fr]">
                    <div className="space-y-2">
                      <label
                        htmlFor="behavior-name"
                        className="text-[14px] font-medium text-[#282829]"
                      >
                        Behaviour name
                      </label>
                      <input
                        id="behavior-name"
                        value={draft.name}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            name: event.target.value,
                          }))
                        }
                        className="w-full rounded-[8px] border border-[#dddfe3] bg-[#f1f2f4] px-4 py-3 text-[14px] text-[#282829] outline-none transition focus:border-[#b9bdc7] focus:bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="behavior-category"
                        className="text-[14px] font-medium text-[#282829]"
                      >
                        Category
                      </label>
                      <select
                        id="behavior-category"
                        value={draft.category}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            category: event.target.value as BehaviorCategory,
                          }))
                        }
                        className="w-full rounded-[8px] border border-[#dddfe3] bg-[#f1f2f4] px-4 py-3 text-[14px] text-[#282829] outline-none transition focus:border-[#b9bdc7] focus:bg-white"
                      >
                        {behaviorCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="behavior-condition"
                      className="text-[14px] font-medium text-[#282829]"
                    >
                      When this applies
                    </label>
                    <input
                      id="behavior-condition"
                      value={draft.condition}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          condition: event.target.value,
                        }))
                      }
                      className="w-full rounded-[8px] border border-[#dddfe3] bg-[#f1f2f4] px-4 py-3 text-[14px] text-[#282829] outline-none transition focus:border-[#b9bdc7] focus:bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="behavior-response"
                      className="text-[14px] font-medium text-[#282829]"
                    >
                      The agent will
                    </label>
                    <textarea
                      id="behavior-response"
                      rows={5}
                      value={draft.behavior}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          behavior: event.target.value,
                        }))
                      }
                      className="w-full rounded-[8px] border border-[#dddfe3] bg-[#f1f2f4] px-4 py-3 text-[14px] text-[#282829] outline-none transition focus:border-[#b9bdc7] focus:bg-white"
                    />
                  </div>
                </div>
              ) : null}

              {step === 4 ? (
                <div className="space-y-5">
                  <div className="rounded-[16px] border border-[#cdfed5] bg-[#e9ffed] p-5">
                    <div className="flex items-start gap-3">
                      <div className="rounded-[8px] bg-[#e5fff9] p-2 text-[#077b6b]">
                        <IconCheck className="size-4" />
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[14px] font-medium text-[#044918]">
                            Ready to save
                          </p>
                          <p className="mt-1 text-[14px] leading-[1.5] text-[#044918]/80">
                            This behaviour will appear in the configuration list as a
                            structured, human-readable rule.
                          </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <p className="text-xs font-normal uppercase tracking-[0.18em] text-[#045343]/70">
                              Name
                            </p>
                            <p className="mt-2 text-[14px] text-[#01231c]">
                              {draft.name}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-normal uppercase tracking-[0.18em] text-[#045343]/70">
                              Category
                            </p>
                            <p className="mt-2 text-[14px] text-[#01231c]">
                              {draft.category}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-normal uppercase tracking-[0.18em] text-[#045343]/70">
                              When this applies
                            </p>
                            <p className="mt-2 text-[14px] text-[#01231c]">
                              {draft.condition}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-normal uppercase tracking-[0.18em] text-[#045343]/70">
                              The agent will
                            </p>
                            <p className="mt-2 text-[14px] text-[#01231c]">
                              {draft.behavior}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="border-t border-[#dddfe3] bg-white px-6 py-4 md:px-8">
          <div className="flex items-center justify-between gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <div className="flex items-center gap-3">
              {step > 1 ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (step === 2) {
                      setStep(1)
                      return
                    }

                    if (step === 3) {
                      setStep(2)
                      return
                    }

                    setStep(3)
                  }}
                >
                  Previous
                </Button>
              ) : null}

              {step === 2 && entryMode === 'describe' ? (
                <Button
                  onClick={applyInterpretation}
                  disabled={!canContinueFromStepOne}
                >
                  Next
                </Button>
              ) : null}

              {step === 3 ? (
                <Button
                  onClick={() => setStep(4)}
                  disabled={!canContinueFromStepThree}
                >
                  Next
                </Button>
              ) : null}

              {step === 4 ? (
                <Button onClick={handleSave}>
                  {mode === 'create' ? 'Save behaviour' : 'Save changes'}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
