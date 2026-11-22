import { TestBed } from '@angular/core/testing';
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
    expect(harness.routeNativeElement?.textContent).toContain('Escena 1/9');
    expect(component.scenes.map(s => s.speaker)).toEqual(['Socamaru', 'GhostyFly', 'Socamaru', 'Weonaso', 'Socamaru', 'HuronVNLZ', 'maykelsito', 'HuronVNLZ', 'Socamaru']);
    expect(localStorage.getItem(key)).toBeNull();
    for (let i = 0; i < component.scenes.length; i++) component.step(1);
    harness.detectChanges();
    expect(localStorage.getItem(key)).toBe('seen');
    for (const text of ['Guías de PvP', 'Guías de PvE', 'Eventos del juego', 'todavía no hay guías']) expect(harness.routeNativeElement?.textContent).toContain(text);
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
    (fixture.nativeElement.querySelector('[aria-label="Saltar a Recursos"]') as HTMLButtonElement).click();
    expect(fixture.componentInstance.guide()).toBe(true);
    fixture.componentInstance.replay(); expect(fixture.componentInstance.guide()).toBe(false);
  });
  it('restaura estado visto después del primer render', async () => {
    localStorage.setItem(key, 'seen'); TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Resources); await fixture.whenStable();
    expect(fixture.componentInstance.guide()).toBe(true);
  });
});
