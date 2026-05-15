import {
  IconArrowRight,
  IconEye,
  IconPencil,
  IconPower,
} from '@tabler/icons-react'

import { CategoryBadge, StatusBadge } from '@/components/behavior-badges'
import { Button } from '@/components/ui/button'
import type { Behavior } from '@/types/behavior'

interface BehaviorListProps {
  behaviors: Behavior[]
  onView: (behavior: Behavior) => void
  onEdit: (behavior: Behavior) => void
  onToggle: (behaviorId: string) => void
}

export function BehaviorList({
  behaviors,
  onView,
  onEdit,
  onToggle,
}: BehaviorListProps) {
  return (
    <div className="overflow-hidden rounded-[8px] border border-[#dddfe3] bg-white">
      <div className="hidden grid-cols-[1.2fr,0.95fr,1.8fr,0.8fr,1fr] gap-4 border-b border-[#dddfe3] px-5 py-4 text-xs font-medium uppercase tracking-[0.16em] text-[#5d7289] md:grid">
        <span>Name</span>
        <span>Category</span>
        <span>Summary</span>
        <span>Status</span>
        <span>Actions</span>
      </div>

      <div className="divide-y divide-[#dddfe3]">
        {behaviors.map((behavior) => (
          <article
            key={behavior.id}
            className="px-5 py-4 transition hover:bg-[#f9f9fa]"
          >
            <div className="grid gap-4 md:grid-cols-[1.2fr,0.95fr,1.8fr,0.8fr,1fr] md:items-center">
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => onView(behavior)}
                  className="flex items-center gap-2 text-left text-[16px] font-normal text-[#282829] transition hover:text-[#077b6b]"
                >
                  <span>{behavior.name}</span>
                  <IconArrowRight className="size-4 text-[#b9bdc7]" />
                </button>
                {!behavior.enabled ? (
                  <span className="inline-flex rounded-full border border-[#dddfe3] bg-[#f1f2f4] px-2.5 py-1 text-xs font-normal text-[#676d7a]">
                    Disabled
                  </span>
                ) : null}
              </div>

              <div>
                <CategoryBadge category={behavior.category} />
              </div>

              <p className="text-[14px] leading-5 text-[#616870]">{behavior.summary}</p>

              <div>
                <StatusBadge status={behavior.status} />
              </div>

              <div className="flex flex-wrap items-center gap-2 md:justify-end">
                <Button
                  variant="outline"
                  onClick={() => onView(behavior)}
                  className="border-[#dddfe3] bg-white text-[#282829] hover:bg-[#f1f2f4]"
                >
                  <IconEye className="size-4" />
                  View
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onEdit(behavior)}
                  className="border-[#dddfe3] bg-white text-[#282829] hover:bg-[#f1f2f4]"
                >
                  <IconPencil className="size-4" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => onToggle(behavior.id)}
                  className="text-[#616870] hover:bg-[#f1f2f4] hover:text-[#282829]"
                >
                  {behavior.enabled ? (
                    <>
                      <IconPower className="size-4" />
                      Disable
                    </>
                  ) : (
                    <>
                      <IconPower className="size-4" />
                      Enable
                    </>
                  )}
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
