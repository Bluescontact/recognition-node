# Architecture

## Overview

Recognition Node is a suite of OpenClaw skills that work together to
implement graduated trust and coordination infrastructure. It is not
a replacement for OpenClaw's security model — it is an additional layer
that makes the trust surface legible and manageable.

## How OpenClaw Skills Work

Each skill is a directory containing a `SKILL.md` file with YAML frontmatter
and natural language instructions. When OpenClaw loads, it injects eligible
skills into the agent's system prompt. The agent then has access to the
patterns and instructions described in the skill.

This means Recognition Node skills operate at the **prompt level**, not
the **code level**. They instruct the agent on how to behave, what to
track, and how to evaluate its own actions. The supporting code (trust
ledger, provenance chain, sensor bridge) provides the persistent state
that the skills reference.

## Data Flow

```
Sensor / Action / Skill Event
        │
        ▼
┌─────────────────────┐
│  Behavioral Monitor  │ ← Logs all actions with context
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
┌─────────┐ ┌──────────┐
│  Trust   │ │Provenance│
│  Ledger  │ │  Chain   │
└────┬────┘ └────┬─────┘
     │           │
     └─────┬─────┘
           ▼
┌─────────────────────┐
│ Coordination Logger  │ ← Exchange quality metrics
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Agent Decision     │ ← Informed by trust state + provenance
└─────────────────────┘
```

## Storage

All state is local SQLite. Four databases:

1. `trust-ledger.sqlite` — Agent trust tiers, action history, violations
2. `provenance-ledger.sqlite` — Skill hashes, behavioral profiles, divergence
3. `coordination-log.sqlite` — Exchange quality metrics, drift events
4. `infrastructure.sqlite` — Sensor readings, equipment state, maintenance

SQLite was chosen because:
- Zero configuration, single file per database
- Works on Raspberry Pi without overhead
- Survives power loss (important for off-grid)
- Easy to backup (copy the file)
- Easy to inspect (sqlite3 CLI)

## Security Model

Recognition Node adds security through **legibility**, not **restriction**.

Traditional security: "Block unauthorized access."
Recognition security: "Make all access visible and evaluate it continuously."

Both are needed. OpenClaw's sandbox/tool-policy handles restriction.
Recognition Node handles the trust evaluation layer that decides
what level of restriction is appropriate and when to adjust it.

### Attack Surfaces Addressed

| Attack | Traditional Response | Recognition Response |
|--------|---------------------|---------------------|
| Malicious skill install | Block unknown skills | Verify provenance, monitor behavior, flag divergence |
| Prompt injection | Input sanitization | Coherence scoring — injected actions won't match stated intentions |
| Privilege escalation | Static permissions | Graduated trust — escalation requires behavioral history |
| Data exfiltration | Network blocking | Behavioral monitoring — unexpected network access is flagged |

### Attack Surfaces NOT Addressed

- Compromised LLM provider (model-level attacks)
- Physical device access
- Vulnerabilities in OpenClaw core
- Zero-day exploits in Node.js/system packages

## Future Architecture

### Distributed Recognition

When multiple Recognition Node instances exist across different
OpenClaw installations, they could share anonymized behavioral
profiles — building collective intelligence about skill behavior
without exposing individual user data.

### Protocol Standardization

The coordination patterns are substrate-independent. They could be
implemented as:
- OpenClaw skills (current)
- MCP (Model Context Protocol) tools
- Standalone middleware for any agent framework
- Human organizational protocols (they already are)

The goal is not OpenClaw lock-in. The goal is coordination patterns
that work everywhere.
