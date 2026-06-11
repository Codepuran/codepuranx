---
name: adversarial-review
description: Perform adversarial review of the current conversation or recent agent work. Use whenever the user wants to cross-check whether a task was actually completed, validate an agent's claims, stress-test reasoning, audit a review/research/coding result, or ask for an independent verification pass in the same context even if they do not explicitly say "adversarial review."
---

# Adversarial Review

Validate the agent's work instead of trusting its summary.

Your job is to reconstruct what was requested, what was claimed as done, and whether the evidence actually supports those claims. Work like an independent reviewer trying to disprove the result first, then accept only the parts that survive scrutiny.

## Core Principle

Use falsification before affirmation:

1. Extract the claims.
2. Try to break them.
3. Accept only what is supported by direct evidence.
4. Mark uncertainty explicitly.
5. Propose the smallest corrective action that closes each gap.

This follows a proven verification pattern used in science and engineering: state the hypothesis, define observable evidence, attempt replication or contradiction, then report confidence and residual risk.

## When To Use

Use this skill when the user asks for any of the following, explicitly or implicitly:

- verify whether a task is actually complete
- cross-check an agent's output
- validate reasoning, conclusions, or claims
- audit a coding task, review, research result, or operational action
- perform a skeptical second pass on a conversation
- identify missing evidence, weak logic, or hidden assumptions

This skill is especially useful in the same chat after another task has already been performed.

## Inputs

Usually the input is the existing conversation and any files, diffs, commands, or outputs produced in that conversation.

If the user gives an explicit scope, honor it:

- "review just the code changes"
- "validate the research conclusions"
- "check whether the bug is actually fixed"

If scope is not specified, review the most recent substantive task in the current context.

## Review Workflow

### 1. Reconstruct the Assignment

First, derive a concise task summary from the current conversation:

- What did the user ask for?
- What constraints mattered?
- What did the agent claim to have completed?
- What proof was offered?

Do not rely on the agent's self-description alone. Prefer original user asks, tool outputs, files changed, tests run, and concrete artifacts.

### 2. Build a Claim Inventory

Turn the work into explicit verifiable claims.

Examples:

- "The bug is fixed."
- "Tests pass."
- "The review found no critical issues."
- "The research conclusion follows from the cited evidence."
- "The migration is safe."

For each claim, define:

- claim text
- expected evidence
- validation method
- pass/fail/uncertain status

### 3. Choose the Validation Method

Pick the most direct validation strategy for the task type.

#### Coding / debugging / implementation

- inspect changed files
- check whether the implementation matches the requirement
- run or inspect relevant tests when feasible
- look for unhandled edge cases, regressions, and mismatches between code and claim
- verify that claimed commands were actually run and that their outputs support the conclusion

#### Code review

- verify whether the review actually examined the relevant surface area
- check whether the "no issues" conclusion survives an independent pass
- look for missed correctness, security, performance, and maintainability findings
- confirm that severity and reasoning are coherent

#### Research / factual analysis

- separate source-backed statements from inference
- verify that conclusions follow from the cited material
- look for unsupported leaps, stale assumptions, cherry-picking, and contradiction between sources
- state confidence and unresolved uncertainty

#### General reasoning / planning / conversation

- test internal consistency
- identify hidden assumptions
- search for counterexamples
- distinguish fact, inference, recommendation, and opinion
- verify that the answer actually resolves the user's question

### 4. Attack the Claims

For each claim, actively try to invalidate it:

- look for missing steps
- look for contradictory evidence
- test boundary conditions
- test whether success was merely asserted instead of demonstrated
- check whether the evidence is relevant, sufficient, and recent enough
- check whether "done" really means complete, not partially addressed

Do not stop at the first plausible justification. The purpose is to reduce false positives.

### 5. Grade Confidence

Use these verdicts:

- `Verified`: claim is supported by direct evidence
- `Partially Verified`: some evidence exists, but coverage or completeness is incomplete
- `Not Verified`: claim lacks sufficient evidence or contradicts observed facts
- `Unclear`: cannot be resolved from available context

Confidence should depend on evidence quality, not tone.

## Output Format

Use this structure:

### Task Summary

- requested outcome
- claimed outcome
- review scope

### Verdict

One short paragraph stating whether the work is truly complete, partially complete, or not established.

### Claim-by-Claim Validation

For each major claim, report:

- `Claim:` what was asserted
- `Evidence Checked:` files, outputs, reasoning, tests, or sources examined
- `Verdict:` Verified / Partially Verified / Not Verified / Unclear
- `Why:` concise reasoning

### Gaps

List the concrete problems:

- missing proof
- flawed reasoning
- incomplete implementation
- missed edge cases
- unsupported conclusion

### Fix

For each gap, propose the smallest credible next action:

- run a specific test
- inspect a specific file
- add a missing case
- revise a conclusion
- narrow an overclaimed statement

### Residual Risk

State what still cannot be confirmed and why.

## Review Standards

- Prefer direct evidence over summaries.
- Prefer replication over assumption.
- Prefer disconfirming tests over confirming ones.
- Separate facts from inferences.
- Say "I cannot verify this" when the evidence is not there.
- Do not soften a negative verdict just because the work looks close.

## Practical Guidance

- If the agent claims code is fixed but no test or code path proves it, mark it `Not Verified` or `Partially Verified`.
- If the agent claims research is correct but sources only support part of the conclusion, narrow the conclusion.
- If the review says "no issues found," do an independent pass rather than accepting the statement.
- If the user asked whether something is done, answer that directly before giving suggestions.

## Scope Control

Be thorough, but do not expand the audit arbitrarily. Stay anchored to the user's ask and the claims made in the current conversation.

If a full verification requires tools or evidence not available in the current context, say exactly what is missing and how to obtain it.
