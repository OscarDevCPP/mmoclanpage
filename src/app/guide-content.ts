import type { PokemonBuild } from './pokemon-build';

export type InlineMark =
  | { readonly kind: 'glossary'; readonly term: string }
  | { readonly kind: 'emphasis' }
  | { readonly kind: 'italic' }
  | { readonly kind: 'language'; readonly value: string }
  | { readonly kind: 'time'; readonly datetime: string }
  | { readonly kind: 'strong' }
  | { readonly kind: 'link'; readonly href: string };
export interface InlineRun { readonly text: string; readonly marks: readonly InlineMark[]; }
export type GuideBlock =
  | { readonly kind: 'heading'; readonly id: string; readonly level: 2 | 3 | 4; readonly runs: readonly InlineRun[] }
  | { readonly kind: 'paragraph'; readonly id: string; readonly runs: readonly InlineRun[] }
  | { readonly kind: 'list'; readonly id: string; readonly ordered: boolean; readonly items: readonly { readonly id: string; readonly runs: readonly InlineRun[] }[] }
  | { readonly kind: 'image'; readonly id: string; readonly src: string; readonly alt: string; readonly width: number; readonly height: number; readonly caption: string; readonly layout: 'wide' | 'aside' }
  | { readonly kind: 'breeding-simulator'; readonly id: string }
  | { readonly kind: 'diagram'; readonly id: string; readonly description: string }
  | { readonly kind: 'builds'; readonly id: string; readonly builds: readonly PokemonBuild[] }
  | { readonly kind: 'tip'; readonly id: string; readonly title: string; readonly runs: readonly InlineRun[] }
  | { readonly kind: 'subsection'; readonly id: string; readonly blocks: readonly GuideBlock[] }
  | { readonly kind: 'disclosure'; readonly id: string; readonly title: string; readonly blocks: readonly GuideBlock[] };
export interface GuideSection { readonly id: string; readonly blocks: readonly GuideBlock[]; }

export interface GuideDefinition {
  readonly title: string; readonly category: string; readonly path: string; readonly subtitle: string;
  readonly contents: readonly { readonly id: string; readonly title: string }[];
  readonly sections: readonly GuideSection[]; readonly footer?: readonly GuideBlock[];
  readonly glossary?: Readonly<Record<string, string>>; readonly adviceSection?: string; readonly aliases?: Readonly<Record<string, string>>; readonly description?: string;
}
