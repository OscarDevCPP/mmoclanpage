import { Component } from '@angular/core';
import { GuidePage } from './guide-page';
import { GUIDE_CATALOG } from './guide-catalog';
import { PVP_GUIDE } from './pvp-guide';
import { PVP_GLOSSARY } from './pvp-glossary';
import type { GuideDefinition } from './guide-content';
export { popupPosition } from './guide-page';

@Component({ selector: 'app-pvp-fundamentos', imports: [GuidePage], template: '<app-guide-page [guide]="guide" />' })
export class PvpFundamentos {
  readonly guide: GuideDefinition = {
    ...GUIDE_CATALOG.pvp, sections: PVP_GUIDE, glossary: PVP_GLOSSARY, adviceSection: 'introduccion-practica',
    aliases: { 'introduccion-combate': 'introduccion-turno', 'introduccion-sinergia': 'introduccion-plan' },
    description: 'Introducción al competitivo de PokeMMO: modalidades, preparación, equipos y práctica PvP para la comunidad de Black Talon.',
  };
}
