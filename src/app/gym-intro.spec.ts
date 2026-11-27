import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { GUIDE_CATALOG } from './guide-catalog';
import { PvePilares } from './pve-pilares';
import { GymIntro } from './gym-intro';

describe('INTRODUCCION A RE-RUNS DE GYMS', () => {
  it('integra ruta, fragmentos, equipo y desplegables independientes', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(GUIDE_CATALOG.gymIntro.path, GymIntro);
    const page = harness.routeNativeElement as HTMLElement;
    for (const item of GUIDE_CATALOG.gymIntro.contents) {
      expect(page.querySelector(`#${item.id}`)).toBeTruthy();
      expect(page.querySelector(`.contents a[href$="#${item.id}"]`)).toBeTruthy();
    }
    expect(page.querySelector('h1')?.textContent?.trim()).toBe('INTRODUCCION A RE-RUNS DE GYMS');
    expect(page.querySelector('#introduccion')?.textContent).toContain('para ganar dinero');
    expect(page.querySelector('#ruta')?.textContent).not.toMatch(/medalla/i);
    expect(page.querySelectorAll('#equipo-inicial app-pokemon-build')).toHaveLength(4);
    const details = [...page.querySelectorAll<HTMLDetailsElement>('.route-disclosure')];
    expect(details).toHaveLength(5);
    expect(details.every(detail => !detail.open)).toBe(true);
    details[0].open = true; details[1].open = true;
    expect(details[0].open && details[1].open).toBe(true);
    expect(details.map(detail => detail.querySelectorAll('li').length)).toEqual([6, 4, 5, 2, 7]);
    expect(page.textContent).toContain('Gafas Elegidas');
  });
  it('enlaza las dos guías desde sus respectivas introducciones', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create();
    const { gymIntro, pve } = GUIDE_CATALOG;
    await harness.navigateByUrl(gymIntro.path, GymIntro);
    expect(harness.routeNativeElement?.querySelector('#introduccion a')?.getAttribute('href')).toBe(pve.path);
    await harness.navigateByUrl(pve.path, PvePilares);
    expect(harness.routeNativeElement?.querySelector('#preparacion a')?.getAttribute('href')).toBe(gymIntro.path);
  });

});
