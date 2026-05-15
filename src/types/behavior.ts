export const behaviorCategories = [
  'Tone & Style',
  'Guardrails',
  'Clarification',
  'Routing',
  'Format',
  'Fallback',
] as const

export type BehaviorCategory = (typeof behaviorCategories)[number]

export type BehaviorStatus = 'default' | 'custom'
export type BehaviorLibraryLayer =
  | 'Default internal'
  | 'Default external'
  | 'Shared'
  | 'Custom'

export interface Behavior {
  id: string
  name: string
  category: BehaviorCategory
  libraryLayer: BehaviorLibraryLayer
  originalInstruction: string
  summary: string
  description: string
  condition: string
  behavior: string
  status: BehaviorStatus
  enabled: boolean
}

export interface BehaviorDraft {
  name: string
  instruction: string
  category: BehaviorCategory
  condition: string
  behavior: string
}
