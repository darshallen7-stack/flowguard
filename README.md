# ⚡ FlowGuard

**Compliance-Safe, Self-Hostable Workflow Automation**

FlowGuard lets compliance-sensitive businesses (legal, healthcare, accounting) build
drag-and-drop workflow automations without their data ever leaving their own servers.

Built as a free alternative to Zapier/Make for GDPR, HIPAA, and SOC2 environments.

---

## Features

- Drag-and-drop workflow canvas
- Node types: Trigger, Condition, Action, Email, Encrypt, Database
- Real email sending via SMTP
- JWT authentication — login required
- SQLite database — no external database needed
- 100% self-hosted — data never leaves your machine

---

## Requirements

- Node.js 18 or higher
- Git

---

## Installation

```bash
git clone https://github.com/darshallen7-stack/flowguard.git
cd flowguard
cd backend && npm install
cd ../frontend && npm install
cd ..
```

---

## Configuration

Copy the example env file and fill in your details:

```bash
cd backend
copy .env.example .env
```

Edit `.env`:s