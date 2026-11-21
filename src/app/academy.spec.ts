import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Academy } from './academy';
import { Home } from './home';
import { Activities } from './activities';
import { routes } from './app.routes';

const key = 'black-talon.academy.presentation.v1';
describe('Red Wings Academy', () => {
  beforeEach(() => { localStorage.clear(); vi.spyOn(window, 'scrollTo').mockImplementation(() => {}); });
  afterEach(() => { localStorage.clear(); vi.restoreAllMocks(); });
  it('navega desde ambas tarjetas y admite fragmentos y repetición', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create();
    for (const [url, component] of [['/', Home], ['/actividades', Activities]] as const) {
      await harness.navigateByUrl(url, component);
      (harness.routeNativeElement!.querySelector('a[href="/actividades/red-wings-academy"]') as HTMLAnchorElement).click();
      await harness.fixture.whenStable();
      expect(TestBed.inject(Router).url).toBe('/actividades/red-wings-academy');
      expect(harness.routeNativeElement?.textContent).toContain('Escena 1/8');
    }
    await harness.navigateByUrl('/actividades/red-wings-academy#grupos', Academy);
    expect(harness.routeNativeElement?.querySelector('#grupos')).not.toBeNull();
    expect(localStorage.getItem(key)).toBeNull();
    (harness.routeNativeElement!.querySelector('.replay') as HTMLButtonElement).click();
    await harness.fixture.whenStable(); harness.detectChanges();
    expect(harness.routeNativeElement?.textContent).toContain('Escena 1/8');
  });
  it('presenta ocho escenas distintas, referentes, guía y reglas', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Academy); await fixture.whenStable();
    const component = fixture.componentInstance; const page = fixture.nativeElement as HTMLElement;
    expect(component.scenes).toHaveLength(8);
    expect(new Set(component.scenes.map(s => s.image)).size).toBe(8);
    expect(component.scenes.map(s => s.speaker)).toEqual(['Socamaru', 'Socamaru', 'Socamaru', 'Socamaru', 'maykelsito', 'HuronVNLZ', 'Socamaru', 'Socamaru']);
    for (const [index, scene] of component.scenes.entries()) {
      component.index.set(index); fixture.detectChanges();
      expect(page.querySelector('.cinema-art img')?.getAttribute('src')).toBe(scene.image);
      expect(page.querySelector('.dialogue img')?.getAttribute('src')).toBe(`/admins/${scene.speaker}.png`);
      expect(page.querySelector('.dialogue img')?.getAttribute('fetchpriority')).toBe('high');
    }
    component.step(1); fixture.detectChanges();
    expect(localStorage.getItem(key)).toBe('seen');
    expect(localStorage.getItem('black-talon.sorteos.presentation.v1')).toBeNull();
    expect(page.querySelectorAll('.index a')).toHaveLength(6);
    for (const term of ['farmeos', 'crianza', 'PvP', 'PvE', 'economía', 'mecánicas', 'mínimo de 3 alumnos', 'Link de 4', 'chat normal', 'gratuitas', 'exclusivas', 'día y la hora', 'WhatsApp', 'maykelsito', 'HuronVNLZ', 'Socamaru', 'plantilla fija', 'Más adelante podrían']) expect(page.textContent).toContain(term);
    expect(page.querySelectorAll('a[href^="https:"]')).toHaveLength(0);
    for (const section of component.sections) expect(page.querySelector(`#${section.id} img`)?.getAttribute('src')).toBe(section.image.image);
    expect(page.querySelectorAll('#referentes .academy-art img')).toHaveLength(3);
    for (const [index, [name, specialty]] of [['maykelsito', 'PvP'], ['HuronVNLZ', 'PvP y PvE'], ['Socamaru', 'PvE']].entries()) {
      const item = page.querySelectorAll<HTMLElement>('#referentes .referente')[index];
      expect(item.querySelector('strong')?.textContent).toBe(name);
      expect(item.querySelector('.referente-info')?.textContent).toContain(specialty);
      expect(item.querySelector('.referente-info img')?.getAttribute('src')).toBe(`/admins/${name}.png`);
      expect(item.querySelector('.academy-art img')?.getAttribute('src')).toBe(component.scenes[index + 4].image);
    }
    expect(component.scenes[2].text).toContain('chat de equipo ni otros canales');
    expect(page.querySelector('#grupos')?.textContent).toContain('chat de equipo y otros canales');
    expect(page.querySelector('.index')?.getAttribute('aria-label')).toBe('Índice de Red Wings Academy');
    component.replay(); fixture.detectChanges(); expect(component.index()).toBe(0);
    component.finish(); expect(component.guide()).toBe(true);
  });
  it('permite saltar y usar flechas aun con almacenamiento bloqueado', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw Error('blocked'); });
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Academy); await fixture.whenStable();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(fixture.componentInstance.index()).toBe(1);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    expect(fixture.componentInstance.index()).toBe(0);
    expect(() => fixture.componentInstance.finish()).not.toThrow();
    expect(fixture.componentInstance.guide()).toBe(true);
  });
});
