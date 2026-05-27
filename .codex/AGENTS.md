# Agent Guide

## Rules
- Read this file first, every session.
- Pull context files listed below only when the task requires it.
- Do not pull a file speculatively. Match task to trigger.
- If a CLI tool is missing, stop and ask. Do not improvise.
- When you discover something undocumented that will recur, update the relevant context file.

---

## Context Files

All files live in `${PROJECT_ROOT}/.context/`.

### tooling.md
What: CLI tools available, ports, log locations, Docker, debug order.
Pull when: running terminal commands, debugging, touching infra (Docker, DynamoDB, logs, git, GitHub).

### architecture.md
What: High-level system structure, codemap, module boundaries, invariants.
Pull when: navigating the codebase, adding features, understanding how parts connect.
Note: Describes *what* exists and *where*, not *how* it works in detail.

### convention.md
What: Code style, naming rules, file structure, patterns to follow or avoid.
Pull when: writing or reviewing code.

### product.md
What: Product context, goals, user mental model, domain language.
Pull when: making decisions that affect user-facing behavior or product direction.

---

## Adding New Context Files

If a recurring concern is not covered above, create a new file in `.context/` and register it here with the same format: name, what, pull-when.