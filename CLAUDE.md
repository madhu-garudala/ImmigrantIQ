Here's your updated CLAUDE.md:

markdown# ImmigrantIQ — Claude Code Context

## What This Is
An AI-powered immigration paperwork **agent** (not a chatbot) that walks
immigrants through which forms they need, what documents to gather, and what
form fields mean — without giving legal advice.

Built for the Vercel "Zero to Agent" Hackathon (May 2026).
The builder is an H1B visa holder — this project has a genuine personal WHY.

---

## The Core Distinction (Critical for Judges)
This is NOT a wrapper around Claude. It is a domain-specific agent that:
- **Interviews** the user with branching logic (each question depends on the last answer)
- **Fetches live data** from USCIS (real processing times, not hardcoded)
- **Produces structured UI output** — roadmap cards, timelines, checklists — not just prose
- **Generates a downloadable artifact** — a personalized PDF checklist the user takes away

A user on Claude.ai would have to know what to ask, interpret answers themselves,
and figure out next steps alone. ImmigrantIQ reasons about their specific situation
and hands them a complete, actionable game plan.

---

## The Problem We're Solving
Immigration paperwork is a maze. Wrong form, wrong fee, wrong timeline = denial.
Most people pay $300+/hr for attorneys for basic questions, or rely on outdated
Reddit threads. There's no trusted, structured guide that walks you through it.

---

## Core User Flow (Agentic, Not Conversational)

### Phase 1: Structured Intake with Branching Logic
DO NOT present a free-form chat box first. Guide the user through a structured
intake wizard:

Question 1: "What is your current visa status?"
→ H1B → ask about employer situation
→ H4 → ask about spouse's H1B stage
→ F1 → ask about OPT/STEM OPT status
→ Other → ask clarifying question

Each answer determines the next question. 3–5 questions max before roadmap generation.
Render this as a clean step-by-step wizard UI, not a chat interface.

### Phase 2: Agent Reasoning + Live Data Fetch
After intake, the agent:
1. Determines which of the 4 MVP scenarios applies
2. Calls the USCIS processing times page to fetch REAL current data
3. Constructs a structured roadmap object (not freeform text)

USCIS processing times URL: https://egov.uscis.gov/processing-times/

### Phase 3: Structured Roadmap UI
Render the roadmap as a beautiful UI — NOT as a chat bubble of text. Include:
- A visual timeline/stepper showing each stage
- Cards for each form needed (form number, purpose, fee, processing time)
- A collapsible "What does this mean?" section per step
- A progress tracker so users know where they are

### Phase 4: Document Checklist
Render a personalized checklist of every document needed.
Each item has a checkbox (client-side state only, no backend needed).
Include a "Download as PDF" button that generates a real PDF in the browser
using the `jsPDF` or `react-to-pdf` library.

### Phase 5: Form Field Explainer (Secondary Feature)
After the roadmap, user can ask "What does [field] mean on [form]?"
THIS is where the chat interface lives — as a secondary helper, not the main UI.
It should feel like a support assistant, not the primary product.

---

## MVP Scenarios (4 Only — Do Not Expand)
1. H1B extension (same employer)
2. H1B employer transfer (portability)
3. H4 EAD application
4. I-485 Adjustment of Status filing

---

## UI/UX Requirements (This Is Critical — Previous UI Was Poor)

### Overall Aesthetic
- **Professional, trustworthy, calm** — users are stressed about immigration
- Inspired by: Linear, Stripe, Notion — clean, modern, minimal
- NOT: colorful, playful, or startup-generic
- Color palette: Deep navy (#0F172A) + white + accent in teal (#0D9488)
- Typography: Inter or Geist (already in Next.js) — generous line height, readable
- Lots of whitespace — never cramped

### Landing Page (/)
Must include:
- A powerful headline. Suggestion: *"Immigration is hard enough. Your paperwork shouldn't be."*
- 2-line subheadline explaining what the agent does
- A single strong CTA button: "Get My Immigration Roadmap →"
- 3 trust signals below the fold:
  - "No legal advice — always consult an attorney"
  - "Free to use"
  - "Built for H1B, H4, F1, and Green Card applicants"
- Subtle background: dark navy with very faint grid or gradient
- NO stock photos, NO cheesy immigration imagery

### Intake Wizard (/chat or inline on landing)
- Full-screen step-by-step wizard
- One question at a time — large, clear, centered
- Answer options as large clickable cards (not dropdowns)
- Progress bar at the top (Step 1 of 4)
- Smooth fade/slide transitions between steps
- Back button always available

### Roadmap Page
- Split layout: left sidebar (step navigator) + right main content
- Each step is a card with:
  - Form number (bold, large)
  - Form name
  - Filing fee (badge)
  - Current USCIS processing time (live badge — green/yellow/red based on weeks)
  - "What you need to do" — 2-3 bullet points
  - Expandable "Learn more" section
- Visual timeline connector between steps (vertical line with nodes)

### Document Checklist
- Clean checklist UI with checkboxes
- Grouped by category (Identity Documents, Employment Documents, etc.)
- Sticky "Download PDF" button at bottom right
- Check items off in real time (local state)

### Disclaimer Banner
- Sticky at the very bottom of every page
- Subtle, not alarming — small text, muted color
- Text: "ImmigrantIQ provides general information only, not legal advice.
  Always consult a licensed immigration attorney for your specific situation."

---

## Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Animations:** Framer Motion (for wizard transitions)
- **AI Model:** claude-sonnet-4-5 via Anthropic API
- **PDF Generation:** react-to-pdf or jsPDF
- **Hosting:** Vercel (Hobby plan)
- **Database:** None (stateless, session-based only)
- **Auth:** None

---

## Project Structure
ImmigrantIQ/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── intake/
│   │   └── page.tsx              # Intake wizard
│   ├── roadmap/
│   │   └── page.tsx              # Roadmap + checklist results
│   └── api/
│       ├── chat/
│       │   └── route.ts          # Claude API — form field explainer
│       ├── roadmap/
│       │   └── route.ts          # Claude API — roadmap generation
│       └── uscis/
│           └── route.ts          # USCIS processing time fetcher
├── components/
│   ├── intake/
│   │   ├── IntakeWizard.tsx      # Step-by-step wizard shell
│   │   ├── QuestionCard.tsx      # Single question + answer options
│   │   └── ProgressBar.tsx       # Wizard progress indicator
│   ├── roadmap/
│   │   ├── RoadmapTimeline.tsx   # Visual timeline of steps
│   │   ├── FormCard.tsx          # Individual form card
│   │   └── ProcessingBadge.tsx   # Live USCIS time badge
│   ├── checklist/
│   │   ├── DocumentChecklist.tsx # Grouped checklist
│   │   └── DownloadButton.tsx    # PDF download trigger
│   ├── chat/
│   │   └── FormExplainer.tsx     # Secondary chat for field questions
│   └── shared/
│       ├── DisclaimerBanner.tsx  # Sticky legal disclaimer
│       ├── Navbar.tsx            # Simple top nav
│       └── CTAButton.tsx        # Reusable CTA
├── lib/
│   ├── prompts.ts                # All Claude system prompts
│   ├── scenarios.ts              # 4 MVP scenarios + form metadata
│   ├── uscis.ts                  # USCIS data fetching logic
│   └── pdf.ts                   # PDF generation helpers
├── types/
│   └── index.ts                  # Shared TypeScript types
├── CLAUDE.md                     # This file
└── .env.local                    # API keys (never commit)

---

## Agent Prompt Guidelines
The system prompts in `lib/prompts.ts` must:
- Be warm, clear, non-intimidating (users are often anxious)
- Never give legal advice — redirect warmly to an attorney
- Always return **structured JSON** for roadmap generation (not prose)
- Use plain English, never legalese
- Reference specific form numbers, USCIS links, current fees
- Every roadmap response must end with the disclaimer

### Roadmap API prompt must return this JSON shape:
```json
{
  "scenario": "H1B Extension",
  "summary": "2-sentence plain English summary of the situation",
  "steps": [
    {
      "order": 1,
      "title": "File Form I-129",
      "formNumber": "I-129",
      "formName": "Petition for Nonimmigrant Worker",
      "fee": 460,
      "processingTime": "3-6 months",
      "description": "Your employer files this on your behalf...",
      "documents": ["Passport copy", "Current I-94", "Employment letter"],
      "uscisLink": "https://www.uscis.gov/i-129"
    }
  ],
  "totalDocuments": [...],
  "importantDeadlines": [...],
  "disclaimer": "This is general information only..."
}
```

---

## Environment Variables
ANTHROPIC_API_KEY=your_key_here   # Set this in .env.local (never commit the actual key)

---

## Build Order (Follow This Exactly)
1. Scaffold Next.js with Tailwind + shadcn/ui + Framer Motion
2. Build landing page (/) with correct aesthetic
3. Build intake wizard (/intake) with branching logic
4. Build `/api/roadmap` route — Claude call returning structured JSON
5. Build `/api/uscis` route — fetch live USCIS processing times
6. Build roadmap page with timeline UI
7. Build document checklist + PDF download
8. Add form field explainer chat (secondary feature)
9. Add DisclaimerBanner to all pages
10. Final polish — animations, transitions, mobile responsiveness
11. Deploy to Vercel

---

## Key Constraints
- Stateless MVP — no database, no auth
- 4 scenarios only — no scope creep
- Structured JSON output from Claude — never render raw prose as the roadmap
- DisclaimerBanner on every single page, no exceptions
- Mobile responsive — judges may check on phone
- ANTHROPIC_API_KEY must never be committed to GitHub