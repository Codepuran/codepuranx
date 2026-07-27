import { Activity, ArrowRight, CheckCircle2, LoaderCircle, ServerCrash } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getHealth } from '@/services/api';

type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

export const HomePage = () => {
  const [apiStatus, setApiStatus] = useState<ApiStatus>('idle');

  const handleHealthCheck = async (): Promise<void> => {
    setApiStatus('loading');
    try {
      await getHealth();
      setApiStatus('success');
    } catch {
      setApiStatus('error');
    }
  };

  const statusContent = {
    idle: { icon: Activity, label: 'Ready to connect', variant: 'muted' as const },
    loading: { icon: LoaderCircle, label: 'Checking API', variant: 'warning' as const },
    success: { icon: CheckCircle2, label: 'API connected', variant: 'success' as const },
    error: { icon: ServerCrash, label: 'API unavailable', variant: 'warning' as const },
  }[apiStatus];
  const StatusIcon = statusContent.icon;

  return (
    <section className="grid items-center gap-10 py-12 lg:grid-cols-[1.25fr_0.75fr] lg:py-24">
      <div>
        <Badge variant="outline">Frontend foundation</Badge>
        <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">
          Build the interface your API deserves.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
          A React, Vite, Tailwind, and Storybook workspace ready for your Codepuranx product experience.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={handleHealthCheck} disabled={apiStatus === 'loading'}>
            {apiStatus === 'loading' ? <LoaderCircle className="animate-spin" size={18} /> : <Activity size={18} />}
            Check API health
          </Button>
          <Button
            onClick={() => document.querySelector('#foundation')?.scrollIntoView({ behavior: 'smooth' })}
            variant="secondary"
          >
            Explore foundation <ArrowRight size={18} />
          </Button>
        </div>
      </div>
      <aside className="glass-panel rounded-panel p-7 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Local API</p>
        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <StatusIcon className={apiStatus === 'loading' ? 'animate-spin' : ''} size={22} />
            <span className="truncate font-medium">GET /health</span>
          </div>
          <Badge variant={statusContent.variant}>{statusContent.label}</Badge>
        </div>
        <p className="mt-6 border-t border-border pt-5 font-mono text-xs text-muted-foreground">VITE_API_URL</p>
      </aside>
      <div className="lg:col-span-2" id="foundation">
        <div className="grid gap-4 sm:grid-cols-3">
          {['Tokens first', 'Accessible primitives', 'API boundary'].map((item) => (
            <article
              className="glass-panel rounded-panel p-6 shadow-card transition-shadow hover:shadow-card-hover"
              key={item}
            >
              <h2 className="font-display text-lg font-bold">{item}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Designed for reuse, strong states, and uncomplicated product growth.
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
