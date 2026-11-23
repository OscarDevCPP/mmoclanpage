import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { PvpFundamentos, popupPosition } from './pvp-fundamentos';
import { PVP_CONTENTS, PVP_GUIDE } from './pvp-guide';
import { PresentationState } from './presentation-state';

describe('Fundamentos del competitivo', () => {
  it('restaura el fragmento inicial tras renderizar sin enfocar la sección', async () => {
    const scroll = vi.fn();
    const original = HTMLElement.prototype.scrollIntoView;
    HTMLElement.prototype.scrollIntoView = scroll;
    try {
      TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
      const harness = await RouterTestingHarness.create();
      await harness.navigateByUrl('/compendio/pvp/fundamentos#introduccion-turno', PvpFundamentos);
      harness.detectChanges();
      await harness.fixture.whenStable();
      expect(scroll).toHaveBeenCalledWith({ block: 'start', behavior: 'instant' });
      expect(document.activeElement?.id).not.toBe('introduccion-turno');
    } finally {
      HTMLElement.prototype.scrollIntoView = original;
    }
  });
  it('presenta el panorama aprobado, índice y anclas anteriores', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/compendio/pvp/fundamentos', PvpFundamentos);
    const page = harness.routeNativeElement as HTMLElement;
    expect(TestBed.inject(PresentationState).active()).toBe(false);
    expect(document.title).toBe('Introducción al competitivo · El Compendio · Black Talon');
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toContain('PokeMMO');
    const sections = [...page.querySelectorAll('article > section')];
    expect(sections.map(section => section.id)).toEqual(PVP_GUIDE.map(section => section.id));
    expect([...page.querySelectorAll('article > section h2')].map(h => h.textContent?.trim())).toEqual(['Formas de jugar al PvP', 'Lo esencial antes de crear un equipo', 'Construcción de equipos', 'La idea detrás de cada combate']);
    expect([...page.querySelectorAll('article > section h3')].map(h => h.textContent?.trim())).toEqual(['Modalidades', 'Tiers', 'Tipos', 'Genética', 'Entrenamiento', 'Crianza', 'Preparación', 'Sinergia y cores', 'Arquetipos', 'Decisiones', 'Práctica']);
    sections.forEach((section, i) => {
      const actual = [...section.querySelectorAll('h2,h3,p')].map(node => node.textContent?.replace(/\s+/g, ' ').trim());
      const expected = PVP_GUIDE[i].blocks.flatMap(block => block.kind === 'heading' || block.kind === 'paragraph' ? [block.runs.map(run => run.text).join('').replace(/\s+/g, ' ').trim()] : []);
      expect(actual).toEqual(expected);
    });
    expect(sections.every(section => !section.hasAttribute('tabindex'))).toBe(true);
    for (const id of ['introduccion-competitivo', 'introduccion-turno', 'introduccion-plan', 'introduccion-practica']) expect(page.querySelector(`[id="${id}"]`)).toBeTruthy();
    const contents = [...page.querySelectorAll<HTMLAnchorElement>('.contents a')];
    expect(contents.map(a => a.hash.slice(1))).toEqual(PVP_CONTENTS.map(section => section.id));
    contents[1].click(); await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/compendio/pvp/fundamentos#introduccion-tipos');
  });
  it('abre ayudas una vez por término y cierra con Escape o clic exterior sin robar foco', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/compendio/pvp/fundamentos', PvpFundamentos);
    const page = harness.routeNativeElement as HTMLElement;
    const buttons = [...page.querySelectorAll<HTMLButtonElement>('.glossary-trigger')];
    expect(buttons.map(b => b.textContent?.trim())).toEqual(['Singles', 'Doubles', 'Randoms', 'tiers', 'OU', 'UU', 'NU', 'STAB', 'IV', 'EV', 'core']);
    const button = buttons[0];
    expect(button.hasAttribute('aria-controls')).toBe(false);
    expect(button.hasAttribute('aria-describedby')).toBe(false);
    button.focus(); button.click(); harness.detectChanges();
    expect(button.getAttribute('aria-controls')).toBe('definition-Singles');
    expect(button.getAttribute('aria-describedby')).toBe('definition-Singles');
    expect(page.querySelector('#definition-Singles')).toBeTruthy();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(page.querySelector('[role="note"]')?.textContent).toContain('un Pokémon en el campo');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); harness.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('false'); expect(document.activeElement).toBe(button);
    expect(button.hasAttribute('aria-controls')).toBe(false);
    button.click(); harness.detectChanges(); button.click(); harness.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('false');
    button.click(); harness.detectChanges();
    buttons[1].focus(); harness.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(buttons[1]);
    button.focus(); button.click(); harness.detectChanges();
    const link = page.querySelector<HTMLAnchorElement>('nav a')!; link.focus(); link.dispatchEvent(new MouseEvent('click', { bubbles: true })); harness.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('false'); expect(document.activeElement).toBe(link);
  });
  it('posiciona la definición fuera de flujo tras renderizarla', async () => {
    let frame: FrameRequestCallback | undefined;
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => { frame = callback; return 1; });
    try {
      TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
      const harness = await RouterTestingHarness.create();
      await harness.navigateByUrl('/compendio/pvp/fundamentos', PvpFundamentos);
      const page = harness.routeNativeElement as HTMLElement;
      const button = page.querySelector<HTMLButtonElement>('.glossary-trigger')!;
      const rect = (left: number, top: number, width: number, height: number) => ({ left, top, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON: () => ({}) } as DOMRect);
      const anchor = vi.spyOn(button, 'getBoundingClientRect').mockReturnValue(rect(50, 100, 40, 20));
      button.click(); harness.detectChanges();
      const popup = page.querySelector<HTMLElement>('#definition-Singles')!;
      vi.spyOn(popup, 'getBoundingClientRect').mockReturnValue(rect(0, 0, 200, 90));
      frame!(0);
      expect(popup.style.left).toBe('50px');
      expect(popup.style.top).toBe('128px');
      expect(popup.style.visibility).toBe('visible');
      expect(getComputedStyle(popup).position).toBe('fixed');
      // A delayed scroll event after activation must reposition, not close.
      anchor.mockReturnValue(rect(60, 160, 40, 20));
      window.dispatchEvent(new Event('scroll')); harness.detectChanges();
      frame!(1); harness.detectChanges();
      expect(button.getAttribute('aria-expanded')).toBe('true');
      expect(popup.style.left).toBe('60px');
      expect(popup.style.top).toBe('188px');
      // Once the anchor leaves the viewport, the popup cannot remain detached.
      anchor.mockReturnValue(rect(60, -100, 40, 20));
      window.dispatchEvent(new Event('scroll')); frame!(2); harness.detectChanges();
      expect(button.getAttribute('aria-expanded')).toBe('false');
    } finally { vi.restoreAllMocks(); }
  });
  it('calcula posición dentro del viewport y evita la cabecera, volteando si falta espacio', () => {
    const rect = (left: number, top: number, width: number, height: number) => ({ left, top, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON: () => ({}) } as DOMRect);
    const popup = rect(0, 0, 200, 90);
    expect(popupPosition(rect(10, 100, 40, 20), popup, 320, 600, 60)).toEqual({ left: 10, top: 128 });
    expect(popupPosition(rect(290, 550, 20, 20), popup, 320, 600, 60)).toEqual({ left: 112, top: 452 });
    expect(popupPosition(rect(0, 65, 20, 20), rect(0, 0, 200, 500), 320, 600, 60)).toEqual({ left: 8, top: 92 });
    expect(popupPosition(rect(1250, 100, 20, 20), popup, 1280, 900, 60).left).toBe(1072);
    expect(popupPosition(rect(380, 100, 10, 20), popup, 390, 844, 60).left).toBe(182);
  });

});
