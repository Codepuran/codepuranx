import { Moon, Sun } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/store/theme-store';

export const AppShell = ({ children }: PropsWithChildren) => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="backdrop-mesh min-h-screen text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <a className="font-display text-lg font-bold tracking-tight" href="/">
          Codepuranx
        </a>
        <Button aria-label="Toggle color theme" onClick={toggleTheme} size="icon" variant="ghost">
          {theme === 'dark' ? <Sun aria-hidden="true" size={18} /> : <Moon aria-hidden="true" size={18} />}
        </Button>
      </header>
      <main className="mx-auto max-w-6xl px-6 pb-20 pt-8">{children}</main>
    </div>
  );
};
