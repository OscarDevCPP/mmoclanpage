import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('Página de Black Talon', () => {
  it('presenta la comunidad, actividades y equipo', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelectorAll('section')).toHaveLength(2);
    expect(Array.from(page.querySelectorAll('h2')).map(h => h.textContent)).toEqual(['Sobre nosotros', 'Actividades']);
    expect(page.querySelectorAll('section[tabindex]')).toHaveLength(0);
    expect(page.querySelectorAll('button')).toHaveLength(1);
    expect(page.querySelector('nav, select')).toBeNull();
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
    expect(links.map(link => link.textContent)).toEqual(['Misiones', 'Sorteos', 'Eventos Semanales', "Academia 'Red Wings Academy'"]);
    expect(links.map(link => link.querySelector('img')?.getAttribute('src'))).toEqual(['activities/misiones.png', 'activities/sorteos.png', 'activities/eventos-semanales.png', 'activities/red-wings-academy.png']);
    expect(page.textContent).not.toContain('GhotyFly');
    for (const link of links) {
      expect(link.getAttribute('href')).toBe('#');
      expect(link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))).toBe(false);
    }
  });
});

describe('Preferencia de tema', () => {
  beforeEach(() => { localStorage.clear(); document.documentElement.removeAttribute('data-theme'); });
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
