import { useEffect, useMemo, useState } from 'react'
import { IconCheck, IconSparkles, IconWand, IconX } from '@tabler/icons-react'

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

export function AddBehaviorModalV1({
  open,
  mode,
  behavior,
  onClose,
  onSave,
}: AddBehaviorModalProps) {
  const [step, setStep] = useState(1)
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
      setStep(3)
      return
    }

    setDraft(emptyDraft)
    setStep(1)
  }, [behavior, open])

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="relative max-h-[92vh] w-full max-w-4xl overflow-auto rounded-[24px] border border-[#dddfe3] bg-[#f9f9fa] p-6 shadow-[0px_12px_12px_-7px_rgba(0,0,0,0.04),0px_28px_23px_-7px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.05)] md:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 inline-flex size-9 items-center justify-center rounded-full border border-[#dddfe3] bg-white text-[#676d7a] transition hover:text-[#282829]"
          aria-label="Close behaviour modal"
        >
          <IconX className="size-4" />
        </button>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#dddfe3] bg-white px-3 py-1 text-xs font-medium text-[#676d7a]">
              <IconSparkles className="size-3.5 text-[#077b6b]" />
              {stepLabel}
            </div>
            <div className="space-y-2">
              <h2 className="text-[24px] font-medium leading-[1.33] text-[#282829]">
                Shape agent behaviour in plain language
              </h2>
              <p className="max-w-2xl text-[14px] leading-[1.5] text-[#676d7a]">
                Describe what should happen, review how the system interprets it,
                then refine the behaviour before saving it.
              </p>
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-4">
            {[1, 2, 3, 4].map((value) => (
              <div
                key={value}
                className={`rounded-[12px] border px-4 py-3 text-sm ${
                  step >= value
                    ? 'border-[#077b6b] bg-white text-[#282829]'
                    : 'border-[#dddfe3] bg-white text-[#676d7a]'
                }`}
              >
                <span className="text-[12px] uppercase tracking-[0.18em]">
                  Step {value}
                </span>
                <div className="mt-1 font-medium">
                  {
                    {
                      1: 'Describe it',
                      2: 'Interpret it',
                      3: 'Refine it',
                      4: 'Save it',
                    }[value]
                  }
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[16px] border border-[#dddfe3] bg-white p-5 md:p-6">
            {step === 1 ? (
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
                    rows={6}
                    placeholder="When users ask vague questions, ask a clarifying question before answering."
                    className="w-full rounded-[8px] border border-[#dddfe3] bg-[#f1f2f4] px-4 py-3 text-[14px] text-[#282829] outline-none transition focus:border-[#b9bdc7] focus:bg-white"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!canContinueFromStepOne}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-6">
                <div className="flex items-start gap-3 rounded-[12px] border border-[#fff2c0] bg-[#fff9e5] p-4 text-[14px] text-[#936400]">
                  <IconWand className="mt-0.5 size-4 shrink-0" />
                  <p>
                    This is a mocked interpretation for now. In production, this
                    step would be generated and validated by the behaviour engine.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[8px] border border-[#dddfe3] bg-[#f9f9fa] p-5">
                    <p className="text-xs font-normal uppercase tracking-[0.18em] text-[#5d7289]">
                      When this applies
                    </p>
                    <p className="mt-3 text-[14px] leading-[1.5] text-[#282829]">
                      {interpretation.condition}
                    </p>
                  </div>
                  <div className="rounded-[8px] border border-[#dddfe3] bg-[#f9f9fa] p-5">
                    <p className="text-xs font-normal uppercase tracking-[0.18em] text-[#5d7289]">
                      The agent will
                    </p>
                    <p className="mt-3 text-[14px] leading-[1.5] text-[#282829]">
                      {interpretation.behavior}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={applyInterpretation}>Use this interpretation</Button>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="grid gap-4">
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

                <div className="flex items-center justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(4)}
                    disabled={!canContinueFromStepThree}
                  >
                    Review behaviour
                  </Button>
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

                <div className="flex items-center justify-between">
                  <Button variant="outline" onClick={() => setStep(3)}>
                    Back
                  </Button>
                  <Button onClick={handleSave}>
                    {mode === 'create' ? 'Save behaviour' : 'Save changes'}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
