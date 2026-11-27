import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { GUIDE_CATALOG } from './guide-catalog';
import { routes } from './app.routes';
import { PvePilares } from './pve-pilares';
import { PvpFundamentos } from './pvp-fundamentos';

describe('Catálogo compartido de guías', () => {
  it('resuelve las rutas e índices a los mismos destinos en ambas guías', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create();
    for (const [guide, component] of [[GUIDE_CATALOG.pvp, PvpFundamentos], [GUIDE_CATALOG.pve, PvePilares]] as const) {
      await harness.navigateByUrl(guide.path, component);
      const page = harness.routeNativeElement as HTMLElement;
      expect(page.querySelector('h1')?.textContent).toBe(guide.title);
      const links = [...page.querySelectorAll<HTMLAnchorElement>('.contents a')];
      expect(links.map(link => link.textContent)).toEqual(guide.contents.map(item => item.title));
      expect(links.map(link => link.getAttribute('href'))).toEqual(guide.contents.map(item => `${guide.path}#${item.id}`));
      for (const item of guide.contents) expect(page.querySelector(`[id="${item.id}"]`)).toBeTruthy();
    }
  });
  it('conserva recomendación, idioma y fecha de la guía PvE', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(GUIDE_CATALOG.pve.path, PvePilares);
    const page = harness.routeNativeElement as HTMLElement;
    expect(page.querySelector('.gym-tip a')?.getAttribute('href')).toBe('https://pokemmohub.com/');
    expect(page.querySelector('.gym-tip strong[lang="en"]')?.textContent).toBe('Gym Earnings Calculator');
    expect(page.querySelector('footer time')?.getAttribute('datetime')).toBe('2026-11-26');
    expect(page.querySelectorAll('#equipo app-pokemon-build')).toHaveLength(6);
  });
});
