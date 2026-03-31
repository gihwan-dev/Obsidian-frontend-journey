# Design: TODO Management Automation for Obsidian Vault

> Mode: feature
> Status: frame
> Created: 2026-03-31

## Purpose / Big Picture

This design defines how to manage project TODO items inside this Obsidian vault using agent skills and a recurring automation. The goal is to reduce manual TODO maintenance without introducing a second source of truth outside the vault.

## Problem Framing

### Goal

Define a minimal but complete TODO-management workflow for this vault that can add, remove, and summarize project TODOs reliably without creating duplicate authorities across root and project boards.

### Constraints

- The source of truth should remain inside this Obsidian vault.
- Existing TODO representations are already distributed across project notes, kanban notes, and daily-note references.
- The workflow should allow task state to be updated where the user is already working, not only from a detached central list.
- Project kanban notes should own their own task lists.
- The root board should link to project-owned task boards rather than duplicate their task state.
- The root board in v1 should remain read-only and navigation-oriented.
- The root hub should read only explicitly onboarded project boards rather than scanning the wider vault.
- This session is design-only; no production automation or skill code is being written yet.

### Non-goals

- Reorganizing the entire vault information architecture.
- Designing a generic task system for every markdown note in the vault.
- Enforcing a single vault-wide task SSOT if that breaks project-local workflow.

### Success Criteria

- [ ] The canonical TODO source is defined clearly enough that add/remove actions cannot target the wrong note by default.
- [ ] The hourly briefing has a defined scope, input set, and output format.
- [ ] The skill set is minimal but complete for the agreed first release.

## Evidence Gaps

| Gap | Status | Resolution |
|-----|--------|------------|
| Which note format is the canonical TODO source | resolved | Canonical ownership is per-project kanban, not a vault-wide root TODO |
| Whether briefing should cover one project or the whole vault | open | Need user intent confirmation |
| Whether the root board is read-only/navigation-only or supports task mutations | resolved | User wants it to be a read-only/navigation hub in v1 |
| How the root hub decides which project boards are in scope | resolved | User wants root-hub-driven explicit scope, not wider-vault discovery |
| Whether project onboarding is explicit registration or implied by a standard project pattern | resolved | User prefers standard-pattern-based onboarding, not explicit registration |
| What exact project pattern counts as onboarded | open | Strong candidate found: project-root direct-child `TODO.md`, but needs user validation |
| Whether add/remove should operate on kanban columns only or generic checklist items too | open | Need user intent confirmation |

## Current System Model

The vault is organized as an Obsidian knowledge base, not a conventional application repository. Project work items currently appear in multiple shapes:

- project-local `TODO.md` kanban boards
- other kanban notes such as `Untitled Kanban.md`
- daily notes that link to project TODO notes

The current direction is that each project kanban owns its own tasks. The root board is no longer the vault-wide task SSOT; it is a read-only higher-level surface that links to project boards considered onboarded by following a standard project pattern. Repository evidence suggests the strongest candidate pattern is a project folder with a direct child `TODO.md` kanban board, while deeper `TODO.md` files represent sub-scope boards that the root hub should ignore. This keeps editing close to the work context and avoids duplicate task ownership, but the pattern still needs explicit confirmation.

## Alternatives Considered

### Alternative A: Project-local canonical TODO files

- Description: Each project owns one canonical `TODO.md` or kanban note, and skills read/write only there.
- Strengths: Clear ownership, low ambiguity, easy briefing scope.
- Weaknesses: Requires explicit per-project mapping and conventions.
- Trade-offs: Simpler automation in exchange for stricter structure.

### Alternative B: Root-level vault SSOT

- Description: A root TODO owns the canonical task state for the whole vault.
- Strengths: Single control point, simpler global briefing logic.
- Weaknesses: Conflicts with in-context project management and creates detached workflow.
- Trade-offs: Strong global consistency in exchange for weaker project-local ergonomics.

### Alternative C: Root board as project index

- Description: Project kanbans own tasks; the root board links to them and optionally summarizes them.
- Strengths: Preserves local workflow and avoids duplicate task ownership.
- Weaknesses: Root board may become a weak dashboard unless its read scope is constrained clearly.
- Trade-offs: Better local usability in exchange for less centralized control.

## Chosen Direction

**Selected**: Tentative direction: project-owned kanbans plus read-only root index board

**Why**: The user explicitly rejected a vault-wide SSOT as impractical and wants project kanbans to remain the task owners.

**Rejected alternatives**:
- Root-level vault SSOT: rejected because it conflicts with in-context project task management.

## Risks / Failure Modes

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| The onboarding project pattern is underspecified | Briefings and overview become noisy, incomplete, or stale | high | Define the exact structural contract for onboarded project boards |
| Briefing scans too broadly | Noisy summaries that users ignore | medium | Constrain briefing scope explicitly |
| Mixed kanban/checklist formats | Add/remove behavior becomes inconsistent | medium | Choose supported formats for v1 |

## Validation Plan

- [ ] Confirm the exact structural pattern that makes a project board onboarded.
- [ ] Confirm whether the hourly briefing is per-project or vault-wide.
- [ ] Compare the proposed skill set against the confirmed workflow and check for missing lifecycle actions.

## Rollback Strategy

Not defined yet because the exact onboarding pattern for project boards is still undecided.

## Decision Log

| Turn | State | Decision | Rationale |
|------|-------|----------|-----------|
| 1 | charter | Tentative mode: feature | The request is to design new user-facing skills and an automation, not to debug or refactor an existing implementation. |
| 2 | charter | First gating question targets canonical write surface | Distributed TODO locations make add/remove design unsafe until one write target is constrained. |
| 3 | frame | Root-level TODO is the tentative SSOT direction | The user explicitly wants a root TODO as the single source of truth. |
| 4 | frame | In-context kanban updates are a required workflow property | The user does not want task state management to be forced through a detached central list. |
| 5 | frame | Vault-wide SSOT is dropped in favor of project-owned task boards plus a root index | The user decided each project kanban should own tasks and the root should hold links only. |
| 6 | frame | Root board is read-only/navigation-only in v1 | This avoids conflicting state with project-owned kanbans. |
| 7 | frame | Root hub scope should come from explicitly onboarded project boards | The user wants the root hub to be the read boundary and expects a setup procedure. |
| 8 | frame | Standard project pattern is preferred over explicit registration for onboarding | The user wants pattern-based onboarding rather than a separate registration step. |
| 9 | frame | Recommended onboarding signal is a project-root direct-child `TODO.md` | Real project folders repeatedly use that shape, while nested `TODO.md` files appear to be sub-boards. |

## Assumption Ledger

| # | Assumption | Status | Source | Challenged? |
|---|-----------|--------|--------|-------------|
| 1 | This repository is an Obsidian vault rather than a typical app codebase | verified | Root structure and README | no |
| 2 | TODO data is currently distributed across multiple note types and paths | verified | Search results and sampled files | no |
| 3 | A reliable automation needs one clear source of truth per scope | likely | Repo evidence plus design inference | no |
| 4 | The requested work is best classified as feature design | verified | User request, mode playbook, charter review | yes turn 2 |
| 5 | V1 should probably constrain writes to one canonical task artifact instead of supporting every existing task location | likely | Socratic-partner review plus repo evidence | no |
| 6 | The root-level TODO should become the canonical write surface for v1 | rejected | User reversed this in turn 5 | yes turn 5 |
| 7 | Direct manipulation in project kanban and SSOT can coexist only if both reference the same underlying task entity | rejected | User chose separate project-owned task lists instead | yes turn 5 |
| 8 | The root board should be modeled as an index or overview, not a global task owner | likely | User answer in turn 5 plus Socratic-partner review | no |
| 9 | The root board should remain read-only in v1 | verified | User answer in turn 6 | no |
| 10 | Explicitly onboarded project boards define the root hub read boundary | likely | User answer in turn 7 plus Socratic-partner review | no |
| 11 | Project onboarding may be an ongoing lifecycle, not just one-time bootstrap | likely | User mention of root setup plus Socratic-partner review | no |
| 12 | Standard project structure should be enough to treat a project board as onboarded | likely | User answer in turn 8 | no |
| 13 | The repository does not currently expose a concrete project template that defines onboarding | verified | Searched `10-Projects/Exem/05-Templates` and sampled project paths | no |
| 14 | A project-root direct-child `TODO.md` is the best current onboarding signal | likely | Observed in `Exem/01-Projects/*/TODO.md` and `Personal/Codex 멀티 에이전트 모니터링/TODO.md` | no |
| 15 | Nested `TODO.md` files under project subfolders should be treated as local sub-boards, not root-hub entries | likely | Observed nested `개발/.../TODO.md` boards under existing projects | no |
| 16 | Nonstandard top-level board names like `Untitled Kanban.md` should stay out of root-hub scope until standardized | likely | `AI Setup/Untitled Kanban.md` is an outlier against the repeated `TODO.md` pattern | no |

## Open Questions

| Question | Reason | Owner / Next Step |
|----------|--------|-------------------|
| Should v1 define onboarded projects as folders with a direct child `TODO.md`, excluding nested `TODO.md` and nonstandard board names until they are normalized? | Needs user validation | User to confirm |
| Which task formats are officially supported in v1? | Needed to define mutation rules | User to clarify |

## Quality Gate Result

**Verdict**: return-and-fix

| # | Criterion | Score | Note |
|---|-----------|-------|------|
| 1 | Goal clarity | weak | Need target scope confirmation |
| 2 | Success criteria | weak | Need explicit first-release boundary |
| 3 | System model | weak | Need canonical task model |
| 4 | Alternatives compared | weak | Only early draft |
| 5 | Decision reasoning | weak | No confirmed decision yet |
| 6 | Failure modes | weak | Early risk list only |
| 7 | Assumption ledger | pass | Initial ledger created |
| 8 | Rollback strategy | fail | Not possible before scope decision |
| 9 | Validation plan | weak | Needs sharper acceptance checks |
| 10 | Open questions | pass | Critical questions captured |
