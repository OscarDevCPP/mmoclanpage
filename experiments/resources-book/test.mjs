import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pageForHash, hashForPage } from './navigation.js';
test('los enlaces de muestra resuelven y los capítulos están en orden', async () => {
  const html = await readFile(new URL('./index.html', import.meta.url), 'utf8');
  const ids = [...html.matchAll(/<section class="page(?: cover)?" id="([^"]+)"/g)].map(m => m[1]);
  assert.deepEqual(ids, ['cubierta','indice','arena','estandarte','bosque','torre','faroles','vigilia']);
  for (const id of ids) { assert.equal(ids[pageForHash(`#${id}`, ids)], id); assert.equal(hashForPage(ids.indexOf(id), ids), `#${id}`); }
  assert.equal(pageForHash('#desconocido', ids), 0);
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), match[1]);
  for (const category of ['Guías de PvP','Guías de PvE','Eventos del juego']) assert.ok(html.includes(category));
});

test('la misma navegación sirve ambos motores en página única y pliego', async () => {
  const { spreadFor, adjacentPage } = await import('./navigation.js');
  for (const wide of [false, true]) {
    for (let index = 0; index < 8; index++) {
      const spread = spreadFor(index, 8, wide);
      assert.ok(spread.includes(index));
      assert.ok(spread.length <= (wide ? 2 : 1));
      const next = adjacentPage(index, 8, wide, 1);
      const prev = adjacentPage(index, 8, wide, -1);
      assert.ok(next >= index && next < 8);
      assert.ok(prev <= index && prev >= 0);
    }
  }
  assert.deepEqual(spreadFor(4, 8, true), [3, 4]);
  assert.deepEqual(spreadFor(7, 8, true), [7]);
  assert.equal(adjacentPage(4, 8, true, 1), 5);
  assert.equal(adjacentPage(4, 8, true, -1), 2);
});
