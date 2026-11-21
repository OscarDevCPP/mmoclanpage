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
    expect(links).toHaveLength(1);
    expect(links[0].getAttribute('href')).toBe('/actividades/misiones');
    expect(page.querySelectorAll('.activity-unavailable')).toHaveLength(3);
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

describe('Recorrido de misiones', () => {
  it('presenta seis escenas y una demostración local', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Missions);
    await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelectorAll('section')).toHaveLength(6);
    expect(page.textContent).toContain('MISION SEMANAL');
    expect(page.textContent).toContain('esta web no envía correos');
    const buttons = Array.from(page.querySelectorAll('button'));
    buttons.find(b => b.textContent?.includes('Añadir Pokémon'))!.click(); fixture.detectChanges();
    expect(page.textContent).toContain('Adjuntos de ejemplo: Pokémon');
    buttons.find(b => b.textContent?.includes('Previsualizar'))!.click(); fixture.detectChanges();
    expect(page.textContent).toContain('Vista previa del correo');
    expect(page.querySelectorAll('input[type=checkbox]')).toHaveLength(2);
  });
});

describe('Interacciones de misiones', () => {
  async function setup() {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Missions);
    await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;
    const click = (text: string) => { const button = Array.from(page.querySelectorAll('button')).find(b => b.textContent?.includes(text)); expect(button).toBeTruthy(); button!.click(); fixture.detectChanges(); };
    return { fixture, page, click };
  }
  it('presenta navegación, reglas y guía en cada escena', async () => {
    const { page } = await setup();
    expect(page.querySelectorAll('.scene .speech')).toHaveLength(6);
    expect(page.querySelectorAll('.index a')).toHaveLength(6);
    expect(page.querySelector('a[href="/actividades"]')).toBeTruthy();
    expect(page.textContent).toContain('capturando Pokémon y reuniendo objetos según lo solicitado en el anuncio');
    expect(page.textContent).toContain('lunes a sábado');
    expect(page.textContent).toContain('lunes siguiente');
    expect(page.textContent).toContain('no son la misión vigente');
  });
  it('explica selecciones y mantiene una lista didáctica local', async () => {
    const { page, click } = await setup();
    click('Piedra Eterna'); expect(page.textContent).toContain('objetos para farmear');
    click('Capturas'); expect(page.textContent).toContain('capturas y sus características');
    click('Recompensa'); expect(page.textContent).toContain('recompensa de esta semana');
    const checks = page.querySelectorAll<HTMLInputElement>('input[type=checkbox]');
    checks[0].click(); expect(checks[0].checked).toBe(true); expect(checks[1].checked).toBe(false);
    expect(page.textContent).toContain('no comprueba tu inventario');
  });
  it('simula varios correos y presenta adjuntos sin envío', async () => {
    const { page, click } = await setup();
    click('Añadir Pokémon'); click('Añadir objetos'); click('Previsualizar');
    expect(page.querySelector('[role=status]')?.textContent).toContain('Pokémon y objetos');
    click('Ver otro correo'); expect(page.textContent).toContain('Correo de ejemplo 2');
    expect(page.querySelector('[role=status]')).toBeNull();
    expect(page.textContent).toContain('Adjuntos de ejemplo: —');
    expect(page.textContent).toContain('esta web no envía correos');
  });
  it('abre y cierra el premio y aclara el ticket condicional', async () => {
    const { page, click } = await setup();
    click('Abrir caja'); expect(page.querySelector('.silhouette.revealed')).toBeTruthy();
    expect(page.textContent).toContain('Consulta el anuncio para conocer el nivel');
    click('Cerrar caja'); expect(page.querySelector('.silhouette.revealed')).toBeNull();
    click('Ticket'); expect(page.textContent).toContain('no concede ningún beneficio');
    click('Ticket'); expect(page.textContent).not.toContain('no concede ningún beneficio');
  });
});

describe('Navegación real del router', () => {
  it('abre actividades, fragmentos y enlaces de escena sin salir de misiones', async () => {
    const { Router } = await import('@angular/router');
    const { RouterTestingHarness } = await import('@angular/router/testing');
    const { routes } = await import('./app.routes');
    const { Activities } = await import('./activities');
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/actividades', Activities);
    await harness.navigateByUrl('/actividades/misiones#bienvenida', Missions);
    const router = TestBed.inject(Router);
    const page = harness.routeNativeElement as HTMLElement;
    const welcome = page.querySelector<HTMLAnchorElement>('#bienvenida > a')!;
    expect(welcome.getAttribute('href')).toBe('/actividades/misiones#tablon');
    welcome.click(); await harness.fixture.whenStable();
    expect(router.url).toBe('/actividades/misiones#tablon');
    const index = page.querySelector<HTMLAnchorElement>('.index a')!;
    index.click(); await harness.fixture.whenStable();
    expect(router.url).toBe('/actividades/misiones#bienvenida');
    const back = page.querySelector<HTMLAnchorElement>('#despedida .actions a')!;
    back.click(); await harness.fixture.whenStable();
    expect(router.url).toBe('/actividades/misiones#tablon');
    const buttons = page.querySelectorAll<HTMLButtonElement>('.papers button');
    buttons[0].click(); harness.detectChanges();
    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
    buttons[1].click(); harness.detectChanges();
    expect(buttons[0].getAttribute('aria-pressed')).toBe('false');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
  });
  it('la tarjeta de portada navega directamente a misiones', async () => {
    const { Router } = await import('@angular/router');
    const { RouterTestingHarness } = await import('@angular/router/testing');
    const { routes } = await import('./app.routes');
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/', Home);
    (harness.routeNativeElement!.querySelector('.activity-list a') as HTMLAnchorElement).click();
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/actividades/misiones');
    expect(harness.routeNativeElement?.querySelector('app-missions')).toBeNull();
    expect(harness.routeNativeElement?.textContent).toContain('Misiones semanales');
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
