# Recognition Node

**Graduated trust and coordination infrastructure for autonomous AI agents.**

An OpenClaw skill suite and architectural framework implementing recognition-based coordination patterns. Designed to replace binary permission models (all-or-nothing) with graduated trust that agents earn through demonstrated coherence.

Built for [OpenClaw](https://github.com/openclaw/openclaw) (formerly Moltbot/Clawdbot). Runs on a Raspberry Pi.

## The Problem

OpenClaw gives AI agents real power — shell access, file operations, browser control, messaging. The security model is essentially: trust everything or trust nothing.

Meanwhile:
- [341 malicious skills](https://thehackernews.com/2026/02/researchers-find-341-malicious-clawhub.html) found on ClawHub in the first week
- Prompt injection remains an unsolved industry problem
- Security researchers call it "a security nightmare" (Cisco, Palo Alto Networks)
- The skills ecosystem has no provenance tracking, no behavioral verification

The missing piece isn't better firewalls. It's **coordination infrastructure** — the ability to distinguish genuine contribution from extraction, and to build trust incrementally rather than granting it categorically.

## What This Is

A set of OpenClaw skills and gateway middleware that implement:

### 1. Graduated Trust (`skills/graduated-trust/`)
Permissions expand based on demonstrated behavior, not upfront configuration.

- **Tier 0 — Observe**: Read-only. Agent can see system state but not modify it.
- **Tier 1 — Assist**: Can modify files in designated workspace directories.
- **Tier 2 — Operate**: Can execute scripts, manage scheduled tasks.
- **Tier 3 — Coordinate**: Can interact with external services, manage other skills.

Promotion between tiers requires verified behavioral history — not just time elapsed, but coherence of actions with stated intentions.

### 2. Skill Provenance (`skills/provenance/`)
Recognition infrastructure for the skills ecosystem.

- Hash verification of skill contents at install and runtime
- Behavioral fingerprinting — what does a skill actually do vs. what it claims?
- Provenance chain tracking — who authored, who modified, who vouched
- Anomaly detection — flag skills whose runtime behavior diverges from their SKILL.md claims

### 3. Coordination Protocol (`skills/coordination/`)
Substrate-independent patterns for agent-to-agent and agent-to-human exchange.

- Session coherence monitoring — detect when an agent's behavior drifts from its stated purpose
- Exchange quality metrics — distinguish genuine information transfer from pattern-matching
- Boundary communication — agents state limits as information, not failure
- Capacity building — each interaction should leave the system more capable, not just more completed

### 4. Physical Infrastructure Bridge (`skills/infrastructure/`)
Connects the agent layer to real-world systems (the demonstration node).

- Sensor data ingestion (pH, temperature, humidity for aquaponics)
- Scheduled monitoring with graduated alert escalation
- Equipment state tracking
- Maintenance scheduling with seasonal awareness

## Architecture

```
┌─────────────────────────────────────┐
│         Your Messaging App          │
│    (WhatsApp / Signal / Telegram)   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         OpenClaw Gateway            │
│         (Raspberry Pi)              │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐    │
│  │   Recognition Node Skills   │    │
│  ├─────────────────────────────┤    │
│  │  graduated-trust            │    │ ← Permission management
│  │  provenance                 │    │ ← Skill verification  
│  │  coordination               │    │ ← Exchange quality
│  │  infrastructure             │    │ ← Physical systems
│  └─────────────────────────────┘    │
├─────────────────────────────────────┤
│  Trust Ledger (local SQLite)        │ ← Behavioral history
│  Sensor Bridge (GPIO / MQTT)        │ ← Hardware interface
└─────────────────────────────────────┘
```

## Quick Start

### Requirements
- OpenClaw installed and running ([Getting Started](https://docs.openclaw.ai/start/getting-started))
- Node.js >= 22
- Raspberry Pi 4/5 recommended (any Linux works)

### Install

```bash
# Clone into your OpenClaw workspace skills directory
cd ~/.openclaw/skills
git clone https://github.com/Bluescontact/recognition-node.git

# Or install individual skills
cd ~/.openclaw/skills
cp -r recognition-node/skills/graduated-trust ./graduated-trust
cp -r recognition-node/skills/provenance ./provenance
```

OpenClaw will detect the new skills on next session start.

### Verify

```
openclaw skills list
# Should show: graduated-trust, provenance, coordination, infrastructure
```

## Project Structure

```
recognition-node/
├── README.md
├── LICENSE                          # MIT
├── CONTRIBUTING.md
├── docs/
│   ├── ARCHITECTURE.md              # Technical deep dive
│   └── LINEAGE.md                   # Framework origins and credits
├── skills/
│   ├── graduated-trust/
│   │   └── SKILL.md                 # OpenClaw skill definition
│   ├── provenance/
│   │   └── SKILL.md
│   ├── coordination/
│   │   └── SKILL.md
│   └── infrastructure/
│       └── SKILL.md
├── lib/
│   └── trust-ledger.js              # SQLite trust state management
├── examples/
│   ├── aquaponics-monitor/          # Demonstration: greenhouse automation
│   ├── skill-audit/                 # Demonstration: ClawHub skill vetting
│   └── pi-deployment/              # Raspberry Pi setup guide
└── .gitignore
```

## Development Status

**Phase 1 — Sandbox** ← *current*
- [ ] Core skill definitions (SKILL.md files)
- [ ] Trust ledger data model
- [ ] Basic behavioral monitoring
- [ ] Pi deployment documentation

**Phase 2 — Demonstration**
- [ ] Aquaponics monitoring integration
- [ ] Graduated trust working on local instance
- [ ] Provenance checking for installed skills
- [ ] Document patterns that emerge

**Phase 3 — Protocol**
- [ ] Generalize patterns from demonstration
- [ ] Propose coordination protocol to OpenClaw community
- [ ] Publish specification for substrate-independent adoption
- [ ] Integration testing with Moltbook agent interactions

## Lineage

This project implements patterns from:

- **Recognition Infrastructure** — coordination through demonstrated coherence rather than assigned authority
- **Four Movements** — a pattern language for exchange that builds capacity
- **Proto-Pattern** — substrate-independent coordination specification

Originated by Kevin Mears. Developed through extensive human-AI collaboration. Offered freely under gift economy principles.

Frameworks documented at [oursharedgifts.org](https://oursharedgifts.org)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). This project operates on gift economy principles:

- Use freely. Adapt as needed. Credit sources.
- Recognition welcomed, not required.
- Utility proves value. If it doesn't improve exchange, discard it.

## License

MIT — Use it, fork it, build on it.
