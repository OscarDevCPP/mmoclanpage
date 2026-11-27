import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { PvePilares } from './pve-pilares';

describe('Índice de Los seis pilares', () => {
  it('navega a cada fragmento sin salir de la guía', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/compendio/pve/seis-pilares', PvePilares);
    const router = TestBed.inject(Router);
    const fragments = ['preparacion', 'equipo', 'estrategia', 'basica'];
    const links = [...(harness.routeNativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>('.contents a')];
    expect(links).toHaveLength(fragments.length);
    for (const [index, fragment] of fragments.entries()) {
      expect(links[index].getAttribute('href')).toBe(`/compendio/pve/seis-pilares#${fragment}`);
      links[index].click();
      await harness.fixture.whenStable();
      expect(router.url).toBe(`/compendio/pve/seis-pilares#${fragment}`);
      expect(harness.routeNativeElement?.querySelector(`#${fragment}`)).toBeTruthy();
    }
  });
});
