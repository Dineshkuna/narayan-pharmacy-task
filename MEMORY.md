# MEMORY.md — AI Workflow & Decision Log

## Project: narayan-pharmacy-task
This file documents the thought process, architectural decisions, and AI-assisted development workflow.

---

## Phase 1: Understanding the Task

**Initial read:** Two screens — prescription form + list. Claude API mandatory. MongoDB chosen over SQLite for scalability.

**Key constraints identified:**
- Skip AI call if only 1 drug (edge case explicitly required)
- Cache same drug combinations in DB — don't re-call Claude
- No raw JSON in UI — format the result cleanly
- Pharmacy-specific prompt required (not generic "check these drugs")

---

## Phase 2: Architecture Decisions

### Decision 1: Node.js + Express over Django
**Reason:** Team has stronger Node.js knowledge. Express is lightweight for a focused 2-screen app. Same REST API surface either way.

### Decision 2: MongoDB over SQLite/PostgreSQL
**Reason:** Flexible schema for `interactionResult` (array of details, recommendations). No need for rigid relational joins — prescriptions are document-shaped data.

### Decision 3: Drug Cache Key Strategy
**Approach:** Sort drug names alphabetically → join with `|` → store as `drugCacheKey` on the Prescription document.

**Why sorted?** `Metformin|Warfarin` and `Warfarin|Metformin` are the same interaction. Sorting ensures consistent cache hits regardless of entry order.

**Trade-off:** This caches by drug *names only*, not dosages. A future improvement would include dosages in the key for more precise caching.

### Decision 4: Claude Prompt Design
**First draft (rejected):** "Check if these drugs interact: {list}"
— Too generic, doesn't leverage pharmacy context.

**Final prompt strategy:**
- Framed as "clinical pharmacist AI assistant reviewing before dispensing"
- Explicit JSON schema with field names and allowed values
- Severity guide with clinical definitions (Mild/Moderate/Severe)
- Instruction to be specific to actual drug names provided
- `claude-opus-4-5` model chosen for reliability of structured JSON output

### Decision 5: Next.js App Router (Server Components)
**Approach:** List page and detail page are server components — they fetch data directly. Only the prescription form is a client component (needs interactivity: dynamic drug rows, loading state).

**Benefit:** Cleaner data fetching, no need for `useEffect` on read-only pages.

---

## Phase 3: Edge Cases Handled

| Case | Handling |
|---|---|
| 1 drug entered | Skip Claude call, return "No interaction" result |
| Claude API down | Catch error, return 502 with user-friendly message |
| Claude returns malformed JSON | Catch SyntaxError, return 500 with message |
| Same drug combo submitted again | DB cache hit, reuse result without API call |
| Severity value unexpected | Validate against enum, default to "None" |

---

## Phase 4: What I Would Add Next

- Dosage-aware cache key (include dosages in `drugCacheKey`)
- Pagination on the prescriptions list
- PDF export of prescription + interaction report
- Auth layer (pharmacist login) — explicitly out of scope for this task
- Unit tests for `claudeService.js` with mocked Anthropic responses
