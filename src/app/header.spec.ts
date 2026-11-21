import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('Navegación del encabezado', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
  });
  afterEach(() => { localStorage.clear(); vi.restoreAllMocks(); });

  it('abre el desplegable y lo cierra con Escape o al seleccionar un destino', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');
    await fixture.whenStable(); fixture.detectChanges();
    const page = fixture.nativeElement as HTMLElement;
    const toggle = page.querySelector<HTMLButtonElement>('#navigation-toggle')!;
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    toggle.click(); fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(page.querySelector('.section-nav')?.classList.contains('is-open')).toBe(true);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    toggle.click(); fixture.detectChanges();
    page.querySelector<HTMLAnchorElement>('.section-nav a')!.click();
    await fixture.whenStable(); fixture.detectChanges();
    expect(router.url).toBe('/actividades');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('enlaza a Actividades y vuelve al inicio desde Black Talon sin destinos provisionales', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');
    await fixture.whenStable(); fixture.detectChanges();
    const page = fixture.nativeElement as HTMLElement;
    expect(page.textContent).not.toContain('Ver todas las actividades');
    const navigation = page.querySelector('.section-nav')!;
    expect(navigation.querySelectorAll('a')).toHaveLength(1);
    expect(Array.from(navigation.querySelectorAll('[aria-disabled="true"]')).map(e => e.textContent)).toEqual(['Recursos', 'Recuerdos']);
    expect(navigation.querySelectorAll('[href="#"], button, [tabindex="0"]')).toHaveLength(0);
    (navigation.querySelector('a') as HTMLAnchorElement).click();
    await fixture.whenStable(); fixture.detectChanges();
    expect(router.url).toBe('/actividades');
    expect(navigation.querySelector('a')?.getAttribute('aria-current')).toBe('page');
    (page.querySelector('.wordmark') as HTMLAnchorElement).click();
    await fixture.whenStable(); fixture.detectChanges();
    expect(router.url).toBe('/');
    expect(page.querySelector('.section-nav a')?.hasAttribute('aria-current')).toBe(false);
    expect(page.querySelectorAll('.activity-list a')).toHaveLength(4);
  });
});
