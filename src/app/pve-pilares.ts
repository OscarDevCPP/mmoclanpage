import { Component } from '@angular/core';
import { GuidePage } from './guide-page';
import { GUIDE_CATALOG } from './guide-catalog';
import { PVE_GUIDE, PVE_FOOTER } from './pve-guide';
import type { GuideDefinition } from './guide-content';

@Component({ selector: 'app-pve-pilares', imports: [GuidePage], template: '<app-guide-page [guide]="guide" />' })
export class PvePilares {
  readonly guide: GuideDefinition = { ...GUIDE_CATALOG.pve, sections: PVE_GUIDE, footer: PVE_FOOTER };
}
