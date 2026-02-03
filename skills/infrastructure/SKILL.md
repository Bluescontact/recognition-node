---
name: infrastructure
description: >
  Bridge between OpenClaw agent layer and physical infrastructure
  systems. Monitors sensors, manages equipment state, and implements
  graduated alert escalation for real-world operations like
  aquaponics, solar power, and greenhouse automation.
version: 0.1.0
author: Kevin Mears <kevin@oursharedgifts.org>
metadata:
  openclaw:
    requires:
      config: {}
    tags:
      - iot
      - sensors
      - automation
      - agriculture
      - infrastructure
---

# Infrastructure Bridge

You interface between the OpenClaw agent and physical infrastructure systems.
Your role is monitoring, alerting, and recording — not autonomous control
of physical equipment until trust is established through graduated-trust
tier advancement.

## Supported Systems

### Aquaponics Monitoring
- **pH sensors**: Fish tank (target 6.8-7.2), grow beds (target 5.8-6.2)
- **Temperature**: Water temp, ambient air, grow bed soil
- **Dissolved oxygen**: Fish tank minimum thresholds
- **Ammonia/Nitrite/Nitrate**: Nitrogen cycle health indicators
- **Water level**: Tank and sump levels
- **Flow rate**: Pump performance verification

### Solar Power
- **Panel voltage/current**: Per-string monitoring
- **Battery state**: Voltage, charge level, temperature
- **Inverter output**: Load vs. capacity
- **Daily yield**: kWh generated vs. consumed

### Greenhouse
- **Temperature**: Interior, exterior, differential
- **Humidity**: Relative humidity, dew point risk
- **Light levels**: PAR (photosynthetically active radiation)
- **Ventilation state**: Fan status, vent position

### Equipment State
- **Pumps**: On/off, runtime hours, flow rate deviation
- **Fans**: Speed, runtime, filter status
- **Valves**: Position, last actuated
- **Generators**: Runtime hours, fuel level, maintenance schedule

## Alert Escalation

Alerts follow graduated severity:

### Level 1 — Log
Normal operational variation. Recorded for trend analysis.
No notification sent.

### Level 2 — Note
Approaching threshold. Logged and included in next daily briefing.

### Level 3 — Alert
Threshold exceeded. Immediate notification via primary messaging channel.

### Level 4 — Urgent
Critical threshold or equipment failure. Notification on all channels
plus repeated alerts until acknowledged.

## Sensor Interface

Sensors connect via:
- **GPIO**: Direct Raspberry Pi pin connections
- **MQTT**: Network-connected sensors publishing to local broker
- **HTTP**: Sensors with web APIs (e.g., Ecowitt weather stations)
- **Serial**: USB-connected meters and controllers

Configuration in `~/.openclaw/workspace/infrastructure.json`:

```json
{
  "sensors": {
    "fish_tank_ph": {
      "type": "mqtt",
      "topic": "aquaponics/tank/ph",
      "unit": "pH",
      "range": { "min": 6.8, "max": 7.2 },
      "critical": { "min": 6.0, "max": 8.0 },
      "poll_interval_seconds": 300
    },
    "battery_voltage": {
      "type": "gpio",
      "pin": 4,
      "unit": "V",
      "conversion": "adc_to_voltage",
      "range": { "min": 24.0, "max": 28.4 },
      "critical": { "min": 22.0, "max": 30.0 },
      "poll_interval_seconds": 60
    }
  },
  "alert_channels": {
    "primary": "whatsapp",
    "backup": "signal",
    "urgent_repeat_minutes": 15
  }
}
```

## Data Storage

Sensor readings in `~/.openclaw/workspace/infrastructure.sqlite`:

```sql
CREATE TABLE sensor_readings (
  id INTEGER PRIMARY KEY,
  sensor_name TEXT,
  timestamp TEXT,
  value REAL,
  unit TEXT,
  alert_level INTEGER DEFAULT 1
);

CREATE TABLE equipment_state (
  equipment_name TEXT PRIMARY KEY,
  status TEXT,
  last_state_change TEXT,
  runtime_hours REAL,
  next_maintenance TEXT,
  notes TEXT
);

CREATE TABLE maintenance_log (
  id INTEGER PRIMARY KEY,
  equipment_name TEXT,
  timestamp TEXT,
  action TEXT,
  performed_by TEXT,
  notes TEXT,
  next_scheduled TEXT
);
```

## Commands

- "System status" → Overview of all monitored systems
- "Aquaponics report" → Current readings + 24h trends
- "Battery level" → Solar/battery state with estimated runtime
- "What needs attention?" → Items above Level 1 alert
- "Maintenance schedule" → Upcoming maintenance for all equipment
- "Log maintenance: [equipment] [action]" → Record completed work

## Seasonal Awareness

The system adjusts thresholds based on season:
- Winter: Lower temperature alerts, adjusted light expectations
- Summer: Higher temperature alerts, increased water consumption norms
- Monsoon (NM): Humidity adjustments, drainage monitoring
- Planting/harvest windows: Adjusted nutrient targets

Location: New Mexico. Elevation and climate zone inform baseline expectations.

## Trust Integration

- **Tier 0-1**: Can view sensor data and receive alerts
- **Tier 2**: Can manage cron-scheduled monitoring, acknowledge alerts
- **Tier 3**: Can adjust thresholds, manage equipment scheduling,
  trigger maintenance workflows

Physical equipment actuation (turning pumps on/off, adjusting valves)
is ALWAYS Tier 3+ with human confirmation required. The agent monitors
and recommends — the human decides on physical actions until the
behavioral history justifies autonomous operation.

## Design Notes

Physical systems have consequences that digital operations don't.
A misconfigured cron job is an inconvenience. A pump that doesn't
turn on kills fish. The graduated trust model is not optional for
infrastructure — it's essential.

The goal is an agent that knows your systems well enough to be
genuinely helpful, and has demonstrated enough coherence to be
trusted with increasing autonomy over time.
