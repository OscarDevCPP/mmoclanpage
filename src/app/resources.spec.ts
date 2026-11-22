import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { Resources } from './resources';

const key = 'black-talon.resources.presentation.v1';
describe('Recursos', () => {
  beforeEach(() => { localStorage.clear(); vi.spyOn(window, 'scrollTo').mockImplementation(() => {}); });
  afterEach(() => { localStorage.clear(); vi.restoreAllMocks(); });
  it('navega a la ruta y presenta referentes, categorías y repetición', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/recursos', Resources);
    expect(TestBed.inject(Router).url).toBe('/recursos');
    expect(document.title).toBe('El Compendio · Black Talon');
    expect(harness.routeNativeElement?.textContent).toContain('El Compendio · Escena 1/9');
    expect(harness.routeNativeElement?.textContent).toContain('¡Bienvenidos al Compendio!');
    const skip = harness.routeNativeElement?.querySelector('[aria-label="Saltar al Compendio"]');
    expect(skip?.getAttribute('title')).toBe('Saltar al Compendio');
    expect(skip?.getAttribute('data-tooltip')).toBe('Saltar al Compendio');
    component.index.set(component.scenes.length - 1); harness.detectChanges();
    const finish = harness.routeNativeElement?.querySelector('[aria-label="Ir al Compendio"]');
    expect(finish?.getAttribute('title')).toBe('Ir al Compendio');
    expect(finish?.getAttribute('data-tooltip')).toBe('Ir al Compendio');
    component.index.set(0); harness.detectChanges();
    expect(harness.routeNativeElement?.textContent).toContain('Escena 1/9');
    expect(component.scenes.map(s => s.speaker)).toEqual(['Socamaru', 'GhostyFly', 'Socamaru', 'Weonaso', 'Socamaru', 'HuronVNLZ', 'maykelsito', 'HuronVNLZ', 'Socamaru']);
    expect(localStorage.getItem(key)).toBeNull();
    for (let i = 0; i < component.scenes.length; i++) component.step(1);
    harness.detectChanges();
    expect(localStorage.getItem(key)).toBe('seen');
    for (const text of ['Guías de PvP', 'Guías de PvE', 'Eventos del juego', 'Todavía no hay guías']) expect(harness.routeNativeElement?.textContent).toContain(text);
    expect(harness.routeNativeElement?.querySelectorAll('.resource-list a')).toHaveLength(0);
    (harness.routeNativeElement?.querySelector('.replay') as HTMLButtonElement).click();
    harness.detectChanges(); expect(component.index()).toBe(0); expect(component.guide()).toBe(false);
  });
  it('permite flechas, saltar y volver a entrar con almacenamiento bloqueado', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw Error('blocked'); });
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Resources); await fixture.whenStable();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' })); expect(fixture.componentInstance.index()).toBe(1);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' })); expect(fixture.componentInstance.index()).toBe(0);
    (fixture.nativeElement.querySelector('[aria-label="Saltar al Compendio"]') as HTMLButtonElement).click();
    expect(fixture.componentInstance.guide()).toBe(true);
    fixture.componentInstance.replay(); expect(fixture.componentInstance.guide()).toBe(false);
  });
  it('conserva categorías sin hijos Angular dentro de noscript', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Resources); await fixture.whenStable();
    const fallback = fixture.debugElement.query(By.css('noscript'));
    expect(fallback.children).toHaveLength(0);
    const parsed = new DOMParser().parseFromString((fallback.nativeElement as HTMLElement).innerHTML, 'text/html');
    expect(parsed.querySelector('h1')?.textContent).toBe('El Compendio');
    for (const category of ['Guías de PvP', 'Guías de PvE', 'Eventos del juego']) {
      expect(parsed.body.textContent).toContain(category);
    }
    expect(fixture.nativeElement.textContent).toContain('Escena 1/9');
  });
  it('restaura estado visto después del primer render', async () => {
    localStorage.setItem(key, 'seen'); TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Resources); await fixture.whenStable();
    expect(fixture.componentInstance.guide()).toBe(true);
  });
});

describe('integración del libro de Recursos', () => {
  afterEach(() => { localStorage.clear(); vi.restoreAllMocks(); });
  it('repite la escena real, destruye y vuelve a crear el motor', async () => {
    const { BOOK_LOADER } = await import('./resources-book');
    const engines: { destroy: ReturnType<typeof vi.fn> }[] = [];
    const createBook = vi.fn(() => {
      const engine = { orientation: 'portrait', on: vi.fn(() => () => {}), flipTo: vi.fn(async () => true), destroy: vi.fn() };
      engines.push(engine); return engine;
    });
    localStorage.setItem(key, 'seen');
    TestBed.configureTestingModule({ providers: [provideRouter(routes), { provide: BOOK_LOADER, useValue: async () => ({ createBook }) }] });
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/recursos', Resources);
    await harness.fixture.whenStable(); harness.detectChanges();
    expect(component.guide()).toBe(true);
    expect(createBook).toHaveBeenCalledTimes(1);
    const button = harness.routeNativeElement?.querySelector<HTMLButtonElement>('.replay');
    expect(button).toBeTruthy(); button?.click(); harness.detectChanges();
    expect(component.guide()).toBe(false);
    expect(harness.routeNativeElement?.textContent).toContain('Escena 1/9');
    expect(engines[0].destroy).toHaveBeenCalledOnce();
    component.finish(); harness.detectChanges(); await harness.fixture.whenStable(); harness.detectChanges();
    expect(createBook).toHaveBeenCalledTimes(2);
    await harness.navigateByUrl('/');
    expect(engines[1].destroy).toHaveBeenCalledOnce();
  });
});
