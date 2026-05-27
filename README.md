# Agent Harness: The Starter Kit for Autonomous Coding

**2025 was the year of AI agents. 2026 is the year of the harness.** AI coding agents are incredibly smart, but if you let them run wild in a repository, they will hallucinate dependencies, forget architectural decisions, and drift from your coding standards. They need a deterministic environment to operate in.

Think of this repository as the starter scaffold for the agentic era. It provides a strict "harness"—the guardrails, tools, and workflows—that an AI agent needs to build software autonomously, safely, and correctly.

While this specific repo uses a Node.js and Fastify backend, you can apply this exact harness concept to any language or framework.

## 🧠 Project Context & Token Efficiency
An agent is only as good as the context it operates in. Instead of feeding the agent raw, bloated code dumps, this repo is structurally optimized for **low token usage**. We keep the context sharp and cheap:

* **Product Overview & Architecture.md:** The agent grounds itself in the actual business logic and system architecture before doing anything. It knows *why* it is building, not just *what*.
* **Inbuilt Task Management:** The project tracks its own tickets and progress natively, keeping the agent focused strictly on the current task.

## ⚙️ The Harness Tooling Philosophy
We believe in giving the agent direct, native access to the system, but wrapped in strict safety guardrails.

* **CLI Over MCP:** We prefer native CLI tools over heavy Model Context Protocol (MCP) abstractions. It is faster, more deterministic, and less prone to AI translation errors.
* **Direct Ecosystem Access:** The agent has sandboxed access to `curl`, the database, caching layers, logging, observability tools, and core utilities.

## 🧰 The Agent Skillset
We have equipped the harness with specific, executable "skills." When an agent faces a problem, it uses a skill rather than guessing.

### 1. Setup & Customization
* **The Customizer:** Don't need a part of this scaffold? The agent can safely rip out or swap specific modules to customize the repo for your exact requirements.
* **One-Click Onboarding:** No more spending two days setting up a local environment. The onboarding skill configures the entire ecosystem (DBs, caches, local servers) automatically.

### 2. Planning & Architecture
* **Spec-Driven Development:** The agent does not just start writing code. It uses this skill to write and validate a strict specification first. Code only follows the spec.
* **Decision Logs (ADR):** Before making any structural change, the agent pauses. It critically reviews the problem, compares multiple technical options, decides on a path, and writes an Architecture Decision Record (ADR).

### 3. Execution & Testing
* **Meaningful Unit Tests:** A strict rule: do not write tests just for code coverage. The agent is instructed to only write unit tests that test actual logic and edge cases.
* **360 QA:** The agent doesn't just write the application; it acts as the QA engineer, writing and executing full end-to-end tests against the system.

## 🛡️ Governance & Guardrails
The agent is explicitly instructed to follow a strict coding philosophy. We do not tolerate bloated code.

* **Tech Do's and Don'ts:** Hardcoded rules enforce naming conventions, folder structures, and coding styles. For example: *No unnecessary database calls. No useless function abstractions. Fail fast.*
* **The "Maker vs. Checker" Code Review:** We use a completely different AI model for code review than the one used for coding. If Claude writes the code, GPT-4 reviews it. This prevents the AI from blindly approving its own mistakes and enforces a true, critical code review.