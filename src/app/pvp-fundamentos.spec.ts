import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { PvpFundamentos } from './pvp-fundamentos';
import { PVP_GUIDE } from './pvp-guide';
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
  it('abre la ruta directamente con el texto íntegro, diagramas, fuentes e índice local', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/compendio/pvp/fundamentos', PvpFundamentos);
    const page = harness.routeNativeElement as HTMLElement;
    expect(TestBed.inject(PresentationState).active()).toBe(false);
    expect(document.title).toBe('Introducción al competitivo · El Compendio · Black Talon');
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toContain('Singles');
    const sections = [...page.querySelectorAll('article > section')];
    expect(sections.map(section => section.id)).toEqual(PVP_GUIDE.map(section => section.id));
    sections.forEach((section, i) => {
      const actual = [...section.querySelectorAll('h2,h3,p,li')].map(node => node.textContent?.replace(/\s+/g, ' ').trim());
      const expected = PVP_GUIDE[i].blocks.flatMap(block => {
        if (block.kind === 'diagram') return [];
        if (block.kind === 'list') return block.items.map(item => item.runs.map(run => run.text).join('').replace(/\s+/g, ' ').trim());
        return [block.runs.map(run => run.text).join('').replace(/\s+/g, ' ').trim()];
      });
      expect(actual).toEqual(expected);
    });
    expect(page.querySelectorAll('svg[role="img"][aria-label]')).toHaveLength(2);
    expect([...page.querySelectorAll('svg[role="img"]')].every(svg => !!svg.getAttribute('aria-label')?.trim())).toBe(true);
    expect(page.querySelector('h1')?.textContent).toBe('Introducción al competitivo');
    expect(page.textContent).toMatch(/prioridad/i);
    expect(page.textContent).toMatch(/velocidad/i);
    expect(page.textContent).toMatch(/condición de victoria/i);
    expect(page.textContent).toMatch(/ejercicio/i);
    expect(page.textContent).toMatch(/respuesta posible/i);
    expect(page.textContent).not.toMatch(/pendiente|parcial/i);
    expect(page.querySelectorAll('a[href^="https://www.smogon.com/"]')).toHaveLength(3);
    const contents = [...page.querySelectorAll<HTMLAnchorElement>('.contents a')];
    expect(contents.map(a => a.hash.slice(1))).toEqual(PVP_GUIDE.map(section => section.id));
    expect(contents.every(a => page.querySelector(`[id="${a.hash.slice(1)}"]`))).toBe(true);
    contents[1].click();
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/compendio/pvp/fundamentos#introduccion-turno');
    expect(page.querySelector('a[href="/compendio"]')).not.toBeNull();
  });
});
