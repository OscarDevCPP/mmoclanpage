import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import type { Book } from '@openpageflip/core';
import { BOOK_LOADER, ResourcesBook } from './resources-book';

function mockBook(): Book {
  return {
    page: 0, pageCount: 6, orientation: 'portrait', state: 'read', rect: { left: 0, top: 0, width: 0, height: 0, pageWidth: 0 },
    on: vi.fn(() => () => {}), off: vi.fn(), flipTo: vi.fn(async () => true),
    flipNext: vi.fn(async () => true), flipPrev: vi.fn(async () => true),
    turnTo: vi.fn(), turnNext: vi.fn(), turnPrev: vi.fn(), setPages: vi.fn(), update: vi.fn(), redraw: vi.fn(), destroy: vi.fn(),
  };
}
describe('Libro de Recursos', () => {
  afterEach(() => { history.replaceState(null, '', '/'); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
  it('muestra la portada dedicada sin añadir paradas de teclado a páginas estáticas', async () => {
    const book = mockBook();
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: BOOK_LOADER, useValue: async () => ({ createBook: () => book }) }] });
    const fixture = TestBed.createComponent(ResourcesBook); await fixture.whenStable(); fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    for (const root of ['.book-source', '.book-stage']) {
      const cover = host.querySelector(`${root} > .cover`)!;
      expect(Array.from(host.querySelectorAll(`${root} .folio`), el => el.textContent)).toEqual(['El Compendio · Índice', 'El Compendio', 'El Compendio', 'El Compendio']);
      expect(host.querySelector(`${root} > section:last-child`)?.textContent).toContain('El Compendio en preparación');
      expect(cover.querySelector('h2')?.textContent).toBe('El Compendio');
      expect(cover.textContent).toContain('«Recopilación de conocimientos prácticos con mucho cariño para la comunidad»');
      expect(host.querySelectorAll(`${root} .page-inner[tabindex]`)).toHaveLength(0);
      expect(host.querySelectorAll(`${root} h2[tabindex="-1"]`)).toHaveLength(6);
      expect(host.querySelectorAll(`${root} a[href]`).length).toBeGreaterThan(0);
    }
    expect(host.querySelector('.replay')?.getAttribute('aria-label')).toBe('Volver a ver la presentación del Compendio');
    expect(host.querySelector('.replay')?.getAttribute('title')).toBe('Volver a ver la presentación del Compendio');
    fixture.destroy();
  });
  it('conserva el documento original, inicia sobre clones y destruye el motor', async () => {
    const book = mockBook(); const createBook = vi.fn(() => book);
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: BOOK_LOADER, useValue: async () => ({ createBook }) }] });
    const fixture = TestBed.createComponent(ResourcesBook); await fixture.whenStable(); fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(createBook).toHaveBeenCalledOnce();
    expect(host.querySelectorAll('.book-source > section')).toHaveLength(6);
    expect(host.querySelectorAll('.book-stage > section')).toHaveLength(6);
    expect(host.querySelector('.book-source')?.hasAttribute('hidden')).toBe(true);
    expect(host.textContent).toContain('Guías de PvP');
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    await fixture.componentInstance.go(2); expect(book.flipTo).toHaveBeenCalledWith(2);
    expect(navigate).toHaveBeenCalledWith([], expect.objectContaining({ fragment: 'pvp' })); expect(fixture.componentInstance.current()).toBe(2);
    let replayed = false; fixture.componentInstance.replay.subscribe(() => { replayed = true; });
    (host.querySelector('.replay') as HTMLButtonElement).click(); expect(replayed).toBe(true);
    fixture.destroy(); expect(book.destroy).toHaveBeenCalledOnce();
  });
  it.each([[2, 'pvp'], [4, 'eventos']] as const)('conserva #%s al cambiar en vivo entre pliego y retrato con el motor real', async (target, hash) => {
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener() {}, removeEventListener() {} }));
    vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
    let width = 1000; let height = 700;
    let book!: Book;
    const real = await import('@openpageflip/core');
    const createBook = (root: HTMLElement, options: Parameters<typeof real.createBook>[1]) => {
      Object.defineProperties(root, { clientWidth: { get: () => width }, clientHeight: { get: () => height } });
      book = real.createBook(root, options);
      return book;
    };
    history.replaceState(null, '', `/#${hash}`);
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: BOOK_LOADER, useValue: async () => ({ createBook }) }] });
    const fixture = TestBed.createComponent(ResourcesBook); await fixture.whenStable(); fixture.detectChanges();
    const pages = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('.book-stage > section'));
    const assertShown = (visible: number[]) => {
      pages.forEach((page, index) => {
        expect(page.style.display === 'block', `display ${index}`).toBe(visible.includes(index));
        expect(page.inert, `inert ${index}`).toBe(!visible.includes(index));
      });
      expect(location.hash).toBe(`#${hash}`);
      expect(fixture.componentInstance.current()).toBe(target);
    };
    expect(book.orientation).toBe('landscape');
    expect(book.page).toBe(target - 1);
    assertShown([target - 1, target]);
    pages[target].querySelector<HTMLElement>('h2')?.focus();
    width = 390; height = 844; book.update();
    expect(book.orientation).toBe('portrait'); expect(book.page).toBe(target);
    assertShown([target]);
    expect(document.activeElement).toBe(pages[target].querySelector('h2'));
    width = 1000; height = 700; book.update();
    expect(book.orientation).toBe('landscape'); expect(book.page).toBe(target - 1);
    assertShown([target - 1, target]);
    pages[target - 1].querySelector<HTMLElement>('h2')?.focus();
    width = 390; height = 844; book.update();
    expect(book.page).toBe(target); assertShown([target]);
    expect(document.activeElement).toBe(pages[target].querySelector('h2'));
    fixture.destroy();
  });
  it('no inicia el motor si la importación llega tras destruir la vista', async () => {
    let resolve!: (module: { createBook: () => Book }) => void;
    const pending = new Promise<{ createBook: () => Book }>(r => { resolve = r; });
    const createBook = vi.fn(mockBook);
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: BOOK_LOADER, useValue: () => pending }] });
    const fixture = TestBed.createComponent(ResourcesBook); fixture.detectChanges();
    await new Promise(r => setTimeout(r, 0)); fixture.destroy(); resolve({ createBook }); await pending; await Promise.resolve();
    expect(createBook).not.toHaveBeenCalled();
  });
  it('mantiene el destino de un giro interrumpido por cambio de orientación y procesa el siguiente', async () => {
    const book = mockBook();
    let orientationChanged!: () => void;
    vi.mocked(book.on).mockImplementation((name, listener) => {
      if (name === 'changeOrientation') orientationChanged = () => listener({ orientation: 'portrait' } as never);
      return () => {};
    });
    let finish!: (value: boolean) => void;
    vi.mocked(book.flipTo).mockReturnValueOnce(new Promise<boolean>(r => { finish = r; }));
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: BOOK_LOADER, useValue: async () => ({ createBook: () => book }) }] });
    const fixture = TestBed.createComponent(ResourcesBook); await fixture.whenStable();
    const first = fixture.componentInstance.go(2, false);
    void fixture.componentInstance.go(4, false);
    orientationChanged();
    expect(book.turnTo).toHaveBeenCalledWith(2);
    expect(fixture.componentInstance.current()).toBe(2);
    finish(false); await first; await Promise.resolve();
    expect(book.turnTo).toHaveBeenCalledWith(4);
    expect(fixture.componentInstance.current()).toBe(4);
    fixture.destroy(); expect(book.destroy).toHaveBeenCalledOnce();
  });
  it('ignora la resolución de un giro después de destruir la vista', async () => {
    const book = mockBook();
    let resolve!: (value: boolean) => void;
    vi.mocked(book.flipTo).mockReturnValue(new Promise<boolean>(r => { resolve = r; }));
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: BOOK_LOADER, useValue: async () => ({ createBook: () => book }) }] });
    const fixture = TestBed.createComponent(ResourcesBook); await fixture.whenStable();
    const turning = fixture.componentInstance.go(2, false);
    fixture.destroy(); resolve(true); await turning;
    expect(book.destroy).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.current()).toBe(0);
  });
  it('mantiene contenido y salida visibles si falla la importación', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: BOOK_LOADER, useValue: async () => { throw Error('offline'); } }] });
    const fixture = TestBed.createComponent(ResourcesBook); await fixture.whenStable(); fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(fixture.componentInstance.ready()).toBe(false);
    expect(host.querySelector('.book-source')?.hasAttribute('hidden')).toBe(false);
    expect(host.textContent).toContain('Eventos del juego');
    expect(host.querySelector('.fallback-home')).not.toBeNull();
    fixture.destroy();
  });
});
