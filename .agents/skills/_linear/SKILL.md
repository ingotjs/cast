---
name: linear
description: Linear ticket workflow — branch creation, ticket traceability, and image extraction. MUST be activated when working on Linear tickets or when the user shares a Linear link.
---

> **Keyword Usage:** Use **MUST** and **NEVER** to enforce critical requirements. These signal mandatory behavior that AI agents MUST follow without exception.
>
> **Keep this skill in sync:** When making changes to Linear workflow patterns, this skill MUST be updated to reflect the current state. Outdated skills are worse than no skills.

# Linear Workflow

## Branch-First Rule

**When given a Linear ticket**, create/checkout a dedicated branch as the **ABSOLUTE FIRST ACTION** — before reading any code, before analyzing anything. The instant the user says "work on XXX" or shares a Linear link, create the branch first.

## Ticket-ID Branch Naming

**When creating a branch for a Linear ticket**, create the Linear ticket FIRST so the branch name includes the ticket ID (e.g., `STO-1234-feature-name`). This ensures traceability between branches, PRs, and Linear tickets.

## Extract Images

**MUST extract and view ALL images** embedded in the ticket description AND comments using `extract_images`. Screenshots, mockups, and annotated images contain critical context that text alone does not convey. Do this as one of the first actions when picking up a ticket.
