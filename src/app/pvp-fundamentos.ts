import { NgTemplateOutlet } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
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
    { id: 'introduccion-competitivo', title: 'Introducción al competitivo' },
    { id: 'introduccion-turno', title: 'Un turno, varias preguntas' },
    { id: 'introduccion-plan', title: 'Un equipo con un plan' },
    { id: 'introduccion-practica', title: 'Antes de combatir' },
  ];

  constructor() {
    const meta = inject(Meta);
    const previous = meta.getTag('name="description"')?.content;
    meta.updateTag({ name: 'description', content: 'Introducción al competitivo Singles: decisiones, planes y primeros pasos en PvP para la comunidad de Black Talon.' });
    inject(DestroyRef).onDestroy(() => {
      if (previous !== undefined) meta.updateTag({ name: 'description', content: previous });
      else meta.removeTag('name="description"');
    });
  }

  href(run: InlineRun): string | undefined { return run.marks.find(mark => mark.kind === 'link')?.href; }
  has(run: InlineRun, kind: 'strong' | 'emphasis'): boolean { return run.marks.some(mark => mark.kind === kind); }
}
