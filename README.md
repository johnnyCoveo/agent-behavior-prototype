# Agent Behavior Prototype

An exploration of an agent behavior control system for defining, reviewing, and managing how an AI agent should behave.

This prototype focuses on the idea that users should be able to describe the behavior they want in natural language, or choose from a library of reusable behaviors, and then manage those behaviors through a customer-facing admin experience.

## What this prototype explores

- A `Behaviour` management surface with:
  - overall behaviour metrics
  - a flat, scannable list of behaviours
  - per-behaviour details and diagnostics
- A behavior creation flow that lets users:
  - describe what they want
  - browse a behavior library
  - refine the system translation before saving
- A lower-fidelity wireframe mode and a more polished mode
- A version switcher for comparing prototype directions

## Current concepts in the prototype

- Natural-language behaviour authoring
- Library-based behaviour discovery
- Original ask vs. system translation
- Behaviour diagnostics and testing
- Customer-facing abstraction over internal behavior layers

## Tech stack

- React
- Vite
- TypeScript
- Tailwind CSS

## Local development

```bash
cd "/Users/southisackjohnnykounlavout/Documents/prototypes/agent behavior"
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

Then open [http://localhost:5173/](http://localhost:5173/).

## Theme and version switching

The prototype includes:

- `Wireframe` and `Polished` visual modes
- `Current` and `Version 1` prototype versions

These can be switched from the bottom-left controls in the app.

## Deployment

Live prototype:

- [https://agent-behavior-prototype.vercel.app](https://agent-behavior-prototype.vercel.app)

## Notes

This is a product prototype, not production-ready code. The goal is to explore information architecture, interaction design, and product framing for behavior management in AI agents.
