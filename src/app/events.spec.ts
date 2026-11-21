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
    expect(sortedEventMemories[0].results).toContain('3.º CatervoxD: 200k');
    expect(sortedEventMemories.find(event => event.title === 'Cacería Magikarp')?.date).toBe('2026-10-24');
    expect(new Set(eventMemories.map(event => event.image)).size).toBe(6);
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
    expect(harness.routeNativeElement?.querySelectorAll('.memory')).toHaveLength(6);
    expect(harness.routeNativeElement?.querySelectorAll('.photo img')).toHaveLength(6);
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
    expect(component.scenes.map(scene => scene.speaker)).toEqual(['Socamaru', 'HuronVNLZ', 'maykelsito', 'Socamaru', 'HuronVNLZ', 'maykelsito']);
    expect(new Set(component.scenes.map(scene => scene.image)).size).toBe(6);
    for (let i = 0; i < 5; i++) { component.step(1); expect(localStorage.getItem(key)).toBeNull(); }
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
