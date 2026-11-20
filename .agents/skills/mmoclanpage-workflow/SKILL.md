---
name: mmoclanpage-workflow
description: Prepare and carry out authorized work on the PokeMMO clan website. Use when starting project work, checking development readiness, or changing content, Angular features, documentation, or local agent tooling.
metadata:
  author: "OscarDevCPP"
  version: "1.0.0"
---

# PokeMMO Clan Website Workflow

1. Read [the constitution](../../docs/constitution.md) for purpose, boundaries, current baseline, and unresolved decisions. For content or UI tasks, also read [the agreed content scope](../../../docs/alcance-de-contenidos.md); preserve its Spanish text.
2. Inspect current files before changing them. The initialization baseline has no Angular workspace; check again rather than assuming either that it exists or that it is still absent. Confirm the requested outcome and preserve unrelated work.
3. Load the matching local skill: `angular-new-app` for authorized scaffolding, `angular-developer` for Angular work, `frontend-design` for visual design, or `web-design-guidelines` for UI review. Use the global `write-docs-github` skill for documentation if available. Consult [skill provenance](../SOURCES.md) when updating vendored skills.
4. Before scaffolding, resolve material application choices with the user. Do not overwrite this project index with generated AI instructions. Keep tooling local; upstream suggestions to install globally or add Tailwind do not establish project approval.
5. For Angular questions, use the project Angular MCP documentation and best-practice tools when available, with documentation aligned to the actual application version. Context7 can supplement dependency documentation. The MCP CLI pin alone is not an application version.
6. Validate only what exists and is relevant. For Markdown changes, inspect links and content against the request. Once an application exists, inspect its manifest, lockfile, scripts, and test configuration before selecting build or test commands. Do not invent commands or run unknown-effect scripts merely to verify documentation.
7. Report files changed, checks actually performed, and unresolved gaps. Distinguish static review, runtime checks, and visual inspection; do not imply deployment or activation from a file edit.
