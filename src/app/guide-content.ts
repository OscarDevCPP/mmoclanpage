export type InlineMark =
  | { readonly kind: 'emphasis' }
  | { readonly kind: 'strong' }
  | { readonly kind: 'link'; readonly href: string };
export interface InlineRun { readonly text: string; readonly marks: readonly InlineMark[]; }
export type GuideBlock =
  | { readonly kind: 'heading'; readonly id: string; readonly level: 2 | 3; readonly runs: readonly InlineRun[] }
  | { readonly kind: 'paragraph'; readonly id: string; readonly runs: readonly InlineRun[] }
  | { readonly kind: 'list'; readonly id: string; readonly ordered: boolean; readonly items: readonly { readonly id: string; readonly runs: readonly InlineRun[] }[] }
  | { readonly kind: 'diagram'; readonly id: string; readonly description: string };
export interface GuideSection { readonly id: string; readonly blocks: readonly GuideBlock[]; }
