import { NavigationStart, Router, RouterLink, RouterOutlet, Scroll } from '@angular/router';
import { PresentationState } from './presentation-state';
import { DOCUMENT, ViewportScroller } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { afterNextRender, Component, computed, DestroyRef, inject, signal } from '@angular/core';

type Theme = 'system' | 'light' | 'dark';
const THEME_KEY = 'black-talon.theme';

@Component({
  selector: 'app-root',
  host: { '(document:keydown.escape)': 'closeNavigation(true)' },
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly document = inject(DOCUMENT);
  readonly presentation = inject(PresentationState);
  readonly navigationOpen = signal(false);

  closeNavigation(restoreFocus = false): void {
    if (!this.navigationOpen()) return;
    this.navigationOpen.set(false);
    if (restoreFocus) this.document.getElementById('navigation-toggle')?.focus();
  }
  private readonly router = inject(Router);
  get currentPath(): string { return this.router.url.split(/[?#]/)[0]; }
  readonly theme = signal<Theme>('system');
  private media: MediaQueryList | null = null;
  private readonly systemDark = signal(false);
  readonly activeTheme = computed(() => this.theme() === 'system'
    ? (this.systemDark() ? 'dark' : 'light') : this.theme());

  constructor() {
    const router = this.router;
    const scroller = inject(ViewportScroller);
    scroller.setOffset(() => [0, (this.document.querySelector('.site-header')?.getBoundingClientRect().height ?? 60) + 16]);
    let previousPath = '';
    let navigationSequence = 0;
    const destroyRef = inject(DestroyRef);
    router.events.pipe(takeUntilDestroyed()).subscribe(event => {
      if (event instanceof NavigationStart) {
        navigationSequence++;
        this.closeNavigation();
      }
      if (!(event instanceof Scroll)) return;
      const tree = router.parseUrl(router.url);
      const path = tree.root.toString();
      const pathChanged = path !== previousPath;
      previousPath = path;
      if (tree.fragment) {
        // Run after all synchronous Scroll subscribers, including router restoration.
        const fragment = tree.fragment;
        const sequence = navigationSequence;
        const url = router.url;
        queueMicrotask(() => {
          if (destroyRef.destroyed || sequence !== navigationSequence || router.url !== url) return;
          scroller.scrollToAnchor(fragment);
          this.document.getElementById(fragment)?.focus({ preventScroll: true });
        });
      } else if (pathChanged) {
        this.document.getElementById('contenido')?.focus({ preventScroll: true });
      }
    });
    const onChange = (event: MediaQueryListEvent) => this.systemDark.set(event.matches);
    afterNextRender(() => {
      this.media = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-color-scheme: dark)') : null;
      this.systemDark.set(this.media?.matches ?? false);
      this.theme.set(this.readTheme());
      this.applyTheme(this.theme());
      this.media?.addEventListener('change', onChange);
    });
    destroyRef.onDestroy(() => this.media?.removeEventListener('change', onChange));
  }

  focusMain(): void { this.document.getElementById('contenido')?.focus({ preventScroll: true }); }

  setTheme(value: string): void {
    if (value !== 'system' && value !== 'light' && value !== 'dark') return;
    this.theme.set(value);
    this.applyTheme(value);
    try {
      if (value === 'system') localStorage.removeItem(THEME_KEY);
      else localStorage.setItem(THEME_KEY, value);
    } catch {
      // The current session still follows the selected theme when storage is blocked.
    }
  }

  private readTheme(): Theme {
    try {
      const value = localStorage.getItem(THEME_KEY);
      return value === 'light' || value === 'dark' ? value : 'system';
    } catch {
      return 'system';
    }
  }

  private applyTheme(value: Theme): void {
    if (value === 'system') this.document.documentElement.removeAttribute('data-theme');
    else this.document.documentElement.dataset['theme'] = value;
  }
}
