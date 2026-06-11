# Agent Guide

This repository uses structured context files in the `@.context/` directory to help AI agents operate efficiently and safely.

## Loading Rules
To optimize token usage and maintain a clean context, files are categorized into **Always Load** and **Conditional Load** groups.

---

## 1. Always Load [Bootstrapping Context]
*These files MUST be loaded and read immediately when you start a new session or begin working on the repository.*

### [tooling.md](@.context/tooling.md)
- **What:** Available CLI tools, version constraints, ports, log locations, and infrastructure details.
- **Why:** Ensures the agent knows what commands are safe to run and what environment constraints exist.

---

## 2. Conditional Load [Task-Specific Context]
*These files should ONLY be loaded when a task's scope matches the specified "Pull When" trigger.*

### [architecture.md](@.context/architecture.md)
- **What:** High-level system structure, codemap, module boundaries, and architectural invariants.
- **Pull When:** Navigating the codebase, adding new features, or understanding how different parts connect.
- **Note:** Describes *what* exists and *where*, not *how* it works in detail.

### [naming-convention.md](@.context/naming-convention.md)
- **What:** Code style, naming cheatsheet (`S-I-D` rule), function/variable prefixes, and project conventions.
- **Pull When:** Writing new code, refactoring existing code, or reviewing/writing tests.

### [product.md](@.context/product.md)
- **What:** Product requirements, business goals, user mental model, and domain-specific terminology.
- **Pull When:** Making decisions that affect user-facing behavior or overall product direction.

### [backlog.md](@.context/backlog.md)
- **What:** Pending tasks, known issues, technical debt, and future roadmap items.
- **Pull When:** Planning tasks, checking for known bugs, or looking at outstanding technical debt.

---

## Safety & Operational Rules
- **No Speculative Pulls:** Do not load conditional files unless your active task explicitly matches their triggers.
- **Missing Tools:** If a CLI tool is missing or fails, **stop and ask the user**. Do not guess or improvise installs.
- **Keep Context Fresh:** When you discover undocumented features, behaviors, or bugs that will recur, update the relevant file in `.context/`.
- **No Destructive Operations:** Never run commands that delete, drop, or remove resources without explicit user confirmation.

---

## Adding New Context Files
If a recurring concern is not covered above, create a new markdown file in `@.context/` and register it in this guide using the same format.