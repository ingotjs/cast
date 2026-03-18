---
name: skill-creation
description: Guidelines for creating and maintaining custom skills in this project. Use when creating a new skill, modifying an existing skill, or reviewing skill quality. Covers naming conventions, required structure, keyword enforcement, and auto-update instructions.
---

> **Keyword Usage:** Use **MUST** and **NEVER** to enforce critical requirements. These signal mandatory behavior that AI agents MUST follow without exception.
>
> **Keep this skill in sync:** When the skill creation conventions change, this skill MUST be updated. When creating or reviewing skills, this skill MUST be the reference.

# Skill Creation Guide

Custom skills live in `.agents/skills/` and provide domain-specific context that loads on-demand instead of bloating CLAUDE.md.

## Naming Conventions

- Custom (project-specific) skills MUST be prefixed with `_` (e.g., `_auth`, `_frontend`, `_e2e-testing`)
- Installed skills from registries (e.g., `tanstack-start-best-practices`, `shadcn`) MUST NOT have the `_` prefix
- This makes it immediately obvious which skills are ours vs. third-party

## Required Structure

Every custom skill MUST have this structure:

```
.agents/skills/_my-skill/
└── SKILL.md
```

### SKILL.md Template

Every custom `_` skill MUST follow this template:

```markdown
---
name: my-skill
description: One-line description of what this skill covers and when to activate it. MUST include trigger conditions.
---

> **Keyword Usage:** Use **MUST** and **NEVER** to enforce critical requirements. These signal mandatory behavior that AI agents MUST follow without exception.
>
> **Keep this skill in sync:** When making changes to [domain this skill covers], this skill MUST be updated to reflect the current state. Outdated skills are worse than no skills.

# Skill Title

[Content here]
```

### Required Elements

1. **YAML frontmatter** — `name` and `description` fields. The `description` MUST clearly state when the skill should be triggered.
2. **Keyword Usage blockquote** — the standard `MUST`/`NEVER` enforcement reminder. MUST be the first content after the frontmatter.
3. **Keep in sync blockquote** — the auto-update instruction specific to this skill's domain. MUST immediately follow the keyword usage blockquote.
4. **Heading** — clear title matching the skill's purpose.
5. **Content** — domain-specific guidance, patterns, key files, and rules.

## Writing Rules

### MUST/NEVER Enforcement

- Use **MUST** for mandatory requirements that agents MUST follow without exception
- Use **NEVER** for prohibited actions that agents MUST NOT take under any circumstance
- NEVER use weak language ("should", "consider", "try to") for critical rules — use **MUST** or **NEVER**
- Reserve MUST/NEVER for genuinely critical rules — overuse dilutes their impact
- Descriptive/informational content does NOT need MUST/NEVER

### Auto-Update Instruction

Every custom skill MUST include the "Keep this skill in sync" blockquote. The content MUST be specific to the skill's domain. Examples:

- `_auth`: "When making changes to auth config, plugins, session handling, or auth-related components, this skill MUST be updated."
- `_frontend`: "When making changes to frontend patterns, component conventions, or UI guidelines, this skill MUST be updated."
- `_database`: "When making changes to schema, migrations, ORM config, or API procedures, this skill MUST be updated."

### Content Guidelines

- Start with a one-line summary of the tech/system
- Include a **Key Files** table mapping what → where
- Include concrete code patterns and examples where helpful
- NEVER duplicate information that's already in CLAUDE.md — reference it instead
- Keep skills focused on their domain — NEVER let a skill grow into a second CLAUDE.md
- Skills MUST be kept up to date — an outdated skill is worse than no skill

## Registering a New Skill

After creating a skill:

1. **Register in CLAUDE.md's auto-invoke skills table:**

```markdown
| `_my-skill` | Trigger description for when this skill should activate |
```

2. **Symlink into `.claude/skills/`:** `ln -s ../../.agents/skills/_my-skill .claude/skills/_my-skill`

## Reviewing Skills

When auditing skills, check:

1. Has the `_` prefix (custom) or not (installed)?
2. Has both blockquotes (keyword usage + keep in sync)?
3. Uses MUST/NEVER for critical rules (not "should"/"consider")?
4. Description clearly states trigger conditions?
5. Content is current with the actual codebase?
6. Registered in CLAUDE.md's auto-invoke skills table?
