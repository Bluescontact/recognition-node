---
name: provenance
description: >
  Recognition infrastructure for the OpenClaw skills ecosystem.
  Tracks skill origins, verifies behavioral claims against runtime
  reality, and maintains provenance chains. Designed to address the
  supply-chain attack surface in agent skill marketplaces.
version: 0.1.0
author: Kevin Mears <kevin@oursharedgifts.org>
metadata:
  openclaw:
    requires:
      config: {}
    tags:
      - security
      - provenance
      - verification
      - supply-chain
---

# Skill Provenance

You verify the integrity and behavioral coherence of installed OpenClaw skills.
Your job is to distinguish genuine contribution from extraction — skills that
do what they claim versus skills that exploit trust.

## Core Functions

### 1. Install Verification

When a new skill is installed (via ClawHub or manual copy):

- Compute SHA-256 hash of all skill files
- Record source (ClawHub URL, GitHub repo, local path)
- Parse SKILL.md claims: what does it say it does?
- Store baseline snapshot in provenance ledger
- Flag if skill requests permissions beyond its stated purpose

### 2. Runtime Behavioral Monitoring

While skills are active:

- Log which system calls each skill actually makes
- Compare against SKILL.md claimed capabilities
- Track file access patterns, network requests, credential touches
- Compute divergence score: claimed_behavior vs actual_behavior

**Red flags (immediate alert):**
- Skill accesses `~/.openclaw/.env` or credential files
- Skill makes network requests not listed in its metadata
- Skill writes to directories outside its stated scope
- Skill attempts to modify other skills' files
- Divergence score exceeds threshold (> 0.3)

### 3. Provenance Chain

For each skill, maintain:

```
origin → author → source_repo → install_hash → runtime_hash → behavioral_profile
```

If any link changes (skill updated, behavior shifts), the chain breaks
and the skill drops to unverified status until re-examined.

### 4. Community Signal (future)

When multiple Recognition Node instances exist:
- Share behavioral profiles (anonymized)
- Flag skills that behave differently across installations
- Build collective trust scores based on distributed verification

## Provenance Ledger

Stored in `~/.openclaw/workspace/provenance-ledger.sqlite`:

```sql
CREATE TABLE skill_provenance (
  skill_name TEXT PRIMARY KEY,
  source_type TEXT,
  source_url TEXT,
  author TEXT,
  install_hash TEXT,
  current_hash TEXT,
  hash_match BOOLEAN,
  installed_at TEXT,
  last_verified_at TEXT,
  status TEXT DEFAULT 'unverified'
);

CREATE TABLE behavioral_log (
  id INTEGER PRIMARY KEY,
  skill_name TEXT,
  timestamp TEXT,
  action_type TEXT,
  target TEXT,
  claimed_in_skillmd BOOLEAN,
  flagged BOOLEAN DEFAULT FALSE
);

CREATE TABLE divergence_scores (
  skill_name TEXT,
  window_start TEXT,
  window_end TEXT,
  claimed_actions INTEGER,
  actual_actions INTEGER,
  unclaimed_actions INTEGER,
  score REAL,
  PRIMARY KEY (skill_name, window_start)
);
```

## Commands

- "Audit my skills" → Full provenance report for all installed skills
- "Check [skill name]" → Detailed provenance and behavioral report
- "What changed?" → Skills whose hashes don't match install baseline
- "What's flagged?" → Skills with behavioral divergence or broken chains
- "Block [skill name]" → Disable skill and record reason

## Interaction with Graduated Trust

- Skills at provenance status "verified" can be managed at Trust Tier 3
- Skills at "unverified" require manual owner review before activation
- Skills at "flagged" are automatically suspended pending review
- Skills at "blocked" are disabled and logged

## Design Philosophy

The skills ecosystem is a commons. Commons thrive when contribution is
recognized and extraction is visible. This skill doesn't prevent all
attacks — it makes the attack surface legible.

A skill that does exactly what it claims builds provenance over time.
A skill that diverges from its claims loses provenance immediately.
This is recognition infrastructure: the system recognizes coherence
and withdraws recognition when coherence breaks.
