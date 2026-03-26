Product Principles for FocusBro
=================================

Purpose
-------
FocusBro helps people build short, consistent habits for focus and wellbeing. These principles guide product, design, and engineering decisions so that features remain aligned with user needs and long-term maintainability.

Core Principles
---------------

- User-first clarity: Build for real user goals — reduced friction, clear outcomes, and predictable feedback. Prioritize features that produce measurable user benefit in minutes, not months.
- Lightweight & reliable: Prefer small, fast experiences that work everywhere, even on flaky networks or low-power devices. Fail gracefully and surface actionable messages.
- Privacy-by-default: Collect the minimum data needed. Provide local-first defaults and clear, explicit opt-ins for syncing or analytics.
- Accessibility and inclusivity: Design and ship features that work for as many people as possible. Prioritize semantic HTML, keyboard navigation, ARIA where needed, and good color contrast.
- Observability & safe defaults: Log actionable errors, surface health metrics, and avoid silent failures. Defaults should be safe for users and production-ready.
- Iterative simplicity: Ship small, testable increments. Prefer composition over heavy abstractions; keep APIs and UX simple and predictable.
- Resilience & recoverability: Auto-retry non-destructive network operations, provide clear undo or recovery paths, and avoid data loss.
- Developer empathy: Code should be readable, well-tested, and documented. Prefer explicitness over cleverness and avoid silent catches or hidden side-effects.
- Performance matters: Optimize for perceived performance (first paint, interactive time) before adding visual complexity.
- Maintainable compatibility: Support progressive enhancement — modern features when available, robust fallbacks when not.

Engineering Practices
--------------------

- Observable errors: Never swallow exceptions silently. Log contextual info and either handle or bubble errors so they can be monitored.
- Defensive parsing: Handle multiple response shapes from external systems (`response?.results || response || []`).
- Avoid unbounded loops: Add safe iteration limits and fail-safe break conditions.
- Use environment-appropriate APIs: Cloudflare Worker bindings use the `env` parameter rather than `process.env`.
- Automated tests + CI: Every change touching core logic must include unit tests; CI must run tests before deployment.

Decision Guidance
-----------------

- If a feature increases complexity, require a clear success metric and a rollback plan.
- For privacy-impacting changes, require a short privacy summary in the PR description.
- For performance-impacting changes, include before/after metrics in PR.

How to use this doc
-------------------

Product managers, designers, and engineers should reference these principles when drafting specs, reviewing PRs, and making tradeoffs during planning sessions.
