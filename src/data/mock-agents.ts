import type { Agent } from '@/types/agent'

export const mockAgents: Agent[] = [
  {
    id: 'woods-secured',
    name: 'Woods - Secured',
    description: 'Search agent tuned for secure support and policy-sensitive help.',
    type: 'Search Agent',
    lastModified: 'Mar 31, 2026 at 11:47 AM',
    status: 'active',
  },
  {
    id: 'lbergeron-test-agent',
    name: 'LBergeron Test Agent',
    description: 'General QA and experimentation agent for search experiences.',
    type: 'Search Agent',
    lastModified: 'Apr 1, 2026 at 11:32 AM',
    status: 'active',
  },
  {
    id: 'yanou',
    name: 'Yanou',
    description: 'Customer-facing search agent with a concise answer style.',
    type: 'Search Agent',
    lastModified: 'Apr 14, 2026 at 11:01 AM',
    status: 'draft',
  },
]
