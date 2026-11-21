import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { describe, expect, it, vi } from 'vitest';
import { routes } from './app.routes';
import { Memories } from './memories';

const key = 'black-talon.memories.presentation.v1';
describe('Recuerdos', () => {
  it('presenta escenas, guarda solo al terminar y muestra cuatro recuerdos en orden', async () => {
    localStorage.removeItem(key);
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create();
    const page = await harness.navigateByUrl('/recuerdos', Memories);
    expect(page.album()).toBe(false);
    expect(new Set(page.scenes.map(scene => scene.image)).size).toBe(page.scenes.length);
    page.onKey(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(page.index()).toBe(1);
    expect(localStorage.getItem(key)).toBeNull();
    while (page.index() < page.scenes.length - 1) page.step(1);
    expect(localStorage.getItem(key)).toBeNull();
    page.step(1); harness.detectChanges();
    expect(localStorage.getItem(key)).toBe('seen');
    expect(page.memories.map(m => m.date)).toEqual(['2026-09-17', '2026-10-12', '2026-11-13', '2026-11-13']);
    expect(harness.routeNativeElement?.querySelectorAll('.memory')).toHaveLength(4);
    expect(harness.routeNativeElement?.querySelectorAll('.photo img')).toHaveLength(3);
    const video = harness.routeNativeElement!.querySelector('video')!;
    expect(video.hasAttribute('controls')).toBe(true);
    expect(video.hasAttribute('autoplay')).toBe(false);
    expect(video.getAttribute('preload')).toBe('metadata');
    page.replay(); expect(page.index()).toBe(0); expect(page.album()).toBe(false);
    page.finish(); expect(page.album()).toBe(true);
    localStorage.removeItem(key);
  });
  it('conserva los tipos y el contexto del video al añadir una foto posterior', async () => {
    localStorage.removeItem(key);
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create();
    const page = await harness.navigateByUrl('/recuerdos', Memories);
    page.memories.push({ date: '2026-12-01', label: '1 de diciembre de 2026', title: 'Foto posterior', file: 'foto-posterior.jpeg', type: 'image', story: 'Ejemplo de prueba.' });
    page.finish(); harness.detectChanges();
    const articles = harness.routeNativeElement!.querySelectorAll('.memory');
    expect(articles).toHaveLength(5);
    const video = articles[3].querySelector('video')!;
    expect(video.getAttribute('src')).toBe('/recuerdos/4_recuerdo_presentacion_2_los_12_templos.mp4');
    const contextId = video.getAttribute('aria-describedby')!;
    expect(articles[3].querySelector('p')?.id).toBe(contextId);
    expect(articles[4].querySelector('img')?.getAttribute('src')).toBe('/recuerdos/foto-posterior.jpeg');
    expect(articles[4].querySelector('video')).toBeNull();
    localStorage.removeItem(key);
  });
  it('funciona con almacenamiento bloqueado', async () => {
    const read = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw Error('blocked'); });
    const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw Error('blocked'); });
    try {
      TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
      const harness = await RouterTestingHarness.create();
      const page = await harness.navigateByUrl('/recuerdos', Memories);
      expect(page.album()).toBe(false); page.finish(); expect(page.album()).toBe(true);
      page.replay(); expect(page.album()).toBe(false);
    } finally { read.mockRestore(); write.mockRestore(); }
  });
});
