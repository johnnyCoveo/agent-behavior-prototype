import type { Behavior, BehaviorDraft } from '@/types/behavior'

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1)

const trimSentence = (value: string) =>
  value.trim().replace(/\s+/g, ' ').replace(/[.]+$/, '')

export function interpretInstruction(instruction: string): Pick<
  BehaviorDraft,
  'condition' | 'behavior' | 'name'
> {
  const normalized = trimSentence(instruction)

  if (!normalized) {
    return {
      condition: 'Describe a situation where this behavior should apply.',
      behavior: 'Describe how the agent should respond.',
      name: 'New behavior',
    }
  }

  const whenMatch = normalized.match(
    /^(?:when|if)\s+(.+?)(?:,\s*|\s+then\s+)(.+)$/i,
  )

  if (whenMatch) {
    const [, rawCondition, rawBehavior] = whenMatch
    return {
      condition: capitalize(trimSentence(rawCondition)),
      behavior: capitalize(trimSentence(rawBehavior)),
      name: buildBehaviorName(rawBehavior),
    }
  }

  const beforeMatch = normalized.match(/^(.+?)\s+before\s+(.+)$/i)

  if (beforeMatch) {
    const [, rawCondition, rawBehavior] = beforeMatch
    return {
      condition: capitalize(trimSentence(rawCondition)),
      behavior: `Before responding, ${trimSentence(rawBehavior)}`,
      name: buildBehaviorName(rawBehavior),
    }
  }

  return {
    condition: 'A user request matches this instruction.',
    behavior: capitalize(normalized),
    name: buildBehaviorName(normalized),
  }
}

export function buildBehaviorName(source: string) {
  const cleaned = trimSentence(source)
    .replace(/^(ask|use|keep|route|format|respond|provide|avoid|decline)\s+/i, '')
    .split(' ')
    .slice(0, 4)
    .join(' ')

  return capitalize(cleaned || 'New behavior')
}

export function buildBehaviorSummary(condition: string, behavior: string) {
  return `When ${condition.charAt(0).toLowerCase()}${condition.slice(
    1,
  )}, the agent will ${behavior.charAt(0).toLowerCase()}${behavior.slice(1)}.`
}

export function buildBehaviorDescription(condition: string, behavior: string) {
  return `${buildBehaviorSummary(condition, behavior)} This behavior helps keep responses consistent in that situation.`
}

export function createBehaviorFromDraft(
  draft: BehaviorDraft,
  status: Behavior['status'],
  existingId?: string,
): Behavior {
  const condition = trimSentence(draft.condition)
  const behavior = trimSentence(draft.behavior)
  const name = trimSentence(draft.name) || buildBehaviorName(draft.behavior)

  return {
    id:
      existingId ??
      `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
    name,
    category: draft.category,
    libraryLayer: 'Custom',
    originalInstruction: trimSentence(draft.instruction),
    condition,
    behavior,
    summary: buildBehaviorSummary(condition, behavior),
    description: buildBehaviorDescription(condition, behavior),
    status,
    enabled: true,
  }
}

export function mockBehaviorTestResult(behavior: Behavior, query: string) {
  const normalizedQuery = query.toLowerCase()
  const conditionWords = behavior.condition
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(' ')
    .filter((word) => word.length > 4)

  const matchedTerms = conditionWords.filter((word) =>
    normalizedQuery.includes(word),
  )

  const triggered =
    matchedTerms.length > 0 ||
    /help|how|what|can you|please|not sure|unclear|sensitive/i.test(query)

  return {
    triggered,
    expectedBehavior: behavior.behavior,
    generatedResponse: triggered
      ? `Mock response: The agent would follow this behavior by ${behavior.behavior.charAt(
          0,
        ).toLowerCase()}${behavior.behavior.slice(1)}`
      : 'Mock response: This input would likely follow the default agent behavior instead.',
    result: triggered ? 'Pass' : 'Fail',
  } as const
}
