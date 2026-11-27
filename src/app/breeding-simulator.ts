import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { crossPreview, inheritedParticles, normalizeIv, shinyPreview, STATS, traitPreview, type HeldItem, type ParentTraits, type ShinyKind } from './breeding-cross';

const PARTICLES = ['Bats', 'Ghosts'] as const;
type Particle = typeof PARTICLES[number];
const DEFAULT_TRAITS: ParentTraits = { alpha: false, hidden: false, costume: false };
const DEFAULT_NATURES = ['Firme', 'Alegre'];
const EXAMPLE = [[31, 20, 16, 12, 18, 20], [18, 20, 24, 12, 18, 31]].map(row => row.map(String));
@Component({
  selector: 'app-breeding-simulator',
  imports: [NgTemplateOutlet],
  templateUrl: './breeding-simulator.html',
  styleUrl: './breeding-simulator.css',
})
export class BreedingSimulator {
  protected readonly traitButtons = [
    { key: 'alpha', label: 'Alfa', short: 'Alfa' }, { key: 'hidden', label: 'Acceso a habilidad oculta', short: 'Hab. oculta' },
    { key: 'costume', label: 'Traje', short: 'Traje' },
  ] as const;
  protected readonly shinyKinds = [
    { value: 'normal', label: 'No variocolor' }, { value: 'shiny', label: 'Shiny' }, { value: 'secret', label: 'Secret Shiny' },
  ] as const;
  protected readonly shinyParents = signal<readonly ShinyKind[]>(['normal', 'normal']);
  protected readonly eggShiny = computed(() => shinyPreview(this.shinyParents()[0], this.shinyParents()[1]));
  protected changeShiny(parent: number, value: string) {
    const kind = this.shinyKinds.find(option => option.value === value)?.value;
    if (kind) this.shinyParents.update(values => values.map((current, i) => i === parent ? kind : current));
  }
  protected readonly particleOptions = PARTICLES;
  protected readonly particles = signal<readonly (readonly Particle[])[]>([[], []]);
  protected readonly eggParticles = computed(() => inheritedParticles(this.particles()[0], this.particles()[1]));
  protected hasParticle(parent: number, particle: Particle) { return this.particles()[parent].includes(particle); }
  protected toggleParticle(parent: number, particle: Particle) {
    this.particles.update(rows => rows.map((row, index) => index !== parent ? row :
      row.includes(particle) ? row.filter(value => value !== particle) : [...row, particle]));
  }
  protected readonly natures = ['Activa', 'Afable', 'Agitada', 'Alocada', 'Alegre', 'Amable', 'Audaz', 'Cauta', 'Dócil', 'Firme', 'Floja', 'Fuerte', 'Grosera', 'Huraña', 'Ingenua', 'Mansa', 'Miedosa', 'Modesta', 'Osada', 'Pícara', 'Plácida', 'Rara', 'Serena', 'Seria', 'Tímida'];
  protected readonly selectedNatures = signal(DEFAULT_NATURES);
  protected changeNature(parent: number, value: string) {
    this.selectedNatures.update(values => values.map((nature, i) => i === parent ? value : nature));
  }
  protected traitResult(key: keyof ParentTraits): 'yes' | 'no' | 'check' {
    const result = this.inherited();
    if (key === 'costume') return result.costume === 'inherited' ? 'yes' : result.costume === 'check' ? 'check' : 'no';
    return result[key] ? 'yes' : 'no';
  }
  protected readonly traits = signal([DEFAULT_TRAITS, DEFAULT_TRAITS]);
  protected readonly inherited = computed(() => traitPreview(this.traits()[0], this.traits()[1]));
  protected traitEnabled(parent: number, key: keyof ParentTraits) {
    return this.traits()[parent][key];
  }
  protected toggle(parent: number, key: keyof ParentTraits) {
    this.traits.update(rows => rows.map((row, i) => i === parent ? { ...row, [key]: !row[key] } : row));
  }
  protected readonly stats = STATS;
  protected readonly parents = ['A', 'B'];
  protected readonly ivInputs = signal(EXAMPLE);
  private readonly ivs = computed(() => this.ivInputs().map(row => row.map(value => normalizeIv(Number(value)))));
  protected readonly items = signal<HeldItem[]>(['none', 'none']);
  protected readonly preview = computed(() => crossPreview(this.ivs()[0], this.ivs()[1], this.items()[0], this.items()[1]));
  protected itemUnavailable(parent: number, value: string) {
    return value !== 'none' && this.items()[1 - parent] === value;
  }
  protected changeIv(parent: number, stat: number, value: string) {
    this.ivInputs.update(rows => rows.map((row, p) => p === parent ? row.map((iv, i) => i === stat ? value : iv) : row));
  }
  protected commitIv(parent: number, stat: number, input: HTMLInputElement) {
    input.value = String(normalizeIv(input.valueAsNumber));
    this.changeIv(parent, stat, input.value);
  }
  protected changeItem(parent: number, value: string) {
    if (this.itemUnavailable(parent, value)) return;
    this.items.update(items => items.map((item, i) => i === parent ? value as HeldItem : item));
  }
  protected reset() {
    this.ivInputs.set(EXAMPLE);
    this.selectedNatures.set(DEFAULT_NATURES);
    this.traits.set([DEFAULT_TRAITS, DEFAULT_TRAITS]);
    this.particles.set([[], []]);
    this.shinyParents.set(['normal', 'normal']);
    this.items.set(['none', 'none']);
  }
}
