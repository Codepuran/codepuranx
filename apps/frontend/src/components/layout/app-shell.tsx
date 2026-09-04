import type { PropsWithChildren } from 'react';

export const AppShell = ({ children }: PropsWithChildren) => (
  <div className="theme-gallery-shell min-h-screen text-foreground">
    <header className="theme-gallery-header"><a href="/">Codepuranx</a><span>Theme lab · v0.1</span></header>
    <main>{children}</main>
  </div>
);
