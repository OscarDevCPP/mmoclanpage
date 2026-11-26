import { Component, input, signal } from '@angular/core';

/** A missing source statement is not the same as permission to choose anything. */
export type Requirement<T> =
  | { kind: 'exact'; value: T; optional?: boolean; recommended?: boolean }
  | { kind: 'allowed'; values: readonly T[]; optional?: boolean; recommended?: boolean }
  | { kind: 'any' }
  | { kind: 'unknown' };
export type NumericRequirement = Requirement<number> | {
  kind: 'range'; min?: { value: number; inclusive: boolean }; max?: { value: number; inclusive: boolean };
  optional?: boolean; recommended?: boolean;
};
export type Stat = 'PS' | 'Ataque' | 'Defensa' | 'Ataque Especial' | 'Defensa Especial' | 'Velocidad';
export type NatureRequirement = Requirement<string> | { kind: 'stat-rule'; increases: Stat; doesNotDecrease?: Stat; optional?: boolean; recommended?: boolean };
export interface PokemonBuild {
  name: string;
  image?: { src: string; alt: string };
  iv: Record<Stat, NumericRequirement>;
  ev: Record<Stat, NumericRequirement>;
  nature: NatureRequirement;
  ability: Requirement<string>;
  item: Requirement<string>;
  moves: readonly Requirement<string>[];
  note?: string;
}
export const STATS: readonly Stat[] = ['PS', 'Ataque', 'Defensa', 'Ataque Especial', 'Defensa Especial', 'Velocidad'];
export function describeRequirement(value: NumericRequirement | NatureRequirement | Requirement<string>): string {
  let label: string;
  switch (value.kind) {
    case 'unknown': return 'Sin información';
    case 'any': return 'Indiferente';
    case 'exact': label = String(value.value); break;
    case 'allowed': label = value.values.join(' o '); break;
    case 'stat-rule': label = `Sube ${value.increases}${value.doesNotDecrease ? `; no baja ${value.doesNotDecrease}` : ''}`; break;
    case 'range': {
      const min = value.min ? `${value.min.inclusive ? '≥' : '>'} ${value.min.value}` : '';
      const max = value.max ? `${value.max.inclusive ? '≤' : '<'} ${value.max.value}` : '';
      label = [min, max].filter(Boolean).join(' y ') || 'Sin límites especificados';
      break;
    }
  }
  return `${label}${value.optional ? ' (opcional)' : ''}${value.recommended ? ' (recomendado)' : ''}`;
}
@Component({
  selector: 'app-pokemon-build',
  templateUrl: './pokemon-build.html',
  styleUrl: './pokemon-build.css',
})
export class PokemonBuildCard {
  readonly build = input.required<PokemonBuild>();
  readonly imageFailed = signal(false);
  readonly stats = STATS;
  readonly statLabels: Record<Stat, string> = { PS: 'PS', Ataque: 'Atq', Defensa: 'Def', 'Ataque Especial': 'Atq. Esp', 'Defensa Especial': 'Def. Esp', Velocidad: 'Vel.' };
  compact(value: NumericRequirement, iv = false): string {
    if (value.kind === 'unknown' || value.kind === 'any') return '-';
    if (iv && value.kind === 'range') {
      const min = value.min?.inclusive && value.min.value === 0 ? undefined : value.min;
      const max = value.max?.inclusive && value.max.value === 31 ? undefined : value.max;
      if (!min && !max) return value.optional ? '- *' : '-';
      value = { ...value, min, max };
    }
    return describeRequirement(value).replace(' (opcional)', ' *');
  }
  accessible(value: NumericRequirement | NatureRequirement | Requirement<string>): string { return describeRequirement(value).replaceAll('≥', 'mayor o igual que').replaceAll('≤', 'menor o igual que').replaceAll('>', 'mayor que').replaceAll('<', 'menor que'); }
  display(value: NumericRequirement | NatureRequirement | Requirement<string>): string {
    return value.kind === 'unknown' || value.kind === 'any' ? '-' : describeRequirement(value).replace(' (opcional)', ' *');
  }
}
