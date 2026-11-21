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
    const nextButton = () => harness.routeNativeElement!.querySelector('.cinema-controls button:last-child')!;
    expect(nextButton().getAttribute('data-tooltip')).toBe('Siguiente');
    expect(new Set(page.scenes.map(scene => scene.image)).size).toBe(page.scenes.length);
    page.onKey(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(page.index()).toBe(1);
    expect(localStorage.getItem(key)).toBeNull();
    while (page.index() < page.scenes.length - 1) page.step(1);
    harness.detectChanges();
    expect(nextButton().getAttribute('data-tooltip')).toBe('Ir al álbum');
    expect(localStorage.getItem(key)).toBeNull();
    page.step(1); harness.detectChanges();
    expect(localStorage.getItem(key)).toBe('seen');
    expect(Array.from(harness.routeNativeElement!.querySelectorAll('time'), time => time.getAttribute('datetime'))).toEqual(['2026-11-13', '2026-11-13', '2026-10-12', '2026-09-17']);
    expect(page.sortedMemories().slice(0, 2).map(memory => memory.title)).toEqual(['Nuestro primer Halloween', 'Se abrieron las puertas de los 12 Templos']);
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
    page.memories.update(memories => [...memories, { date: '2026-12-01', label: '1 de diciembre de 2026', title: 'Foto posterior', file: 'foto-posterior.jpeg', type: 'image', story: 'Ejemplo de prueba.' }]);
    page.finish(); harness.detectChanges();
    const articles = harness.routeNativeElement!.querySelectorAll('.memory');
    expect(articles).toHaveLength(5);
    const videoArticle = Array.from(articles).find(article => article.querySelector('video'))!;
    const video = videoArticle.querySelector('video')!;
    expect(video.getAttribute('src')).toBe('/recuerdos/4_recuerdo_presentacion_2_los_12_templos.mp4');
    const contextId = video.getAttribute('aria-describedby')!;
    expect(videoArticle.querySelector('p')?.id).toBe(contextId);
    expect(articles[0].querySelector('time')?.getAttribute('datetime')).toBe('2026-12-01');
    expect(articles[0].querySelector('img')?.getAttribute('src')).toBe('/recuerdos/foto-posterior.jpeg');
    expect(articles[0].querySelector('video')).toBeNull();
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
