# Raspberry Pi Deployment Guide

Deploy Recognition Node on a Raspberry Pi for off-grid operation.

## Hardware

### Minimum
- Raspberry Pi 4 (2GB RAM)
- 32GB microSD card (Class 10 or better)
- USB-C power supply (5V 3A)
- Internet connection (WiFi or Ethernet, needed for LLM API calls)

### Recommended
- Raspberry Pi 4/5 (4GB RAM)
- 64GB microSD card or USB SSD (more reliable for SQLite writes)
- 12V solar power via buck converter to 5V USB-C
- Ethernet for reliability, WiFi as backup

## Software Setup

### 1. Base System

```bash
# Flash Raspberry Pi OS Lite (64-bit) to SD card
# Boot, connect, and update
sudo apt update && sudo apt upgrade -y

# Install Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version  # Should be >= 22
```

### 2. OpenClaw Installation

```bash
npm install -g openclaw@latest
openclaw onboard
```

### 3. Recognition Node Skills

```bash
cd ~/.openclaw/skills
git clone https://github.com/Bluescontact/recognition-node.git
ln -s recognition-node/skills/graduated-trust ./graduated-trust
ln -s recognition-node/skills/provenance ./provenance
ln -s recognition-node/skills/coordination ./coordination
ln -s recognition-node/skills/infrastructure ./infrastructure
openclaw skills list
```

### 4. Auto-Start on Boot

```bash
sudo tee /etc/systemd/system/openclaw.service << EOF
[Unit]
Description=OpenClaw Gateway
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi
ExecStart=/usr/bin/openclaw gateway start --foreground
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable openclaw
sudo systemctl start openclaw
```

## Solar Power Notes

The Pi draws ~3-5W. A modest solar setup handles this:

```
100W solar panel → charge controller → 12V battery → buck converter → 5V USB-C → Pi
```

For overnight operation (8 hours darkness):
- Pi consumption: ~5W x 8h = 40Wh
- With 50% safety margin: 80Wh needed
- A 100Ah 12V battery provides 1200Wh (plenty of margin)
