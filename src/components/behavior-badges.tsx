import { IconShieldCheck, IconSparkles } from '@tabler/icons-react'

import { cn } from '@/lib/utils'
import type {
  BehaviorCategory,
  BehaviorLibraryLayer,
  BehaviorStatus,
} from '@/types/behavior'

const categoryStyles: Record<BehaviorCategory, string> = {
  'Tone & Style': 'border-[#d5defe] bg-[#f8f9ff] text-[#063c82]',
  Guardrails: 'border-[#fdd5d5] bg-[#fff8f8] text-[#7e0f17]',
  Clarification: 'border-[#fff2c0] bg-[#fff9e5] text-[#936400]',
  Routing: 'border-[#e7d6f5] bg-[#fbf8fd] text-[#592676]',
  Format: 'border-[#cdfed5] bg-[#f2fff9] text-[#044918]',
  Fallback: 'border-[#dddfe3] bg-[#f9f9fa] text-[#3b3e46]',
}

const libraryLayerStyles: Record<BehaviorLibraryLayer, string> = {
  'Default internal': 'border-[#dddfe3] bg-[#f1f2f4] text-[#282829]',
  'Default external': 'border-[#d5defe] bg-[#f8f9ff] text-[#063c82]',
  Shared: 'border-[#cdfed5] bg-[#f2fff9] text-[#044918]',
  Custom: 'border-[#fff2c0] bg-[#fff9e5] text-[#936400]',
}

export function CategoryBadge({ category }: { category: BehaviorCategory }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium',
        categoryStyles[category],
      )}
    >
      {category}
    </span>
  )
}

export function StatusBadge({ status }: { status: BehaviorStatus }) {
  const isDefault = status === 'default'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium',
        isDefault
          ? 'border-[#dddfe3] bg-[#f1f2f4] text-[#282829]'
          : 'border-[#dddfe3] bg-white text-[#676d7a]',
      )}
    >
      {isDefault ? <IconShieldCheck className="size-3.5" /> : <IconSparkles className="size-3.5" />}
      {isDefault ? 'Default' : 'Custom'}
    </span>
  )
}

export function LibraryLayerBadge({ layer }: { layer: BehaviorLibraryLayer }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium',
        libraryLayerStyles[layer],
      )}
    >
      {layer}
    </span>
  )
}
