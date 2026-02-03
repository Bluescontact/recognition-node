/**
 * Trust Ledger — SQLite-backed trust state management
 * 
 * Manages graduated trust tiers for OpenClaw agents.
 * See skills/graduated-trust/SKILL.md for tier definitions.
 * 
 * Status: Scaffold — data model defined, implementation pending
 */

// TODO: Implement when OpenClaw skill JavaScript execution model is confirmed
// The SKILL.md files are the primary deliverable for Phase 1
// This code will implement the persistent state layer in Phase 2

module.exports = {
  TIERS: {
    OBSERVE: 0,
    ASSIST: 1,
    OPERATE: 2,
    COORDINATE: 3
  },
  
  PROMOTION_REQUIREMENTS: {
    0: { min_hours: 24, min_actions: 20, min_coherence: 0.85 },
    1: { min_hours: 72, min_actions: 20, min_coherence: 0.85 },
    2: { min_hours: 168, min_actions: 20, min_coherence: 0.85, requires_human_approval: true }
  }
};
