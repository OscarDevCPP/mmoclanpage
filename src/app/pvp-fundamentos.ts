import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { afterNextRender, Component, DestroyRef, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PVP_GUIDE } from './pvp-guide';
import type { InlineRun } from './guide-content';

@Component({
  selector: 'app-pvp-fundamentos',
  imports: [NgTemplateOutlet, RouterLink],
  templateUrl: './pvp-fundamentos.html',
  styleUrl: './pvp-fundamentos.css',
})
export class PvpFundamentos {
  readonly sections = PVP_GUIDE;
  readonly contents = [
    { id: 'introduccion-competitivo', title: '¿Qué es competir en Singles?' },
    { id: 'introduccion-turno', title: 'Un turno, varias preguntas' },
    { id: 'introduccion-plan', title: 'Un equipo con un plan' },
    { id: 'introduccion-practica', title: 'Antes de combatir' },
  ];

  constructor() {
    const route = inject(ActivatedRoute);
    const router = inject(Router);
    const document = inject(DOCUMENT);
    const destroyRef = inject(DestroyRef);
    // Angular suppresses its initial Scroll event during hydration. Restore only
    // an initial guide fragment after rendering; later navigation stays with Router.
    const initialFragment = router.lastSuccessfulNavigation() === null ? route.snapshot.fragment : null;
    if (initialFragment && this.sections.some(section => section.id === initialFragment)) {
      afterNextRender(() => {
        if (!destroyRef.destroyed && route.snapshot.fragment === initialFragment) {
          document.getElementById(initialFragment)?.scrollIntoView({ block: 'start', behavior: 'instant' });
        }
      });
    }
    const meta = inject(Meta);
    const previous = meta.getTag('name="description"')?.content;
    meta.updateTag({ name: 'description', content: 'Introducción al competitivo Singles: decisiones, planes y primeros pasos en PvP para la comunidad de Black Talon.' });
    destroyRef.onDestroy(() => {
      if (previous !== undefined) meta.updateTag({ name: 'description', content: previous });
      else meta.removeTag('name="description"');
    });
  }

  href(run: InlineRun): string | undefined { return run.marks.find(mark => mark.kind === 'link')?.href; }
  has(run: InlineRun, kind: 'strong' | 'emphasis'): boolean { return run.marks.some(mark => mark.kind === kind); }
}
