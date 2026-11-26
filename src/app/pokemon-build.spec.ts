import { TestBed } from '@angular/core/testing';
import { describeRequirement, PokemonBuild, PokemonBuildCard, STATS } from './pokemon-build';

describe('Ficha Pokémon reutilizable', () => {
  it('distingue valores, límites y reglas sin depender de la guía', () => {
    expect(describeRequirement({kind:'range', min:{value:4,inclusive:false}, max:{value:9,inclusive:true}})).toBe('> 4 y ≤ 9');
    expect(describeRequirement({kind:'range', min:{value:4,inclusive:true}, max:{value:9,inclusive:false}})).toBe('≥ 4 y < 9');
    expect(describeRequirement({kind:'exact',value:'Firme'})).toBe('Firme');
    expect(describeRequirement({kind:'allowed',values:['Firme','Huraña']})).toBe('Firme o Huraña');
    expect(describeRequirement({kind:'stat-rule',increases:'Ataque',doesNotDecrease:'Defensa Especial'})).toBe('Sube Ataque; no baja Defensa Especial');
    expect(describeRequirement({kind:'stat-rule',increases:'Ataque'})).toBe('Sube Ataque');
    expect(describeRequirement({kind:'exact',value:'Objeto',optional:true})).toBe('Objeto (opcional)');
    expect(describeRequirement({kind:'exact',value:31,recommended:true})).toBe('31 (recomendado)');
    expect(describeRequirement({kind:'any'})).toBe('Indiferente');
    expect(describeRequirement({kind:'unknown'})).toBe('Sin información');
  });
  it('renderiza un ejemplo ajeno a Los seis pilares y un recurso alternativo', () => {
    const unknown = {kind:'unknown'} as const;
    const stats = Object.fromEntries(STATS.map(stat => [stat, unknown])) as PokemonBuild['iv'];
    const example: PokemonBuild = {name:'Ejemplo',iv:{...stats,PS:{kind:'range',min:{value:5,inclusive:false}}},ev:stats,nature:{kind:'stat-rule',increases:'Ataque'},ability:unknown,item:{kind:'allowed',values:['Objeto A','Objeto B'],optional:true},moves:[{kind:'allowed',values:['Movimiento A','Movimiento B']},{kind:'any'},unknown]};
    const fixture = TestBed.createComponent(PokemonBuildCard);
    fixture.componentRef.setInput('build', example); fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Objeto A o Objeto B (opcional)');
    expect(element.textContent).toContain('Movimiento A o Movimiento B');
    expect(element.textContent).toContain('Indiferente');
    expect(element.querySelector('img')?.getAttribute('src')).toBe('/pokemon-generic.svg');
    expect(element.querySelector('td')?.getAttribute('aria-label')).toContain('mayor que 5');
    expect(element.querySelector('details')?.open).toBe(false);
    element.querySelector('summary')!.click();
    expect(element.querySelector('details')?.open).toBe(true);
    fixture.componentRef.setInput('build', {...example, image: {src:'/imagen-inexistente.svg', alt:'Ejemplo ilustrado'}}); fixture.detectChanges();
    expect(element.querySelector('img')?.getAttribute('alt')).toBe('Ejemplo ilustrado');
    element.querySelector('img')!.dispatchEvent(new Event('error')); fixture.detectChanges();
    expect(element.querySelector('img')?.getAttribute('src')).toBe('/pokemon-generic.svg');
    expect(element.querySelector('img')?.getAttribute('alt')).toBe('');
  });
});
