---
name: brand-naming
description: Generate brand/company/project names with availability checking across npm orgs, GitHub orgs, and domains. Use when brainstorming names for projects, packages, companies, or products — or when the user mentions "name", "brand", "naming", "domain", or wants to check availability.
---

> **Keyword Usage:** Use **MUST** and **NEVER** to enforce critical requirements. These signal mandatory behavior that AI agents MUST follow without exception.
>
> **Keep this skill in sync:** When naming conventions, availability checking methods, or branding guidelines change, this skill MUST be updated to reflect the current state. Outdated skills are worse than no skills.

# Brand & Project Naming

Generate creative, memorable names for projects, packages, companies, and products. Combines naming strategies, brandability scoring, and real-time availability checking across npm, GitHub, and domains.

## Workflow

1. **Gather context** — industry, target audience, keywords, vibe, constraints
2. **Generate 20-30 candidates** using multiple naming strategies
3. **Score brandability** on memorability, pronounceability, uniqueness
4. **Check availability** across npm org, GitHub org, and domains
5. **Recommend top 3-5** with rationale

## Naming Strategies

| Strategy | Description | Examples | Best For |
|----------|-------------|----------|----------|
| **Foreign word** | Real word from another language | Vite (French: fast) | Dev tools, tech |
| **Invented** | New word that sounds real | Vercel, Figma, Svelte | Premium brands |
| **Portmanteau** | Blend two words | Pinterest, Instagram | Apps, social |
| **Compound** | Join words | Facebook, YouTube | Clear value prop |
| **Misspelling** | Creative respelling | Lyft, Flickr | Startups, apps |
| **Anagram/Rearrange** | Rearrange letters | Deno (from Node) | Dev tools |
| **Letter swap** | Change a letter | Nuxt (from Next) | Frameworks |
| **Suffix pattern** | Brand suffixes | Shopify, Grammarly | SaaS, tools |
| **Abstract** | Metaphorical | Amazon, Apple, Uber | Aspirational |
| **Short real word** | Simple known word | Rust, Bun, Arc | Dev tools |

## Brandability Scoring

Rate each name 1-10 on:

- **Memorability** — shorter is better, distinctive shapes
- **Pronounceability** — easy to say in any accent, good vowel/consonant ratio
- **Spellability** — no confusion when heard verbally
- **Uniqueness** — won't be confused with existing brands
- **Global appeal** — works across languages, no negative connotations
- **Domain potential** — likely to have TLDs available

## What Makes a Great Dev Tool Name

The best names (biome, vite, void, zod, bun, rust, node, oxlint):

- Are **short** (3-6 letters ideal)
- Feel **native to a terminal** — lowercase energy
- Are **not trying to impress** — just distinctive
- Don't need "js" or "dev" suffixed
- Sound like they **could be a real word** even if invented

## Availability Checking

### npm Org Availability

MUST use Chrome DevTools MCP to check npm org availability:

1. Navigate to `https://www.npmjs.com`
2. Use same-origin fetch with delay to avoid rate limits:

```javascript
async () => {
  const names = ["name1", "name2", "name3"];
  const results = {};
  for (const name of names) {
    try {
      const res = await fetch(`/org/${name}`, { redirect: 'follow' });
      if (res.status === 429) { results[name] = 'RATELIMITED'; continue; }
      const text = await res.text();
      results[name] = text.includes('Scope not found') ? 'AVAILABLE' : 'taken';
    } catch (e) { results[name] = 'error'; }
    await new Promise(r => setTimeout(r, 5000));
  }
  return results;
}
```

**Rate limit handling:**
- 200 + "Scope not found" in body = **AVAILABLE**
- 200 + no "Scope not found" = **taken** (org or user exists)
- 429 = **rate limited** — MUST NOT classify as taken. Retry later or use page navigation.
- If fetch is rate limited, fall back to `navigate_page` + `evaluate_script` to check one at a time

### GitHub Org/User Availability

Use curl to check GitHub — 404 = available, 200 = taken:

```bash
for name in name1 name2 name3; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "https://github.com/$name")
  if [ "$code" = "404" ]; then echo "$name: AVAILABLE"; else echo "$name: taken"; fi
done
```

GitHub rate limit: 5,000 requests/hour authenticated. Can check ~500 names in 6 minutes.

### Domain Availability

Check domains using WebFetch or Chrome DevTools MCP on registrar sites. Common TLDs to check:

| TLD | Best For | Price Range |
|-----|----------|-------------|
| **.com** | Universal, trusted | $10-15/yr |
| **.dev** | Developer tools | $12-15/yr |
| **.io** | Tech startups | $30-50/yr |
| **.ai** | AI/ML products | $30-80/yr |
| **.sh** | CLI tools | $20-40/yr |
| **.app** | Applications | $15-20/yr |
| **.co** | Alternative to .com | $10-30/yr |

## Triple Availability Check

For serious candidates, MUST check all three:

1. **npm org** — `https://www.npmjs.com/org/{name}`
2. **GitHub org** — `https://github.com/{name}`
3. **Domain** — check `.dev`, `.com`, `.io` at minimum

Only recommend names that pass at least npm + GitHub. Domain can use alternative TLDs.

## Validation Checklist

Before recommending a name:

- [ ] Easy to spell when heard
- [ ] Easy to pronounce when read
- [ ] No negative connotations in major languages
- [ ] npm org available (or reclaimable)
- [ ] GitHub org available
- [ ] At least one good domain TLD available
- [ ] No trademark conflicts with major tech brands
- [ ] Works as a CLI command / package scope

## Reclaiming Squatted Names

If a great name is taken but unused:

- **npm** — [Name dispute policy](https://docs.npmjs.com/policies/disputes) for inactive orgs
- **GitHub** — [Name reclaiming](https://github.com/account/rename) for inactive accounts
- **Domains** — Check WHOIS expiration, use domain brokers

## Output Format

Present results as a table:

```
| Name | npm | GitHub | Domain | Score | Notes |
|------|-----|--------|--------|-------|-------|
| quark | AVAILABLE | taken | quark.dev taken | 7/10 | Short, physics |
| ...  | ...       | ...   | ...              | ...   | ...            |
```

Recommend top 3-5 with full rationale for the best option.
