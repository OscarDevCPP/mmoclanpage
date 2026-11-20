import { NgOptimizedImage } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';

type Theme = 'system' | 'light' | 'dark';
const THEME_KEY = 'black-talon.theme';

@Component({
  selector: 'app-root',
  imports: [NgOptimizedImage],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly theme = signal<Theme>(this.readTheme());
  private readonly media = typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  private readonly systemDark = signal(this.media?.matches ?? false);
  readonly activeTheme = computed(() => this.theme() === 'system'
    ? (this.systemDark() ? 'dark' : 'light') : this.theme());

  constructor() {
    this.applyTheme(this.theme());
    const onChange = (event: MediaQueryListEvent) => this.systemDark.set(event.matches);
    this.media?.addEventListener('change', onChange);
    inject(DestroyRef).onDestroy(() => this.media?.removeEventListener('change', onChange));
  }

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
