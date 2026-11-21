import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PresentationState {
  readonly active = signal(false);
}
