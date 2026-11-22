import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import type { BookFragment } from './book-fragments';
import type { InlineRun } from './book-content';

/** Shared renderer for the document, offscreen measuring surface and generated leaves. */
@Component({
  selector: 'app-book-renderer',
  imports: [NgTemplateOutlet],
  template: `
    @for (group of groups(); track $index) {
      @let fragment = group[0];
      @switch (fragment.kind) {
        @case ('heading') {
          @if (fragment.level === 2) { <h2 tabindex="-1" [attr.data-logical-block]="fragment.block" [attr.id]="anchors() ? fragment.block : null"><ng-container *ngTemplateOutlet="runs; context: { $implicit: fragment.runs }" /></h2> }
          @else { <h3 tabindex="-1" [attr.data-logical-block]="fragment.block" [attr.id]="anchors() ? fragment.block : null"><ng-container *ngTemplateOutlet="runs; context: { $implicit: fragment.runs }" /></h3> }
        }
        @case ('paragraph') { <p tabindex="-1" [attr.data-logical-block]="fragment.block" [class.diagram-description]="fragment.block.endsWith('-diagrama')"><ng-container *ngTemplateOutlet="runs; context: { $implicit: fragment.runs }" /></p> }
        @case ('item') {
          @if (fragment.section === 'indice' && fragment.block.startsWith('pvp-')) {
            <ol class="book-tree" aria-label="Guías de PvP"><li class="book-tree-branch" [attr.aria-label]="branchLabel(fragment.block)"><ol [attr.aria-label]="branchLabel(fragment.block)"><ng-container *ngTemplateOutlet="items; context: { $implicit: group }" /></ol></li></ol>
          } @else if (fragment.ordered) { <ol><ng-container *ngTemplateOutlet="items; context: { $implicit: group }" /></ol> }
          @else { <ul><ng-container *ngTemplateOutlet="items; context: { $implicit: group }" /></ul> }
        }
        @case ('diagram') {
          @if (fragment.block === 'introduccion-turno-diagrama') {
            <svg class="book-diagram" tabindex="-1" [attr.data-logical-block]="fragment.block" viewBox="0 0 300 190" role="img" [attr.aria-label]="fragment.description"><rect x="25" y="5" width="250" height="38" rx="8"/><text x="150" y="29">¿Qué amenaza hay?</text><path d="M150 43v18 M75 100v20 M225 100v20"/><rect x="12" y="61" width="126" height="39" rx="8"/><rect x="162" y="61" width="126" height="39" rx="8"/><text x="75" y="78">¿Atacar ayuda</text><text x="75" y="94">al plan?</text><text x="225" y="78">¿Cambio útil?</text><text x="225" y="94">¿Qué riesgo?</text><rect x="30" y="120" width="240" height="52" rx="8"/><text x="150" y="141">Elegir, observar</text><text x="150" y="160">y ajustar</text></svg>
          } @else {
            <svg class="book-diagram" tabindex="-1" [attr.data-logical-block]="fragment.block" viewBox="0 0 300 115" role="img" [attr.aria-label]="fragment.description"><rect x="5" y="8" width="110" height="38" rx="8"/><rect x="185" y="8" width="110" height="38" rx="8"/><rect x="95" y="70" width="110" height="38" rx="8"/><path d="M115 27h70 M150 46v24"/><text x="60" y="33">Apoyo</text><text x="240" y="33">Atacante</text><text x="150" y="95">Defensa</text></svg>
          }
        }
      }
    }
    <ng-template #items let-entries>
      @for (entry of entries; track $index) { <li tabindex="-1" [attr.data-logical-block]="entry.itemId ?? entry.block" [attr.value]="entry.ordinal ?? null" [class.book-item-continuation]="entry.start > 0"><ng-container *ngTemplateOutlet="runs; context: { $implicit: entry.runs }" /></li> }
    </ng-template>
    <ng-template #runs let-items>
      @for (run of items; track $index) {
        @if (href(run); as url) { <a [href]="url"><ng-container *ngTemplateOutlet="marked; context: { $implicit: run }" /></a> }
        @else { <ng-container *ngTemplateOutlet="marked; context: { $implicit: run }" /> }
      }
    </ng-template>
    <ng-template #marked let-run>
      @if (has(run, 'strong')) { <strong>@if (has(run, 'emphasis')) {<i>{{run.text}}</i>} @else {<ng-container>{{run.text}}</ng-container>}</strong> }
      @else if (has(run, 'emphasis')) {<i>{{run.text}}</i>}
      @else {<ng-container>{{run.text}}</ng-container>}
    </ng-template>
  `,
  styles: `:host { display: contents; }`,
})
export class BookRenderer {
  readonly fragments = input.required<readonly BookFragment[]>();
  readonly anchors = input(false);
  readonly groups = computed(() => {
    const groups: BookFragment[][] = [];
    for (const fragment of this.fragments()) {
      const previous = groups.at(-1);
      if (fragment.kind === 'item' && previous?.[0].kind === 'item' && previous[0].block === fragment.block) previous.push(fragment);
      else groups.push([fragment]);
    }
    return groups;
  });
  branchLabel(block: string): string { return block.includes('basico') ? 'Básico' : block.includes('intermedio') ? 'Intermedio' : 'Avanzado'; }
  href(run: InlineRun): string | undefined { return run.marks.find(mark => mark.kind === 'link')?.href; }
  has(run: InlineRun, kind: 'strong' | 'emphasis'): boolean { return run.marks.some(mark => mark.kind === kind); }
}
