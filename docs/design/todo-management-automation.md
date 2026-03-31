# Design: TODO Management Automation for Obsidian Vault

> Mode: feature
> Status: frame
> Created: 2026-03-31

## Purpose / Big Picture

This design defines how to manage project TODO items inside this Obsidian vault using agent skills and a recurring automation. The goal is to reduce manual TODO maintenance without introducing a second source of truth outside the vault.

## Problem Framing

### Goal

Define a minimal but complete TODO-management workflow for this vault that can add, remove, and summarize project TODOs reliably.

### Constraints

- The source of truth should remain inside this Obsidian vault.
- V1 should use a root-level TODO note as the SSOT candidate unless later evidence disproves it.
- Existing TODO representations are already distributed across project notes, kanban notes, and daily-note references.
- This session is design-only; no production automation or skill code is being written yet.

### Non-goals

- Reorganizing the entire vault information architecture.
- Designing a generic task system for every markdown note in the vault.

### Success Criteria

- [ ] The canonical TODO source is defined clearly enough that add/remove actions cannot target the wrong note by default.
- [ ] The hourly briefing has a defined scope, input set, and output format.
- [ ] The skill set is minimal but complete for the agreed first release.

## Evidence Gaps

| Gap | Status | Resolution |
|-----|--------|------------|
| Which note format is the canonical TODO source | resolved | User prefers a root-level TODO as SSOT candidate |
| Whether briefing should cover one project or the whole vault | open | Need user intent confirmation |
| Whether existing project-local TODO notes remain authoritative | open | Need user intent confirmation |
| Whether add/remove should operate on kanban columns only or generic checklist items too | open | Need user intent confirmation |

## Current System Model

The vault is organized as an Obsidian knowledge base, not a conventional application repository. Project work items currently appear in multiple shapes:

- project-local `TODO.md` kanban boards
- other kanban notes such as `Untitled Kanban.md`
- daily notes that link to project TODO notes

The current direction is to introduce a root-level TODO note as the canonical write surface. That only works if other task notes are either derived views, backlinks, or clearly non-authoritative artifacts.

## Alternatives Considered

### Alternative A: Project-local canonical TODO files

- Description: Each project owns one canonical `TODO.md` or kanban note, and skills read/write only there.
- Strengths: Clear ownership, low ambiguity, easy briefing scope.
- Weaknesses: Requires explicit per-project mapping and conventions.
- Trade-offs: Simpler automation in exchange for stricter structure.

### Alternative B: Vault-wide task search

- Description: Skills search all markdown notes for unchecked tasks and infer the relevant target note.
- Strengths: Flexible, works with current scattered structure.
- Weaknesses: Higher ambiguity, higher risk of wrong edits, harder removals.
- Trade-offs: Lower upfront structure in exchange for lower reliability.

## Chosen Direction

**Selected**: Tentative direction: root-level TODO SSOT

**Why**: The user explicitly wants an SSOT TODO at the root, which addresses the biggest reliability problem for add/remove automation.

**Rejected alternatives**:
- Project-local canonical TODO files: rejected for now because the user prefers one vault-level SSOT.

## Risks / Failure Modes

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Root TODO exists but local TODO notes also remain authoritative | Conflicting task states and duplicate edits | high | Decide authority boundary before implementation |
| Briefing scans too broadly | Noisy summaries that users ignore | medium | Constrain briefing scope explicitly |
| Mixed kanban/checklist formats | Add/remove behavior becomes inconsistent | medium | Choose supported formats for v1 |

## Validation Plan

- [ ] Confirm whether the root TODO is the only authoritative place for state changes.
- [ ] Confirm whether the hourly briefing is per-project or vault-wide.
- [ ] Compare the proposed skill set against the confirmed workflow and check for missing lifecycle actions.

## Rollback Strategy

Not defined yet because the writing surface and mutation scope are still undecided.

## Decision Log

| Turn | State | Decision | Rationale |
|------|-------|----------|-----------|
| 1 | charter | Tentative mode: feature | The request is to design new user-facing skills and an automation, not to debug or refactor an existing implementation. |
| 2 | charter | First gating question targets canonical write surface | Distributed TODO locations make add/remove design unsafe until one write target is constrained. |
| 3 | frame | Root-level TODO is the tentative SSOT direction | The user explicitly wants a root TODO as the single source of truth. |

## Assumption Ledger

| # | Assumption | Status | Source | Challenged? |
|---|-----------|--------|--------|-------------|
| 1 | This repository is an Obsidian vault rather than a typical app codebase | verified | Root structure and README | no |
| 2 | TODO data is currently distributed across multiple note types and paths | verified | Search results and sampled files | no |
| 3 | A reliable automation needs one clear source of truth per scope | likely | Repo evidence plus design inference | no |
| 4 | The requested work is best classified as feature design | verified | User request, mode playbook, charter review | yes turn 2 |
| 5 | V1 should probably constrain writes to one canonical task artifact instead of supporting every existing task location | likely | Socratic-partner review plus repo evidence | no |
| 6 | The root-level TODO should become the canonical write surface for v1 | likely | User answer in turn 3 | no |

## Open Questions

| Question | Reason | Owner / Next Step |
|----------|--------|-------------------|
| Should any project-local TODO or kanban note remain authoritative after root TODO is introduced? | Needs user intent | User to clarify |
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
