# Project Constitution

## Purpose

Build a website for the user's PokeMMO clan using Angular. The agreed content is recorded in [Alcance de contenidos de la web](../../docs/alcance-de-contenidos.md), in Spanish.

## Content and priorities

The website will present the clan, explain its activities, provide resources, and publish memories of shared events and moments. Resources and memories will grow over time. Use the content document for the details rather than duplicating it here.

Content scope was established before visual design. Do not turn possible layouts, tools, or upstream skill defaults into product decisions. Obtain actual clan details instead of inventing names, dates, leaders, activities, or event records.

## Environment boundaries

Skills and the Angular MCP were deliberately configured locally to this project. OpenPencil is not to be installed or tried for this setup. Preserve upstream skill files and their provenance; see [Local skill sources](../skills/SOURCES.md).

Existing Spanish documentation remains in its original language. The agent guidance introduced with this constitution is in English; communication with the user is in Spanish.

## Current state and unresolved decisions

At initialization, the project contains content documentation and local agent tooling, but no Angular workspace, package manifest, application code, test configuration, or CI. No build or test command is established yet. The MCP's Angular CLI 22.2.7 pin does not select the application's Angular version.

The clan's concrete details, activity descriptions, initial resources and memories still need input. Visual direction, rendering strategy, content storage and publishing workflow, hosting, and application dependency choices have not been agreed. In particular, recurring publication of memories is a requirement, not evidence of an implemented publishing mechanism.
