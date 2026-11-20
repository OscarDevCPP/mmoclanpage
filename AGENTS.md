# Agent Guide

## How to Use

Read [the constitution](.agents/docs/constitution.md) before project work, then load the skill matching the task. This file is an index; procedures live in skills. Preserve existing Spanish documents in their original language.

Keep environment changes project-local. Do not install or trial OpenPencil. Generic upstream skill suggestions do not authorize global installations, scaffolding, or additional dependencies.

## Skills

| Name | When to use | Path |
| --- | --- | --- |
| mmoclanpage-workflow | Starting project work, checking current readiness, or preparing an authorized change | [.agents/skills/mmoclanpage-workflow/SKILL.md](.agents/skills/mmoclanpage-workflow/SKILL.md) |
| angular-new-app | Creating the Angular application once requested | [.agents/skills/angular-new-app/SKILL.md](.agents/skills/angular-new-app/SKILL.md) |
| angular-developer | Implementing Angular features, architecture, styling, or tests | [.agents/skills/angular-developer/SKILL.md](.agents/skills/angular-developer/SKILL.md) |
| frontend-design | Establishing visual direction or building and reshaping UI | [.agents/skills/frontend-design/SKILL.md](.agents/skills/frontend-design/SKILL.md) |
| web-design-guidelines | Reviewing existing UI for usability and accessibility issues | [.agents/skills/web-design-guidelines/SKILL.md](.agents/skills/web-design-guidelines/SKILL.md) |
| write-docs-github (global, if available) | Creating, updating, or reviewing project documentation | — |

## Documentation

| Resource | When to read |
| --- | --- |
| [Constitution](.agents/docs/constitution.md) | Before work that depends on purpose, scope, priorities, or unresolved decisions |
| [Alcance de contenidos de la web](docs/alcance-de-contenidos.md) | Defining or implementing content; this Spanish document is the agreed content reference |
| [Local skill sources](.agents/skills/SOURCES.md) | Reviewing skill provenance, licenses, or updates and the MCP version pin |

## Tools

MCP availability depends on the operator's environment; verify access when needed. User-level servers are not team prerequisites. Do not send secrets in external queries.

| Server | When to use and constraints |
| --- | --- |
| angular-cli (project-local) | Official Angular documentation and best practices. Configured with CLI 22.2.7 and `--read-only`; this is a tool version, not an application version. Align documentation with the application version once one exists. |
| context7 (user-level) | Library and framework documentation, including dependencies beyond Angular. Queries go to an external service; check version and source. |
| gh_grep (user-level) | Public GitHub code examples when useful; examples are not authoritative project requirements. |
| raven (user-level) | Project context and tracked work, subject to inherited identity and lifecycle controls. No project identity has been resolved; do not guess a reference or register automatically. |
| engram (user-level) | Relevant collaborative knowledge when available; historical records do not establish current scope or permission. |
