# Review Standard

Review every pull request in this order.

## 1. Business / Domain validation
Check the requested outcome first.

Questions:
- Does the implementation solve the referenced issue?
- Are all acceptance criteria satisfied?
- Has unnecessary scope been introduced?

Severity:
- 🔴 Must fix before merge: issue is not solved, acceptance criteria are missing, or extra scope changes the intended outcome
- 🟡 Should improve: intent is mostly correct but parts are unclear or under-validated
- 🟢 Nice future improvements: follow-up ideas that are explicitly out of scope for this PR

## 2. Architecture validation
Check structure before style.

Questions:
- Is the layering correct?
- Do dependencies point in the right direction?
- Are Domain Models and DTOs kept separate?
- Does the planner contract preserve one source of truth for Markdown and DAG output?
- Do changes follow Next.js App Router conventions?

Severity:
- 🔴 Must fix before merge: wrong layer ownership, reversed dependencies, DTO/domain leakage, broken planner contract, or App Router misuse
- 🟡 Should improve: structure works but can be simplified or made clearer
- 🟢 Nice future improvements: future refactors that are not required for correctness now

## 3. Code quality
Review implementation quality last.

Questions:
- Is the code readable?
- Is it correct?
- Is it simple?
- Is it maintainable?

Severity:
- 🔴 Must fix before merge: correctness defects, fragile logic, or code that is too complex to safely maintain
- 🟡 Should improve: readability or maintainability issues that do not block release
- 🟢 Nice future improvements: optional cleanup that can wait

## 4. Merge recommendation
End every review with a clear recommendation:
- Approve
- Request changes
- Approve with follow-up notes

When requesting changes, separate them by severity:
- 🔴 Must fix before merge
- 🟡 Should improve
- 🟢 Nice future improvements
