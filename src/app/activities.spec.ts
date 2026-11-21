import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Activities } from './activities';
import { routes } from './app.routes';

describe('Resumen de actividades', () => {
  beforeEach(() => { localStorage.clear(); vi.spyOn(window, 'scrollTo').mockImplementation(() => {}); });
  afterEach(() => { localStorage.clear(); vi.restoreAllMocks(); });

  it('presenta cuatro imágenes enlazadas, títulos y resúmenes independientes', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const fixture = TestBed.createComponent(Activities);
    await fixture.whenStable();
    const items = fixture.nativeElement.querySelectorAll('.activities > li') as NodeListOf<HTMLElement>;
    const expected = [
      ['misiones', 'Misiones', 'captura de Pokémon', 'objetos', 'recompensas', 'colaborar con el clan'],
      ['sorteos', 'Sorteos', 'Socamaru', 'números', 'financiar eventos', 'apoyar al clan'],
      ['eventos-semanales', 'Eventos semanales', 'participación gratuita', 'compañerismo', 'ganadores'],
      ['red-wings-academy', 'Red Wings Academy', 'gratuitas', 'crianza', 'WhatsApp'],
    ];
    expect(items).toHaveLength(4);
    expected.forEach(([slug, title, ...terms], index) => {
      const item = items[index];
      const link = item.querySelector('a')!;
      expect(link.getAttribute('href')).toBe(`/actividades/${slug}`);
      expect(link.querySelector('img')?.getAttribute('src')).toBe(`/activities/${slug}.png`);
      expect(link.textContent).toContain(title);
      expect(link.querySelector('a')).toBeNull();
      const summary = item.querySelector('p')!;
      expect(link.contains(summary)).toBe(false);
      terms.forEach(term => expect(summary.textContent).toContain(term));
    });
  });

  it('cada imagen navega a su actividad', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create();
    for (const slug of ['misiones', 'sorteos', 'eventos-semanales', 'red-wings-academy']) {
      await harness.navigateByUrl('/actividades', Activities);
      (harness.routeNativeElement!.querySelector(`a[href="/actividades/${slug}"] img`) as HTMLImageElement).click();
      await harness.fixture.whenStable();
      expect(TestBed.inject(Router).url).toBe(`/actividades/${slug}`);
    }
  });
});
