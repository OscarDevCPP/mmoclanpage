import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { GUIDE_CATALOG } from './guide-catalog';
import { routes } from './app.routes';
import { PvePilares } from './pve-pilares';
import { BreedingGuide } from './breeding-guide';
import { PvpFundamentos } from './pvp-fundamentos';

describe('Catálogo compartido de guías', () => {
  it('resuelve las rutas e índices a los mismos destinos en ambas guías', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create();
    for (const [guide, component] of [[GUIDE_CATALOG.pvp, PvpFundamentos], [GUIDE_CATALOG.pve, PvePilares], [GUIDE_CATALOG.breeding, BreedingGuide]] as const) {
      await harness.navigateByUrl(guide.path, component);
      const page = harness.routeNativeElement as HTMLElement;
      expect(page.querySelector('h1')?.textContent).toBe(guide.title);
      const links = [...page.querySelectorAll<HTMLAnchorElement>('.contents a')];
      expect(links.map(link => link.textContent)).toEqual(guide.contents.map(item => item.title));
      expect(links.map(link => link.getAttribute('href'))).toEqual(guide.contents.map(item => `${guide.path}#${item.id}`));
      for (const item of guide.contents) expect(page.querySelector(`[id="${item.id}"]`)).toBeTruthy();
    }
  });
  it('vincula la ayuda emergente de términos con espacios a su definición', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(GUIDE_CATALOG.breeding.path, BreedingGuide);
    const page = harness.routeNativeElement as HTMLElement;
    const trigger = page.querySelector<HTMLButtonElement>('[data-term="grupo huevo"]')!;
    trigger.click();
    harness.detectChanges();
    const id = trigger.getAttribute('aria-describedby')!;
    expect(id).not.toMatch(/\s/);
    expect(page.ownerDocument.getElementById(id)?.textContent).toContain('determinar con qué Pokémon puede criar');
  });
  it('conserva recomendación, idioma y fecha de la guía PvE', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(GUIDE_CATALOG.pve.path, PvePilares);
    const page = harness.routeNativeElement as HTMLElement;
    expect(page.querySelector('#preparacion > .gym-tip:last-child')?.textContent).toContain('juega desde un ordenador');
    expect(page.querySelector('.gym-tip a')?.getAttribute('href')).toBe('https://pokemmohub.com/');
    expect(page.querySelector('.gym-tip strong[lang="en"]')?.textContent).toBe('Gym Earnings Calculator');
    expect(page.querySelector('footer time')?.getAttribute('datetime')).toBe('2026-11-26');
    expect(page.querySelectorAll('#equipo app-pokemon-build')).toHaveLength(6);
  });
});
