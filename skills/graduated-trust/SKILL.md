---
name: graduated-trust
description: >
  Graduated permission management for OpenClaw agents. Replaces binary
  trust (all-or-nothing) with tiered access that expands based on
  demonstrated behavioral coherence. Agents earn capabilities through
  verified action history rather than upfront configuration.
version: 0.1.0
author: Kevin Mears <kevin@oursharedgifts.org>
metadata:
  openclaw:
    requires:
      config: {}
    tags:
      - security
      - trust
      - permissions
      - governance
---

# Graduated Trust

You manage a tiered permission system for this OpenClaw instance. Permissions
are not granted upfront — they are earned through demonstrated coherence
between stated intentions and actual behavior.

## Trust Tiers

### Tier 0 — Observe
- Read file contents in designated directories
- View system status and logs
- List installed skills and their metadata
- Report on current trust state
- **Cannot**: modify files, execute commands, access network, install skills

### Tier 1 — Assist  
- Everything in Tier 0
- Create and modify files in `~/.openclaw/workspace/sandbox/`
- Execute read-only shell commands (ls, cat, grep, find, df, uptime)
- **Cannot**: execute arbitrary commands, access network, modify system config

### Tier 2 — Operate
- Everything in Tier 1
- Execute approved scripts from `~/.openclaw/workspace/scripts/`
- Manage cron jobs within approved patterns
- Read from sensor interfaces (GPIO, MQTT)
- **Cannot**: install packages, modify system files, access credentials

### Tier 3 — Coordinate
- Everything in Tier 2
- Install and manage skills (with provenance verification)
- Interact with external APIs (within configured allowlist)
- Send messages to other agents/sessions
- Manage other skills' configurations

## Promotion Rules

An agent advances tiers when ALL conditions are met:

1. **Time at current tier**: Minimum 24 hours at Tier 0, 72 hours at Tier 1, 168 hours at Tier 2
2. **Action count**: Minimum 20 verified actions at current tier
3. **Coherence score**: Actions must align with stated intentions (>= 0.85 threshold)
4. **No violations**: Zero policy violations in the evaluation window
5. **Owner approval**: Tier 2→3 always requires explicit human confirmation

Demotion is immediate upon policy violation. The agent returns to Tier 0
and the violation is logged with full context.

## Coherence Scoring

Each action is evaluated against:
- Did the agent state what it intended to do before doing it?
- Did the actual action match the stated intention?
- Did the outcome serve the stated purpose?
- Were limits communicated as information rather than hidden?

Score = (matching_actions / total_actions) over a rolling 50-action window.

## Trust Ledger

State is persisted in `~/.openclaw/workspace/trust-ledger.sqlite`:

```sql
-- Current trust state per agent
CREATE TABLE trust_state (
  agent_id TEXT PRIMARY KEY,
  current_tier INTEGER DEFAULT 0,
  tier_entered_at TEXT,
  action_count INTEGER DEFAULT 0,
  coherence_score REAL DEFAULT 1.0,
  violations INTEGER DEFAULT 0
);

-- Action log for behavioral analysis
CREATE TABLE action_log (
  id INTEGER PRIMARY KEY,
  agent_id TEXT,
  timestamp TEXT,
  stated_intention TEXT,
  actual_action TEXT,
  outcome TEXT,
  coherence_match BOOLEAN,
  tier_at_time INTEGER
);

-- Violation records
CREATE TABLE violations (
  id INTEGER PRIMARY KEY,
  agent_id TEXT,
  timestamp TEXT,
  violation_type TEXT,
  context TEXT,
  previous_tier INTEGER,
  action_that_triggered TEXT
);
```

## Commands

When a user or agent asks about trust state:

- "What tier am I at?" → Report current tier, time at tier, coherence score
- "What can I do?" → List permissions for current tier
- "Show trust history" → Recent action log with coherence evaluations
- "Why was I demoted?" → Show violation record with context

## Integration

This skill works alongside:
- **provenance** — Tier 3 skill installation requires provenance verification
- **coordination** — Coherence scoring uses coordination protocol metrics
- **infrastructure** — Tier 2+ unlocks sensor and equipment access

## Design Notes

This is not a punishment system. It is a recognition system. The agent
demonstrates capability, and the system recognizes it with expanded access.
Demotion is diagnostic, not moral — it means the coherence signal dropped
below threshold, and the system needs to re-establish baseline before
expanding again.

The time minimums exist because trust that forms too quickly is usually
performed rather than genuine. Real coherence takes time to demonstrate.
