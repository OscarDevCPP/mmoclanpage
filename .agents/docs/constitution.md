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

The repository now contains an Angular application and a first client-rendered presentation homepage for Black Talon [URSS], a growing Latin American PokeMMO clan. Its agreed visual direction uses retro and pixel-art accents while keeping body text readable. Local development, test, and build commands are documented in the README. The homepage presents the clan, its activities and leadership; it does not establish a backend or publishing workflow.

The global visual foundation uses Pixelify Sans for headings and Verdana for readable body text. Light and dark themes follow the system by default. A single borderless theme button shows the opposite theme's icon (moon in light mode, sun in dark mode), animates the transition unless reduced motion is requested, and remembers an explicit choice locally. Semantic visual tokens live in `src/styles.css`.

The homepage is a clan presentation, not a promotional landing page. Its sticky header has no in-page section navigation. The content is one column with only “Sobre nosotros” and “Actividades” sections, using bold uppercase headings underlined across the available width rather than bordered panels. Avoid repeated clan tags and keep regional context in the introduction. Leadership figures appear after the introduction in a wrapping flow, with individual replaceable transparent PNGs in `public/admins/`; their initial shared pixel character is original placeholder art, not an official PokeMMO asset. Informational sections are not focusable; keyboard focus remains visible on interactive controls.

Activities are Misiones, Sorteos, Eventos Semanales, and Academia 'Red Wings Academy'. Their links intentionally prevent navigation until dedicated pages are implemented; they do not establish routes or completed activity pages.

Resources and memories remain future content. Content storage, recurring publication, hosting, and deployment remain unresolved; the homepage is not evidence of a publishing mechanism.
