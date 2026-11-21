import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { describe, expect, it, vi } from 'vitest';
import { routes } from './app.routes';
import { Events } from './events';
import { eventMemories, sortedEventMemories } from './events-data';

describe('Eventos semanales', () => {
  it('ordena seis recuerdos por fecha ISO y conserva resultados verificados', () => {
    expect(eventMemories).toHaveLength(6);
    expect(sortedEventMemories.map(event => event.date)).toEqual([...eventMemories.map(event => event.date)].sort().reverse());
    expect(sortedEventMemories[0].results).toContainEqual({ position: '3.º', winner: 'CatervoxD', prize: '200k', medal: 'bronce' });
    const magikarp = sortedEventMemories.find(event => event.title === 'Cacería Magikarp');
    expect(magikarp?.date).toBe('2026-10-24');
    expect(magikarp?.results).toEqual([{ category: 'Mayor IV', winner: 'GhostyFly', prize: 'Amoonguss Alfa 2x31 Osada', medal: 'oro' }, { category: 'Menor IV', winner: 'Socamaru', prize: '100k', medal: 'plata' }]);
    expect(eventMemories[0].results).toEqual([{ winner: 'Cintiacamila', prize: '500k', medal: 'oro' }]);
    expect(new Set(eventMemories.map(event => event.image)).size).toBe(6);
    expect(eventMemories.map(event => [event.date, event.results.map(result => `${result.winner}:${result.prize}`)])).toEqual([
      ['2026-09-17', ['Cintiacamila:500k']],
      ['2026-10-04', ['HuronVNLZ:500k', 'GhostyFly:alfa 2x31 con partícula']],
      ['2026-10-11', ['ElPrimoPiter:500k', 'Ozmaerus:350k', 'strenzynatsuki:200k']],
      ['2026-10-18', ['ElPrimoPiter:300k', 'HuronVNLZ:200k', 'Socamaru:100k']],
      ['2026-10-24', ['GhostyFly:Amoonguss Alfa 2x31 Osada', 'Socamaru:100k']],
      ['2026-11-15', ['Akibachoco:500k', 'GhostyFly:350k', 'CatervoxD:200k']],
    ]);
  });
  it('navega, salta, recuerda y permite repetir con teclado', async () => {
    localStorage.removeItem('black-talon.events.presentation.v1');
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/actividades/eventos-semanales', Events);
    expect(component.album()).toBe(false);
    component.onKey(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(component.index()).toBe(1);
    component.finish(); harness.detectChanges();
    expect(localStorage.getItem('black-talon.events.presentation.v1')).toBe('seen');
    const articles = harness.routeNativeElement!.querySelectorAll('.memory');
    expect(articles).toHaveLength(6);
    expect(harness.routeNativeElement?.textContent).not.toContain('Organiza:');
    articles.forEach((article, index) => {
      const organizer = article.querySelector('.memory-copy strong');
      expect(organizer?.textContent).toBe(sortedEventMemories[index].organizer);
      expect(organizer?.parentElement?.textContent).toContain('Esta actividad fue organizada por');
      expect(Array.from(article.querySelectorAll('.results li strong'), item => item.textContent)).toEqual(sortedEventMemories[index].results.map(result => result.winner));
    });
    expect(harness.routeNativeElement?.querySelectorAll('.photo img')).toHaveLength(6);
    expect(harness.routeNativeElement?.textContent).not.toContain('Recuerdo del encuentro');
    expect(harness.routeNativeElement?.querySelectorAll('.poster')).toHaveLength(6);
    component.replay(); expect(component.album()).toBe(false); expect(component.index()).toBe(0);
    await TestBed.inject(Router).navigateByUrl('/');
    const again = await harness.navigateByUrl('/actividades/eventos-semanales', Events);
    expect(again.album()).toBe(true);
    localStorage.removeItem('black-talon.events.presentation.v1');
  });
});

describe('Presentación de eventos: persistencia y escenas', () => {
  const key = 'black-talon.events.presentation.v1';
  const missionsKey = 'black-talon.missions.presentation.v1';
  const sorteosKey = 'black-talon.sorteos.presentation.v1';

  it('solo marca al saltar o terminar y no cambia las preferencias de otras páginas', async () => {
    localStorage.removeItem(key);
    localStorage.setItem(missionsKey, 'seen');
    localStorage.setItem(sorteosKey, 'seen');
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/actividades/eventos-semanales', Events);
    expect(localStorage.getItem(key)).toBeNull();
    expect(component.scenes).toHaveLength(7);
    expect(component.scenes[5].image).toBe('recuerdos');
    expect(new Set(component.scenes.map(scene => scene.image)).size).toBe(component.scenes.length);
    for (let i = 0; i < component.scenes.length - 1; i++) { component.step(1); expect(localStorage.getItem(key)).toBeNull(); }
    harness.detectChanges();
    expect(harness.routeNativeElement?.querySelectorAll('.group-portraits img')).toHaveLength(3);
    expect(harness.routeNativeElement?.querySelector('.cinema-top')?.textContent).toContain(`${component.scenes.length}/${component.scenes.length}`);
    expect(harness.routeNativeElement?.querySelector('button[aria-label="Ir al álbum"]')).toBeTruthy();
    component.step(1);
    expect(localStorage.getItem(key)).toBe('seen');
    expect(localStorage.getItem(missionsKey)).toBe('seen');
    expect(localStorage.getItem(sorteosKey)).toBe('seen');
    localStorage.removeItem(key);
    component.replay(); harness.detectChanges();
    expect(localStorage.getItem(key)).toBeNull();
    (harness.routeNativeElement!.querySelector('button[aria-label="Saltar al álbum"]') as HTMLButtonElement).click();
    expect(localStorage.getItem(key)).toBe('seen');
    expect(localStorage.getItem(missionsKey)).toBe('seen');
    expect(localStorage.getItem(sorteosKey)).toBe('seen');
    localStorage.removeItem(key); localStorage.removeItem(missionsKey); localStorage.removeItem(sorteosKey);
  });

  it('permanece usable cuando storage rechaza lectura y escritura', async () => {
    const read = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    try {
      TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
      const harness = await RouterTestingHarness.create();
      const component = await harness.navigateByUrl('/actividades/eventos-semanales', Events);
      expect(component.album()).toBe(false);
      component.finish();
      expect(component.album()).toBe(true);
      expect(read).toHaveBeenCalledWith(key);
      expect(write).toHaveBeenCalledWith(key, 'seen');
      component.replay();
      expect(component.album()).toBe(false);
    } finally { read.mockRestore(); write.mockRestore(); }
  });
});
