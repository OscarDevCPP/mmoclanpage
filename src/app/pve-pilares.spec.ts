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
    expect(page.querySelector('h1')?.textContent).toBe('LOS SEIS PILARES, FARMEO DE GYMS (AVANZADO)');
    expect([...page.querySelectorAll('article > section')].map(section => section.id)).toEqual(['preparacion', 'equipo', 'estrategia', 'basica']);
    expect(page.querySelector('#basica h2')?.textContent).toBe('Ruta básica y avanzadas');
    expect([...page.querySelectorAll('article > section > h2')].map(h => h.textContent)).toEqual(['Introducción', 'El equipo', 'La idea principal', 'Ruta básica y avanzadas']);
    expect([...page.querySelectorAll('.contents a')].map(a => a.textContent)).toEqual(['Introducción', 'El equipo', 'La idea principal', 'Ruta básica y avanzadas']);
    expect(page.querySelector('#basica #variantes h3')?.textContent).toBe('Rutas avanzadas');
    expect(page.querySelector('footer#fuentes a')).toBeTruthy();
    expect(page.querySelector('#equipo')?.textContent).not.toMatch(/fichas|leyenda|simbología/i);
    expect(page.querySelector('#basica i[lang="en"]')?.textContent).toBe('swap');
    expect(page.querySelector('#variantes a[href*="spreadsheets"]')?.textContent).toBe('Deadly Assault');
    expect(page.textContent).toContain('referencia histórica');
    expect(page.querySelectorAll('#equipo app-pokemon-build')).toHaveLength(6);
    expect(page.querySelector('#equipo [data-term]')).toBeNull();
    expect(page.querySelector('#equipo')?.textContent).not.toMatch(/valores individuales|valores de esfuerzo/i);
    expect(page.querySelectorAll('#equipo th[scope=col]')).toHaveLength(18);
    expect(page.querySelectorAll('#variantes a')).toHaveLength(6);
  });
});
