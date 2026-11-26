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
    expect(page.textContent).toContain('No hemos podido verificar sus turnos');
    expect(page.textContent).toContain('referencia histórica');
    expect(page.querySelectorAll('#equipo li')).toHaveLength(4);
    expect(page.querySelectorAll('#variantes a')).toHaveLength(6);
  });
});
