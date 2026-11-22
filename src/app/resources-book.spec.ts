import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import type { Book } from '@openpageflip/core';
import { BOOK_LOADER, ResourcesBook } from './resources-book';
import { BookMeasure } from './book-measure';
import { sectionFragments } from './book-fragments';

function mockBook(): Book {
  return {
    page: 0, pageCount: 7, orientation: 'portrait', state: 'read', rect: { left: 0, top: 0, width: 0, height: 0, pageWidth: 0 },
    on: vi.fn(() => () => {}), off: vi.fn(), flipTo: vi.fn(async () => true),
    flipNext: vi.fn(async () => true), flipPrev: vi.fn(async () => true),
    turnTo: vi.fn(), turnNext: vi.fn(), turnPrev: vi.fn(), setPages: vi.fn(), update: vi.fn(), redraw: vi.fn(), destroy: vi.fn(),
  };
}
function fakeLayout() {
  vi.spyOn(BookMeasure.prototype, 'paginate').mockImplementation(async sections => sections.map(section => {
    const fragments = sectionFragments(section);
    return { section: section.id, fragments, position: { section: section.id, block: fragments[0].block, offset: 0 } };
  }));
}
async function settle() { await new Promise(resolve => setTimeout(resolve, 80)); }

describe('Libro de Recursos', () => {
  afterEach(() => { document.documentElement.style.fontSize = ''; history.replaceState(null, '', '/'); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
  it('genera hojas en clones privados a partir del mismo documento y destruye el motor', async () => {
    fakeLayout(); const book = mockBook(); const createBook = vi.fn(() => book);
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: BOOK_LOADER, useValue: async () => ({ createBook }) }] });
    const fixture = TestBed.createComponent(ResourcesBook); fixture.detectChanges(); await settle(); fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(createBook).toHaveBeenCalledOnce();
    expect(host.querySelector('.book-source')?.hasAttribute('hidden')).toBe(true);
    expect(host.querySelectorAll('.book-stage > .page')).toHaveLength(8);
    expect(host.querySelectorAll('.book-stage [id]')).toHaveLength(0);
    expect(host.querySelector('.book-stage')?.textContent).toContain('Fuentes conceptuales');
    expect(host.querySelectorAll('.book-stage li a[href="#introduccion-competitivo"]')).toHaveLength(1);
    expect(host.querySelector('.book-stage')?.textContent).not.toContain('Catálogo alfabético');
    fixture.destroy(); expect(book.destroy).toHaveBeenCalledOnce();
  });
  it('monta clones y repagina con el motor real', async () => {
    fakeLayout();
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener() {}, removeEventListener() {} }));
    vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
    const real = await import('@openpageflip/core');
    let book!: Book;
    const createBook = (root: HTMLElement, options: Parameters<typeof real.createBook>[1]) => {
      Object.defineProperties(root, { clientWidth: { value: 1000 }, clientHeight: { value: 700 } });
      return book = real.createBook(root, options);
    };
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: BOOK_LOADER, useValue: async () => ({ createBook }) }] });
    const fixture = TestBed.createComponent(ResourcesBook); fixture.detectChanges(); await settle();
    expect(fixture.componentInstance.ready()).toBe(true);
    expect(book.pageCount).toBe(8);
    fixture.componentInstance.schedule(); await settle();
    expect(book.pageCount).toBe(8);
    expect((fixture.nativeElement as HTMLElement).querySelectorAll('.book-stage > .page')).toHaveLength(8);
    fixture.destroy();
  });
  it.each(['pvp-basico', 'pvp-avanzado'])('conserva el destino exacto %s cuando cambia la distribución', async target => {
    let enlarged = false;
    vi.spyOn(BookMeasure.prototype, 'paginate').mockImplementation(async sections => sections.flatMap(section => {
      const fragments = sectionFragments(section);
      const cut = section.id === 'indice' && enlarged ? fragments.findIndex(fragment => fragment.block === target) : -1;
      const parts = cut > 0 ? [fragments.slice(0, cut), fragments.slice(cut)] : [fragments];
      return parts.map(part => ({ section: section.id, fragments: part, position: { section: section.id, block: part[0].itemId ?? part[0].block, offset: part[0].start } }));
    }));
    const book = mockBook();
    const createBook = (root: HTMLElement) => { vi.mocked(book.setPages).mockImplementation(pages => { root.append(...Array.from(pages)); }); return book; };
    history.replaceState(null, '', '/compendio#indice');
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: BOOK_LOADER, useValue: async () => ({ createBook }) }] });
    const fixture = TestBed.createComponent(ResourcesBook); fixture.detectChanges(); await settle();
    const host = fixture.nativeElement as HTMLElement;
    host.querySelector<HTMLAnchorElement>(`.book-stage a[href="#${target}"]`)!.click(); await Promise.resolve();
    expect(history.state.compendioPosition).toEqual({ section: 'indice', block: target, offset: 0 });
    expect((document.activeElement as HTMLElement).dataset['logicalBlock']).toBe(target);
    expect(fixture.componentInstance.current()).toBe(2);
    enlarged = true; document.documentElement.style.fontSize = '200%'; fixture.componentInstance.schedule(); await settle();
    const pages = host.querySelectorAll<HTMLElement>('.book-stage > .page');
    expect(fixture.componentInstance.current()).toBe(3);
    expect(pages[3].inert).toBe(false);
    expect((document.activeElement as HTMLElement).dataset['logicalBlock']).toBe(target);
    expect(history.state.compendioPosition).toEqual({ section: 'indice', block: target, offset: 0 });
    const home = host.querySelector<HTMLElement>('.book-tools .home')!; home.focus();
    fixture.componentInstance.schedule(); await settle(); expect(document.activeElement).toBe(home);
    document.documentElement.style.fontSize = ''; fixture.destroy();
  });
  it.each(['pvp-basico', 'pvp-avanzado'])('restaura directamente el bloque lógico %s', async target => {
    fakeLayout(); const book = mockBook(); history.replaceState(null, '', `/compendio#${target}`);
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: BOOK_LOADER, useValue: async () => ({ createBook: () => book }) }] });
    const fixture = TestBed.createComponent(ResourcesBook); fixture.detectChanges(); await settle();
    expect(history.state.compendioPosition).toEqual({ section: 'indice', block: target, offset: 0 });
    expect((document.activeElement as HTMLElement).dataset['logicalBlock']).toBe(target);
    fixture.componentInstance.restore(); await Promise.resolve();
    expect((document.activeElement as HTMLElement).dataset['logicalBlock']).toBe(target);
    fixture.destroy();
  });
  it('restaura una posición de rama exacta desde una entrada con el mismo hash', async () => {
    fakeLayout(); const book = mockBook(); history.replaceState(null, '', '/compendio#indice');
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: BOOK_LOADER, useValue: async () => ({ createBook: () => book }) }] });
    const fixture = TestBed.createComponent(ResourcesBook); fixture.detectChanges(); await settle();
    const position = { section: 'indice', block: 'pvp-avanzado', offset: 0 };
    history.replaceState({ compendioPosition: position, compendioHash: 'indice' }, '', '/compendio#indice');
    fixture.componentInstance.restore(); await Promise.resolve();
    expect((document.activeElement as HTMLElement).dataset['logicalBlock']).toBe('pvp-avanzado');
    expect(history.state.compendioPosition).toEqual(position);
    fixture.destroy();
  });
  it('guarda posiciones por giro incluso cuando el hash se repite', async () => {
    vi.spyOn(BookMeasure.prototype, 'paginate').mockImplementation(async sections => sections.flatMap(section => {
      const fragments = sectionFragments(section);
      const parts = section.id === 'indice' ? [fragments.slice(0, 2), fragments.slice(2)] : [fragments];
      return parts.map(part => ({ section: section.id, fragments: part, position: { section: section.id, block: part[0].itemId ?? part[0].block, offset: part[0].start } }));
    }));
    const book = mockBook();
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: BOOK_LOADER, useValue: async () => ({ createBook: () => book }) }] });
    const fixture = TestBed.createComponent(ResourcesBook); fixture.detectChanges(); await settle();
    await fixture.componentInstance.go(2); const first = history.state.compendioPosition;
    await fixture.componentInstance.go(3); expect(history.state.compendioPosition).not.toEqual(first);
    expect(location.hash).toBe('#indice'); expect(book.turnTo).toHaveBeenCalledWith(3);
    history.replaceState({ compendioPosition: first, compendioHash: 'indice' }, '', '#indice'); fixture.componentInstance.restore(); await Promise.resolve();
    expect(book.turnTo).toHaveBeenCalledWith(2);
    fixture.destroy();
  });
  it.each([
    ['/compendio', '/', '?vista=guia'],
    ['/mmoclanpage/compendio', '/mmoclanpage/', '?vista=guia'],
  ])('mantiene la ruta %s y la consulta con base %s al girar', async (path, base, search) => {
    fakeLayout(); const book = mockBook();
    const baseElement = document.createElement('base'); baseElement.href = base; document.head.prepend(baseElement);
    history.replaceState(null, '', `${path}${search}#indice`);
    try {
      TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: BOOK_LOADER, useValue: async () => ({ createBook: () => book }) }] });
      const fixture = TestBed.createComponent(ResourcesBook); fixture.detectChanges(); await settle();
      await fixture.componentInstance.go(2);
      expect(location.pathname).toBe(path); expect(location.search).toBe(search); expect(location.hash).toBe('#indice');
      expect(history.state.compendioPosition.section).toBe('indice');
      fixture.componentInstance.restore(); await Promise.resolve(); expect(book.turnTo).toHaveBeenCalledWith(2);
      fixture.destroy();
    } finally { baseElement.remove(); }
  });
  it('descarta una medición antigua y conserva la edición hasta obtener la nueva', async () => {
    fakeLayout(); const book = mockBook();
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: BOOK_LOADER, useValue: async () => ({ createBook: () => book }) }] });
    const fixture = TestBed.createComponent(ResourcesBook); fixture.detectChanges(); await settle();
    let resolve!: (value: Awaited<ReturnType<BookMeasure['paginate']>>) => void;
    const old = new Promise<Awaited<ReturnType<BookMeasure['paginate']>>>(r => { resolve = r; });
    const measurement = vi.mocked(BookMeasure.prototype.paginate);
    const original = measurement.getMockImplementation()!;
    measurement.mockImplementationOnce(() => old);
    fixture.componentInstance.schedule(); await settle();
    fixture.componentInstance.schedule();
    expect(book.setPages).not.toHaveBeenCalled();
    resolve(await original([], 1, 1)); await settle();
    expect(book.setPages).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.pageCount()).toBe(8);
    fixture.destroy();
  });
  it('redirige un alias alfabético a la rama PvP sin renderizar el catálogo', async () => {
    fakeLayout(); const book = mockBook(); history.replaceState(null, '', '/#pvp-alfabetico-2');
    const createBook = vi.fn(() => book);
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: BOOK_LOADER, useValue: async () => ({ createBook }) }] });
    const fixture = TestBed.createComponent(ResourcesBook); fixture.detectChanges(); await settle();
    expect(createBook).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ startPage: 2 }));
    expect((fixture.nativeElement as HTMLElement).querySelector('.book-stage')?.textContent).not.toContain('Catálogo alfabético');
    fixture.destroy();
  });
  it('ignora la resolución de un giro al destruir la vista', async () => {
    fakeLayout(); const book = mockBook();
    let finish!: (value: boolean) => void;
    vi.mocked(book.flipTo).mockReturnValue(new Promise<boolean>(resolve => { finish = resolve; }));
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: BOOK_LOADER, useValue: async () => ({ createBook: () => book }) }] });
    const fixture = TestBed.createComponent(ResourcesBook); fixture.detectChanges(); await settle();
    const turn = fixture.componentInstance.go(3, false); fixture.destroy(); finish(true); await turn;
    expect(book.turnTo).not.toHaveBeenCalled(); expect(book.destroy).toHaveBeenCalledOnce();
  });
  it('conserva posición y foco durante una repaginación', async () => {
    fakeLayout(); const book = mockBook();
    const createBook = (root: HTMLElement) => { vi.mocked(book.setPages).mockImplementation(pages => { root.append(...Array.from(pages)); }); return book; };
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: BOOK_LOADER, useValue: async () => ({ createBook }) }] });
    const fixture = TestBed.createComponent(ResourcesBook); fixture.detectChanges(); await settle();
    await fixture.componentInstance.go(3, false);
    const old = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('.book-stage > .page')[3];
    old.querySelector<HTMLElement>('h2')?.focus();
    fixture.componentInstance.schedule(); await settle();
    const replacement = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('.book-stage > .page')[3];
    expect(fixture.componentInstance.current()).toBe(3);
    expect(replacement.contains(document.activeElement)).toBe(true);
    fixture.destroy();
  });
  it('no inicia el motor si la importación llega después de destruir la vista', async () => {
    let resolve!: (value: { createBook: () => Book }) => void;
    const pending = new Promise<{ createBook: () => Book }>(r => { resolve = r; });
    const createBook = vi.fn(mockBook);
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: BOOK_LOADER, useValue: () => pending }] });
    const fixture = TestBed.createComponent(ResourcesBook); fixture.detectChanges(); await settle(); fixture.destroy();
    resolve({ createBook }); await pending; await Promise.resolve(); expect(createBook).not.toHaveBeenCalled();
  });
  it('conserva el documento y enlaces de salida si falla la importación', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: BOOK_LOADER, useValue: async () => { throw Error('offline'); } }] });
    const fixture = TestBed.createComponent(ResourcesBook); fixture.detectChanges(); await settle(); fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.book-source')?.hasAttribute('hidden')).toBe(false);
    expect(host.textContent).toContain('Eventos del juego');
    expect(host.querySelector('.fallback-home')).not.toBeNull();
    fixture.destroy();
  });
});
