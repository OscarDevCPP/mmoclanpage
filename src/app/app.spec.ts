import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { Home } from './home';
import { provideRouter } from '@angular/router';
import { Missions } from './missions';

describe('Página de Black Talon', () => {
  it('presenta la comunidad, actividades y equipo', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelectorAll('section')).toHaveLength(2);
    expect(Array.from(page.querySelectorAll('h2')).map(h => h.textContent)).toEqual(['Sobre nosotros', 'Actividades']);
    expect(page.querySelectorAll('section[tabindex]')).toHaveLength(0);
    expect(page.textContent?.match(/\[URSS\]/g)).toHaveLength(1);
    for (const term of ['PvP', 'PvE', 'consejos', 'guías', 'clases', 'eventos', 'misiones', 'sorteos']) expect(page.textContent).toContain(term);
    const figures = page.querySelectorAll('figure');
    const names = ['maykelsito', 'HuronVNLZ', 'Socamaru', 'GhostyFly', 'Weonaso'];
    const roles = ['Líder', 'Comandante', 'Comandante', 'Subcomandante', 'Subcomandante'];
    expect(figures).toHaveLength(5);
    names.forEach((name, i) => {
      expect(figures[i].textContent).toContain(`${name} (${roles[i]})`);
      expect(figures[i].querySelector('img')?.getAttribute('src')).toBe(`admins/${name}.png`);
      expect(figures[i].querySelector('img')?.getAttribute('alt')).toBeTruthy();
    });
    expect(page.querySelector('time')?.getAttribute('datetime')).toBe('2026-08-07');
    expect(page.querySelector('.identity img')?.getAttribute('src')).toContain('clan-logo.jpeg');
    const links = Array.from(page.querySelectorAll<HTMLAnchorElement>('.activity-list a'));
    expect(links).toHaveLength(3);
    expect(links[0].getAttribute('href')).toBe('/actividades/misiones');
    expect(links[1].getAttribute('href')).toBe('/actividades/sorteos');
    expect(links[2].getAttribute('href')).toBe('/actividades/eventos-semanales');
    expect(page.querySelectorAll('.activity-unavailable')).toHaveLength(1);
    expect(page.textContent).not.toContain('GhotyFly');
  });
});

describe('Preferencia de tema', () => {
  beforeEach(() => { TestBed.configureTestingModule({ providers: [provideRouter([])] }); localStorage.clear(); document.documentElement.removeAttribute('data-theme'); });
  afterEach(() => { localStorage.clear(); document.documentElement.removeAttribute('data-theme'); });
  it('sigue al sistema, cambia con el botón y restaura la elección', async () => {
    let listener: ((event: MediaQueryListEvent) => void) | undefined;
    const remove = vi.fn();
    const previous = window.matchMedia;
    window.matchMedia = vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn((_type, fn) => listener = fn), removeEventListener: remove });
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(fixture.componentInstance.theme()).toBe('system');
    expect(button.getAttribute('aria-label')).toBe('Cambiar a tema oscuro');
    listener!({ matches: true } as MediaQueryListEvent); fixture.detectChanges();
    expect(button.getAttribute('aria-label')).toBe('Cambiar a tema claro');
    button.click(); fixture.detectChanges();
    expect(localStorage.getItem('black-talon.theme')).toBe('light');
    expect(document.documentElement.dataset['theme']).toBe('light');
    listener!({ matches: true } as MediaQueryListEvent); fixture.detectChanges();
    expect(button.getAttribute('aria-label')).toBe('Cambiar a tema oscuro');
    const originalListener = listener;
    const restored = TestBed.createComponent(App);
    expect(restored.componentInstance.theme()).toBe('light');
    fixture.destroy(); expect(remove).toHaveBeenCalledWith('change', originalListener);
    restored.destroy(); window.matchMedia = previous;
  });
  it('continúa funcionando si el almacenamiento está bloqueado', () => {
    const read = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance.theme()).toBe('system'); read.mockRestore();
    const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    expect(() => fixture.componentInstance.setTheme('dark')).not.toThrow();
    expect(document.documentElement.dataset['theme']).toBe('dark'); write.mockRestore();
  });
});

describe('Foco y restauración de fragmentos', () => {
  it('sincroniza posición y foco después de la restauración del historial y configura el offset', async () => {
    const { Location, ViewportScroller } = await import('@angular/common');
    const { provideLocationMocks } = await import('@angular/common/testing');
    const { NavigationEnd, NavigationStart, Router, Scroll, provideRouter, withInMemoryScrolling } = await import('@angular/router');
    const { Subject } = await import('rxjs');
    const { routes } = await import('./app.routes');
    TestBed.configureTestingModule({ providers: [provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })), provideLocationMocks()] });
    const scroller = TestBed.inject(ViewportScroller);
    const offset = vi.spyOn(scroller, 'setOffset');
    const anchor = vi.spyOn(scroller, 'scrollToAnchor').mockImplementation(() => {});
    const position = vi.spyOn(scroller, 'scrollToPosition').mockImplementation(() => {});
    const fixture = TestBed.createComponent(App);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector('.site-header') as HTMLElement;
    vi.spyOn(header, 'getBoundingClientRect').mockReturnValue({ height: 61 } as DOMRect);
    expect((offset.mock.calls[0][0] as () => [number, number])()).toEqual([0, 77]);
    const router = TestBed.inject(Router);
    const location = TestBed.inject(Location);
    router.initialNavigation();
    const settle = async () => { fixture.detectChanges(); await new Promise(resolve => setTimeout(resolve, 30)); await fixture.whenStable(); fixture.detectChanges(); };
    const emitScroll = async (fragment: string, restored = false) => {
      (router.events as InstanceType<typeof Subject>).next(new Scroll(new NavigationEnd(1, router.url, router.url), restored ? [0, 0] : null, restored ? null : fragment));
      // Model another synchronous Scroll subscriber restoring after App's callback.
      if (restored) {
        expect(anchor).not.toHaveBeenCalled();
        scroller.scrollToPosition([0, 0]);
      }
      await Promise.resolve();
    };
    await router.navigateByUrl('/actividades/misiones#tablon'); await settle(); await emitScroll('tablon');
    expect(document.activeElement?.id).toBe('tablon');
    const revision = fixture.nativeElement.querySelector('.index a[href$="#revision"]') as HTMLAnchorElement;
    revision.click(); await settle(); await emitScroll('revision');
    expect(router.url).toBe('/actividades/misiones#revision');
    expect(document.activeElement?.id).toBe('revision');
    anchor.mockClear(); position.mockClear();
    location.back(); await settle(); anchor.mockClear(); position.mockClear(); await emitScroll('tablon', true);
    expect(position).toHaveBeenCalled();
    expect(anchor).toHaveBeenLastCalledWith('tablon');
    expect(anchor.mock.invocationCallOrder.at(-1)!).toBeGreaterThan(position.mock.invocationCallOrder.at(-1)!);
    expect(router.url).toBe('/actividades/misiones#tablon');
    expect(document.activeElement?.id).toBe('tablon');
    location.forward(); await settle(); anchor.mockClear(); position.mockClear(); await emitScroll('revision', true);
    expect(router.url).toBe('/actividades/misiones#revision');
    expect(document.activeElement?.id).toBe('revision');
    anchor.mockClear();
    (router.events as InstanceType<typeof Subject>).next(new Scroll(new NavigationEnd(1, router.url, router.url), null, 'revision'));
    (router.events as InstanceType<typeof Subject>).next(new NavigationStart(999, '/actividades'));
    await Promise.resolve();
    expect(anchor).not.toHaveBeenCalled();
    (router.events as InstanceType<typeof Subject>).next(new Scroll(new NavigationEnd(1, router.url, router.url), null, 'revision'));
    fixture.destroy();
    await Promise.resolve();
    expect(anchor).not.toHaveBeenCalled();
    fixture.nativeElement.remove();
  });
});



describe('Presentación y guía', () => {
  beforeEach(() => { localStorage.clear(); TestBed.configureTestingModule({ providers: [provideRouter([])] }); });
  afterEach(() => { localStorage.clear(); vi.restoreAllMocks(); });
  it('avanza seis escenas, guarda solo al terminar y permite repetir', async () => {
    const fixture = TestBed.createComponent(Missions); await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;
    expect(page.textContent).toContain('Escena 1/6'); expect(localStorage.getItem('black-talon.missions.presentation.v1')).toBeNull();
    expect(page.querySelector('.scene-stage .dialogue')).toBeNull();
    expect(page.querySelector('.scene-stage')?.nextElementSibling?.classList.contains('dialogue')).toBe(true);
    expect(page.querySelector('.bubble')?.textContent).not.toContain('ejemplos');
    for (let i = 0; i < 5; i++) { fixture.componentInstance.step(1); fixture.detectChanges(); }
    expect(page.textContent).toContain('Escena 6/6'); fixture.componentInstance.step(1); fixture.detectChanges();
    expect(localStorage.getItem('black-talon.missions.presentation.v1')).toBe('seen');
    expect(page.querySelectorAll('.scene')).toHaveLength(6); expect(page.querySelectorAll('.index a')).toHaveLength(6);
    expect(page.querySelector('.index')?.nextElementSibling?.classList.contains('replay')).toBe(true);
    expect(page.querySelector('#bienvenida')?.textContent).toContain('Meowth, Geodude');
    expect(page.querySelector('.scene img[src*="maykelsito"]')).toBeNull(); expect(page.querySelector('.bubble')).toBeNull();
    expect(page.textContent).toContain('MISION SEMANAL'); expect(page.textContent).toContain('no envía correos');
    fixture.componentInstance.replay(); fixture.detectChanges(); expect(page.textContent).toContain('Escena 1/6');
    expect(TestBed.createComponent(Missions).componentInstance.guide()).toBe(true);
  });
  it('salta con almacenamiento bloqueado y respeta edición al usar flechas', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw Error('blocked'); });
    const fixture = TestBed.createComponent(Missions); await fixture.whenStable();
    const component = fixture.componentInstance;
    const input = document.createElement('input'); document.body.append(input);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })); expect(component.index()).toBe(0);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' })); expect(component.index()).toBe(1);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' })); expect(component.index()).toBe(0);
    expect(() => component.finish()).not.toThrow(); expect(component.guide()).toBe(true); input.remove();
  });
});

describe('Regresión de navegación y presentación', () => {
  beforeEach(() => { localStorage.clear(); vi.spyOn(window, 'scrollTo').mockImplementation(() => {}); });
  afterEach(() => { localStorage.clear(); vi.restoreAllMocks(); });
  it('la portada abre misiones y un fragmento explícito muestra la guía sin registrar la visita; repetir y navegar otro fragmento funciona', async () => {
    const { Router } = await import('@angular/router');
    const { RouterTestingHarness } = await import('@angular/router/testing');
    const { routes } = await import('./app.routes');
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/', Home);
    (harness.routeNativeElement!.querySelector('.activity-list a') as HTMLAnchorElement).click();
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/actividades/misiones');
    expect(harness.routeNativeElement?.textContent).toContain('Escena 1/6');
    await harness.navigateByUrl('/actividades/misiones#tablon', Missions);
    expect(harness.routeNativeElement?.querySelector('#tablon')).not.toBeNull();
    expect(localStorage.getItem('black-talon.missions.presentation.v1')).toBeNull();
    (harness.routeNativeElement!.querySelector('.replay') as HTMLButtonElement).click();
    await harness.fixture.whenStable(); harness.detectChanges();
    expect(harness.routeNativeElement?.textContent).toContain('Escena 1/6');
    expect(TestBed.inject(Router).url).toBe('/actividades/misiones');
    await harness.navigateByUrl('/actividades/misiones#revision', Missions);
    expect(harness.routeNativeElement?.querySelector('#revision')).not.toBeNull();
    expect(localStorage.getItem('black-talon.missions.presentation.v1')).toBeNull();
  });
  it('los controles terminan o saltan y una vista nueva conserva la preferencia sin solicitudes', async () => {
    const fetch = vi.spyOn(window, 'fetch');
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Missions); await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;
    expect(localStorage.getItem('black-talon.missions.presentation.v1')).toBeNull();
    for (let i = 0; i < 6; i++) { (page.querySelector('.cinema-controls button:last-child') as HTMLButtonElement).click(); fixture.detectChanges(); }
    expect(localStorage.getItem('black-talon.missions.presentation.v1')).toBe('seen');
    expect(page.querySelectorAll('.scene')).toHaveLength(6);
    expect(page.querySelector('.dialogue, .bubble, img[src*="maykelsito"]')).toBeNull();
    expect(page.querySelector('.silhouette.revealed')).not.toBeNull();
    const restored = TestBed.createComponent(Missions); await restored.whenStable();
    expect(restored.nativeElement.querySelectorAll('.scene')).toHaveLength(6);
    (page.querySelector('.replay') as HTMLButtonElement).click(); fixture.detectChanges();
    expect(page.textContent).toContain('Escena 1/6');
    (page.querySelector('.cinema-top button') as HTMLButtonElement).click(); fixture.detectChanges();
    expect(page.querySelectorAll('.scene')).toHaveLength(6);
    expect(fetch).not.toHaveBeenCalled();
    fixture.destroy(); restored.destroy();
  });
  it('limita flechas y no avanza con repetición, modificadores o edición', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Missions); await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;
    const input = document.createElement('input'); document.body.append(input);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', repeat: true }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', ctrlKey: true }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' })); fixture.detectChanges();
    expect(page.textContent).toContain('Escena 1/6');
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' })); fixture.detectChanges();
    expect(page.textContent).toContain('Escena 2/6');
    input.remove(); fixture.destroy();
  });
});

describe('Aislamiento cinematográfico', () => {
  beforeEach(() => { localStorage.clear(); vi.spyOn(window, 'scrollTo').mockImplementation(() => {}); });
  afterEach(() => { localStorage.clear(); vi.restoreAllMocks(); });
  it('retira la navegación global y la restaura en guía, repetición y salida', async () => {
    const { Router } = await import('@angular/router');
    const { routes } = await import('./app.routes');
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const fixture = TestBed.createComponent(App); fixture.detectChanges();
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/actividades/misiones'); fixture.detectChanges(); await fixture.whenStable(); fixture.detectChanges();
    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelector('.site-header, footer, .skip-link, nav')).toBeNull();
    expect(page.querySelector('.cinema-top button')?.getAttribute('aria-label')).toBe('Saltar a la guía');
    expect(page.querySelector('.cinema-controls button:last-child')?.getAttribute('aria-label')).toBe('Siguiente');
    for (let i = 0; i < 6; i++) {
      expect(page.querySelector('.scene-stage')?.getAttribute('data-scene')).toBe(String(i));
      (page.querySelector('.cinema-controls button:last-child') as HTMLButtonElement).click(); fixture.detectChanges();
    }
    expect(page.querySelector('.site-header')).not.toBeNull(); expect(page.querySelector('footer')).not.toBeNull();
    expect(page.querySelectorAll('.index ol > li')).toHaveLength(6);
    expect(page.querySelector('#bienvenida h2')?.textContent).toBe('Cómo funcionan las misiones');
    expect(page.querySelector('#tablon')?.textContent).toContain('Maykelsito publica');
    expect(page.querySelector('#tablon')?.textContent).not.toContain('Yo publico');
    (page.querySelector('.replay') as HTMLButtonElement).click(); fixture.detectChanges();
    expect(page.querySelector('.site-header, footer, .skip-link')).toBeNull();
    await router.navigateByUrl('/actividades'); fixture.detectChanges();
    expect(page.querySelector('.site-header')).not.toBeNull(); expect(page.querySelector('footer')).not.toBeNull();
    fixture.destroy();
  });
});

describe('Sorteos', () => {
  beforeEach(() => { localStorage.clear(); vi.spyOn(window, 'scrollTo').mockImplementation(() => {}); });
  afterEach(() => { localStorage.clear(); vi.restoreAllMocks(); });
  it('abre desde ambas tarjetas y admite fragmentos sin marcar la presentación', async () => {
    const { Router } = await import('@angular/router');
    const { RouterTestingHarness } = await import('@angular/router/testing');
    const { routes } = await import('./app.routes');
    const { Activities } = await import('./activities');
    const { Sorteos } = await import('./sorteos');
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create();
    for (const [url, component] of [['/', Home], ['/actividades', Activities]] as const) {
      await harness.navigateByUrl(url, component);
      (harness.routeNativeElement!.querySelector('a[href="/actividades/sorteos"]') as HTMLAnchorElement).click();
      await harness.fixture.whenStable();
      expect(TestBed.inject(Router).url).toBe('/actividades/sorteos');
      expect(harness.routeNativeElement?.textContent).toContain('Escena 1/6');
    }
    await harness.navigateByUrl('/actividades/sorteos#resultado', Sorteos);
    expect(harness.routeNativeElement?.querySelector('#resultado')).not.toBeNull();
    expect(localStorage.getItem('black-talon.sorteos.presentation.v1')).toBeNull();
    expect(harness.routeNativeElement?.querySelectorAll('.index a')).toHaveLength(6);
    (harness.routeNativeElement!.querySelector('.replay') as HTMLButtonElement).click();
    await harness.fixture.whenStable(); harness.detectChanges();
    expect(harness.routeNativeElement?.textContent).toContain('Escena 1/6');
  });
  it('avanza, persiste independientemente al terminar, muestra las reglas y permite repetir', async () => {
    const { Sorteos } = await import('./sorteos');
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Sorteos); await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;
    expect(localStorage.getItem('black-talon.sorteos.presentation.v1')).toBeNull();
    expect(page.querySelector('.scene-stage')?.nextElementSibling?.classList.contains('dialogue')).toBe(true);
    for (let i = 0; i < 6; i++) { fixture.componentInstance.step(1); fixture.detectChanges(); }
    expect(localStorage.getItem('black-talon.sorteos.presentation.v1')).toBe('seen');
    expect(localStorage.getItem('black-talon.missions.presentation.v1')).toBeNull();
    for (const term of ['cosmético', 'Pokémon', '15 números', '20k', '1 gratis', 'comprar 2', 'WhatsApp', 'Discord', 'susurro', 'domingo', 'Perú', 'enlace externo', 'no fue comprado', 'eventos, premios y wars']) expect(page.textContent).toContain(term);
    expect(page.querySelector('#participar')?.textContent).toContain('indica los números que desea');
    expect(page.querySelector('#participar')?.textContent).toContain('confirma su disponibilidad');
    expect(page.querySelector('#participar')?.textContent).toContain('El correo no es válido para comprar porque no permite confirmar la disponibilidad');
    expect(page.querySelector('#resultado')?.textContent).toContain('enlace externo donde se puede seguir la cuenta regresiva durante la semana');
    expect(page.querySelector('#resultado')?.textContent).toContain('domingo a las 12 del mediodía, hora de Perú');
    expect(page.querySelector('#resultado')?.textContent).toContain('elige y revela al ganador al llegar la hora');
    expect(fixture.componentInstance.scenes[3].text).toContain('No uses correo');
    expect(fixture.componentInstance.scenes[3].text).toContain('números que deseas');
    expect(fixture.componentInstance.scenes[4].text).toContain('durante la semana');
    expect(TestBed.createComponent(Sorteos).componentInstance.guide()).toBe(true);
    fixture.componentInstance.replay(); fixture.detectChanges();
    expect(page.textContent).toContain('Escena 1/6');
    fixture.componentInstance.finish(); expect(fixture.componentInstance.guide()).toBe(true);
  });
  it('tolera almacenamiento bloqueado y controla flechas', async () => {
    const { Sorteos } = await import('./sorteos');
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw Error('blocked'); });
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Sorteos); await fixture.whenStable();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(fixture.componentInstance.index()).toBe(1);
    expect(() => fixture.componentInstance.finish()).not.toThrow();
    expect(fixture.componentInstance.guide()).toBe(true);
  });
});

describe('Ilustraciones de sorteos', () => {
  it('usa seis imágenes distintas y cada sección de la guía reutiliza su escena', async () => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const { Sorteos } = await import('./sorteos');
    const fixture = TestBed.createComponent(Sorteos);
    await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;
    const scenes = fixture.componentInstance.scenes;
    expect(new Set(scenes.map(scene => scene.image)).size).toBe(6);
    for (const [index, scene] of scenes.entries()) {
      fixture.componentInstance.index.set(index);
      await fixture.whenStable();
      const image = page.querySelector<HTMLImageElement>('.cinema-art img')!;
      expect(image.getAttribute('src')).toBe(scene.image);
      expect(image.alt).toBe(scene.alt);
    }
    fixture.componentInstance.finish();
    await fixture.whenStable();
    for (const scene of scenes) {
      const image = page.querySelector<HTMLImageElement>(`#${scene.id} img`)!;
      expect(image.getAttribute('src')).toBe(scene.image);
      expect(image.alt).toBe(scene.alt);
    }
    fixture.destroy();
    localStorage.clear();
  });
});
