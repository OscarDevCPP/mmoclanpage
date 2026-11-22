import { describe, expect, it } from 'vitest';
import { BOOK_GUIDE } from './book-guide';
import { BOOK_INDEX } from './book-index';
import { paginateSections, sectionFragments } from './book-fragments';
import type { BookSection } from './book-content';
import { adaptDiagrams, BookMeasure } from './book-measure';
import { BookRenderer } from './book-renderer';
import { TestBed } from '@angular/core/testing';

const allText = (section: BookSection) => sectionFragments(section).flatMap(f => f.runs).map(r => r.text).join('');
describe('documento y paginación', () => {
  it('contiene las cuatro secciones, atribuciones y el índice único de veinticuatro temas', () => {
    expect(BOOK_GUIDE).toHaveLength(4);
    const text = BOOK_GUIDE.map(allText).join('');
    expect(text).toContain('Fuentes conceptuales:');
    expect(text).not.toContain('catálogo alfabético');
    const index = sectionFragments(BOOK_INDEX);
    expect(index.filter(f => f.kind === 'item')).toHaveLength(24);
    const topicLinks = index.filter(f => f.kind === 'item').flatMap(f => f.runs).filter(r => r.marks.some(m => m.kind === 'link'));
    expect(topicLinks).toHaveLength(1);
    expect(BookMeasure).toBeDefined();
  });
  it('fragmenta texto sin perder caracteres ni marcas y separa secciones', async () => {
    const sections: BookSection[] = [{ id: 'a', blocks: [{ kind: 'paragraph', id: 'p', runs: [{ text: 'uno dos tres cuatro', marks: [{ kind: 'strong' }] }] }] }, { id: 'b', blocks: [{ kind: 'paragraph', id: 'q', runs: [{ text: 'cinco', marks: [] }] }] }];
    const leaves = await paginateSections(sections, async fs => fs.flatMap(f => f.runs).map(r => r.text).join('').length <= 8);
    expect(leaves.map(l => l.section)).toEqual(['a', 'a', 'a', 'b']);
    expect(leaves.flatMap(l => l.fragments).flatMap(f => f.runs).map(r => r.text).join('')).toBe('uno dos tres cuatrocinco');
    expect(leaves[1].position.offset).toBeGreaterThan(0);
    expect(leaves[0].fragments[0].runs[0].marks).toEqual([{ kind: 'strong' }]);
  });
  it('mantiene ordinal y enlace al dividir un elemento y respeta grafemas', async () => {
    const item: BookSection = { id: 's', blocks: [{ kind: 'list', id: 'list', ordered: true, items: [{ id: 'item', ordinal: 7, runs: [{ text: '👩‍👩‍👧‍👦abc', marks: [{ kind: 'link', href: '#x' }] }] }] }] };
    const leaves = await paginateSections([item], async fs => fs[0].runs.map(r => r.text).join('').length <= 11);
    expect(leaves).toHaveLength(2);
    expect(leaves[0].fragments[0].runs[0].text).toBe('👩‍👩‍👧‍👦');
    expect(leaves[1].fragments[0].ordinal).toBe(7);
    expect(leaves[1].fragments[0].runs[0].marks).toEqual([{ kind: 'link', href: '#x' }]);
    expect(leaves[1].position.block).toBe('item');
  });
  it('representa enlaces y énfasis sin interpretar HTML', () => {
    const fixture = TestBed.createComponent(BookRenderer);
    fixture.componentRef.setInput('fragments', [{ section: 's', block: 'p', kind: 'paragraph', start: 0, end: 4, runs: [{ text: '<ok>', marks: [{ kind: 'strong' }, { kind: 'link', href: 'https://example.org' }] }] }]);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('a strong')?.textContent).toBe('<ok>');
    expect(root.querySelector('ok')).toBeNull();
    fixture.destroy();
  });
  it('preserva el SVG cuando cabe y adapta el equivalente para poder fragmentarlo', async () => {
    const original: BookSection[] = [{ id: 's', blocks: [{ kind: 'diagram', id: 'introduccion-turno-diagrama', description: 'amenaza ataque cambio y ajuste' }] }];
    expect(adaptDiagrams(original, 320, 300, 16)[0].blocks[0].kind).toBe('diagram');
    const adapted = adaptDiagrams(original, 180, 300, 32);
    expect(adapted[0].blocks[0].kind).toBe('paragraph');
    const leaves = await paginateSections(adapted, async fs => fs[0].runs.map(r => r.text).join('').length <= 10);
    expect(leaves.flatMap(l => l.fragments).flatMap(f => f.runs).map(r => r.text).join('')).toBe('amenaza ataque cambio y ajuste');
    const fixture = TestBed.createComponent(BookRenderer);
    fixture.componentRef.setInput('fragments', sectionFragments(original[0])); fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('svg[role="img"]')).not.toBeNull();
    fixture.destroy();
  });
  it('informa si un bloque indivisible no cabe', async () => {
    await expect(paginateSections([{ id: 's', blocks: [{ kind: 'diagram', id: 'd', description: 'diagrama' }] }], async () => false)).rejects.toThrow('Indivisible');
  });
});
