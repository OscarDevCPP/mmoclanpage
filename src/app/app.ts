import { NavigationStart, Router, RouterLink, RouterOutlet, Scroll } from '@angular/router';
import { PresentationState } from './presentation-state';
import { ViewportScroller } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';

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
  readonly presentation = inject(PresentationState);
  readonly navigationOpen = signal(false);

  closeNavigation(restoreFocus = false): void {
    if (!this.navigationOpen()) return;
    this.navigationOpen.set(false);
    if (restoreFocus) document.getElementById('navigation-toggle')?.focus();
  }
  private readonly router = inject(Router);
  get currentPath(): string { return this.router.url.split(/[?#]/)[0]; }
  readonly theme = signal<Theme>(this.readTheme());
  private readonly media = typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  private readonly systemDark = signal(this.media?.matches ?? false);
  readonly activeTheme = computed(() => this.theme() === 'system'
    ? (this.systemDark() ? 'dark' : 'light') : this.theme());

  constructor() {
    const router = this.router;
    const scroller = inject(ViewportScroller);
    scroller.setOffset(() => [0, (document.querySelector('.site-header')?.getBoundingClientRect().height ?? 60) + 16]);
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
          document.getElementById(fragment)?.focus({ preventScroll: true });
        });
      } else if (pathChanged) {
        document.getElementById('contenido')?.focus({ preventScroll: true });
      }
    });
    this.applyTheme(this.theme());
    const onChange = (event: MediaQueryListEvent) => this.systemDark.set(event.matches);
    this.media?.addEventListener('change', onChange);
    destroyRef.onDestroy(() => this.media?.removeEventListener('change', onChange));
  }

  focusMain(): void { document.getElementById('contenido')?.focus({ preventScroll: true }); }

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
    if (value === 'system') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.dataset['theme'] = value;
  }
}
