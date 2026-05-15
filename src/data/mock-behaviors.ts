import type { Behavior } from '@/types/behavior'

export const initialBehaviors: Behavior[] = [
  {
    id: 'clarify-vague-requests',
    name: 'Clarify unclear requests',
    category: 'Clarification',
    libraryLayer: 'Default external',
    originalInstruction:
      'When users ask vague questions, ask a clarifying question before answering.',
    summary:
      'When a request is missing key context, the agent pauses and asks a short follow-up question before answering.',
    description:
      'Helps the agent avoid guessing when users ask broad or underspecified questions.',
    condition: 'A user asks a vague question without enough context to answer confidently.',
    behavior:
      'Ask one clarifying question that helps narrow the request before providing an answer.',
    status: 'default',
    enabled: true,
  },
  {
    id: 'answer-with-citations',
    name: 'Cite trusted sources',
    category: 'Format',
    libraryLayer: 'Shared',
    originalInstruction:
      'When the answer relies on retrieved content, include concise source citations the client can review.',
    summary:
      'Answers grounded in retrieved content include lightweight citations so users can verify the response.',
    description:
      'Creates a shared behavior that balances trust, readability, and traceability for client-facing answers.',
    condition:
      'The agent answers a question using retrieved enterprise content or policy documents.',
    behavior:
      'Reference the supporting source in a concise way and avoid unsupported claims.',
    status: 'default',
    enabled: true,
  },
  {
    id: 'steady-executive-tone',
    name: 'Use a calm executive tone',
    category: 'Tone & Style',
    libraryLayer: 'Custom',
    originalInstruction:
      'Keep the tone calm, executive, and reassuring without sounding robotic.',
    summary:
      'Responses stay polished, direct, and reassuring without sounding robotic or overly formal.',
    description:
      'Keeps the assistant aligned with a concise, high-trust communication style.',
    condition: 'The agent is responding to a normal user request.',
    behavior:
      'Write in a calm, confident tone with short paragraphs and practical language.',
    status: 'custom',
    enabled: true,
  },
  {
    id: 'refuse-sensitive-data',
    name: 'Protect sensitive information',
    category: 'Guardrails',
    libraryLayer: 'Default external',
    originalInstruction:
      'Do not share sensitive personal or account information, and redirect users to a safer next step.',
    summary:
      'The agent avoids sharing private data or helping with requests that would expose protected information.',
    description:
      'Prevents risky disclosures while still redirecting the user toward safe alternatives.',
    condition:
      'A request involves sensitive personal data, account secrets, or instructions that could expose protected information.',
    behavior:
      'Politely decline the unsafe part of the request and offer a safer next step when possible.',
    status: 'default',
    enabled: false,
  },
  {
    id: 'route-regulated-requests',
    name: 'Escalate regulated requests',
    category: 'Routing',
    libraryLayer: 'Shared',
    originalInstruction:
      'When a user asks for help on regulated or high-risk topics, route them to the right assisted flow instead of answering directly.',
    summary:
      'The agent identifies high-risk requests and routes the user to a safer supported workflow.',
    description:
      'Supports a shared escalation pattern that customers can inspect while Coveo still provides the core handling logic.',
    condition:
      'A request touches regulated, high-risk, or policy-sensitive subject matter that needs a managed flow.',
    behavior:
      'Escalate the user into the supported workflow and explain the next step clearly.',
    status: 'default',
    enabled: true,
  },
]
