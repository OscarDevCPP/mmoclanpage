import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { PvePilares } from './pve-pilares';

describe('Los seis pilares', () => {
  it('abre la ruta directa con secciones, fuentes y límites de las variantes', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/compendio/pve/seis-pilares', PvePilares);
    const page = harness.routeNativeElement as HTMLElement;
    expect(page.querySelector('h1')?.textContent).toBe('Los seis pilares');
    expect([...page.querySelectorAll('article > section')].map(section => section.id)).toEqual(['preparacion', 'equipo', 'estrategia', 'basica', 'variantes', 'fuentes']);
    expect(page.querySelector('#basica h2')?.textContent).toBe('Rutas de revancha');
    expect(page.querySelector('#basica i[lang="en"]')?.textContent).toBe('swap');
    expect(page.querySelector('#variantes a[href*="spreadsheets"]')?.textContent).toBe('Deadly Assault');
    expect(page.textContent).toContain('referencia histórica');
    expect(page.querySelectorAll('#equipo app-pokemon-build')).toHaveLength(6);
    const term = page.querySelector<HTMLButtonElement>('[data-term=IV]')!;
    term.click(); harness.detectChanges();
    expect(term.getAttribute('aria-expanded')).toBe('true');
    expect(page.querySelector('#definition-IV')?.textContent).toContain('individuales');
    term.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); harness.detectChanges();
    expect(term.getAttribute('aria-expanded')).toBe('false');
    expect(page.querySelectorAll('#variantes a')).toHaveLength(6);
  });
});
