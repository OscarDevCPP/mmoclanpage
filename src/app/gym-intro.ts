import { Component } from '@angular/core';
import { GuidePage } from './guide-page';
import { GUIDE_CATALOG } from './guide-catalog';
import { GYM_SECTIONS, GYM_FOOTER } from './gym-intro-data';
import type { GuideDefinition } from './guide-content';

@Component({ selector: 'app-gym-intro', imports: [GuidePage], template: '<app-guide-page [guide]="guide" />' })
export class GymIntro {
  readonly guide: GuideDefinition = { ...GUIDE_CATALOG.gymIntro, sections: GYM_SECTIONS, footer: GYM_FOOTER };
}
