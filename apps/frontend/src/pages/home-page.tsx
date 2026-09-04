import {
  ArrowUpRight,
  Bell,
  ChevronDown,
  CircleDot,
  Command,
  FolderKanban,
  LayoutDashboard,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type ThemeOption = {
  code: 'B' | 'D' | 'F' | 'G';
  name: string;
  description: string;
  className: string;
};

const themeOptions: ThemeOption[] = [
  { code: 'B', name: 'Night signal', description: 'Confident dark surfaces with electric data contrast.', className: 'theme-b' },
  { code: 'D', name: 'Market precision', description: 'Kite-inspired: compact, calm, and information-first.', className: 'theme-d' },
  { code: 'F', name: 'Blue horizon', description: 'Kite-blue structure lifted by a calm, directional gradient.', className: 'theme-f' },
  { code: 'G', name: 'Cloud contrast', description: 'High-legibility light mode with modern, borderless depth.', className: 'theme-g' },
];

const navigationItems = [
  { label: 'Overview', icon: LayoutDashboard, isActive: true },
  { label: 'Projects', icon: FolderKanban },
  { label: 'Team', icon: Users },
];

const chartPoints = '0,113 34,105 68,111 102,83 136,93 170,57 204,69 238,26 272,44 306,18 340,30 374,7';

const DashboardPreview = ({ option }: { option: ThemeOption }) => (
  <article className={cn('theme-preview overflow-hidden', option.className)}>
    <div className="theme-preview__masthead">
      <div>
        <span className="theme-preview__eyebrow">Theme {option.code}</span>
        <h2>{option.name}</h2>
        <p>{option.description}</p>
      </div>
      <Badge className="theme-preview__badge" variant="outline">Dashboard concept</Badge>
    </div>

    <div className="theme-preview__frame">
      <aside className="theme-preview__sidebar">
        <div className="theme-preview__brand"><span>c</span> craftly</div>
        <nav>
          {navigationItems.map(({ label, icon: Icon, isActive }) => (
            <button className={cn('theme-preview__nav-item', isActive && 'is-active')} key={label} type="button">
              <Icon size={16} /> {label}
            </button>
          ))}
        </nav>
        <div className="theme-preview__sidebar-bottom">
          <button className="theme-preview__nav-item" type="button"><Sparkles size={16} /> Upgrade plan</button>
          <div className="theme-preview__profile"><span>AM</span><div><strong>Alex Morgan</strong><small>Product lead</small></div><MoreHorizontal size={16} /></div>
        </div>
      </aside>

      <div className="theme-preview__content">
        <header className="theme-preview__topbar">
          <label className="theme-preview__search"><Search size={15} /><Input aria-label="Search" placeholder="Search anything..." /></label>
          <div className="theme-preview__actions"><button aria-label="Notifications" type="button"><Bell size={17} /></button><button type="button"><Command size={14} /> K</button></div>
        </header>

        <main className="theme-preview__body">
          <div className="theme-preview__title-row">
            <div><p className="theme-preview__date">Monday, May 20</p><h3>Good morning, Alex <span>✦</span></h3></div>
            <Button className="theme-preview__create" size="sm"><Plus size={16} /> Create new</Button>
          </div>

          <section className="theme-preview__metrics" aria-label="Project metrics">
            {[['Total revenue', '$48,629', '+12.5%'], ['Active projects', '24', '+4 this week'], ['Team velocity', '86%', '+8.2%']].map(([label, value, trend], index) => (
              <div className="theme-preview__metric" key={label}>
                <div><p>{label}</p><strong>{value}</strong></div>
                <span className={index === 1 ? 'theme-preview__trend is-neutral' : 'theme-preview__trend'}><ArrowUpRight size={13} /> {trend}</span>
              </div>
            ))}
          </section>

          <section className="theme-preview__grid">
            <div className="theme-preview__panel theme-preview__chart-panel">
              <div className="theme-preview__panel-heading"><div><p>Performance</p><strong>Project momentum</strong></div><button type="button">This month <ChevronDown size={14} /></button></div>
              <div className="theme-preview__chart"><span className="theme-preview__chart-label label-top">100%</span><span className="theme-preview__chart-label label-middle">50%</span><span className="theme-preview__chart-label label-bottom">0%</span><svg aria-label="Project momentum trend" viewBox="0 0 374 120" role="img"><defs><linearGradient id={`area-${option.code}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="currentColor" stopOpacity=".28" /><stop offset="1" stopColor="currentColor" stopOpacity="0" /></linearGradient></defs><polygon fill={`url(#area-${option.code})`} points={`${chartPoints} 374,120 0,120`} /><polyline fill="none" points={chartPoints} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" /></svg><div className="theme-preview__chart-dates"><span>May 1</span><span>May 8</span><span>May 15</span><span>May 22</span></div></div>
            </div>
            <div className="theme-preview__panel theme-preview__focus-panel"><div className="theme-preview__panel-heading"><div><p>Focus</p><strong>Today’s priorities</strong></div><Badge variant="success">3 of 5</Badge></div><div className="theme-preview__task"><CircleDot size={16} /><div><strong>Finalize landing page</strong><small>Design · due today</small></div><span className="theme-preview__avatar avatar-lilac">ML</span></div><div className="theme-preview__task"><CircleDot size={16} /><div><strong>Review analytics report</strong><small>Growth · 2 comments</small></div><span className="theme-preview__avatar avatar-peach">SK</span></div><button className="theme-preview__view-all" type="button">View all tasks <ArrowUpRight size={14} /></button></div>
          </section>

          <section className="theme-preview__projects"><div className="theme-preview__section-title"><div><p>In progress</p><strong>Your projects</strong></div><button type="button">View all <ArrowUpRight size={14} /></button></div><div className="theme-preview__project-list">{[['Aurora website', '82%', 'Design system'], ['Q2 Campaign', '64%', 'Marketing'], ['Mobile app', '38%', 'Product']].map(([name, progress, label], index) => <div className="theme-preview__project" key={name}><span className={`theme-preview__project-icon icon-${index}`}><FolderKanban size={18} /></span><div className="theme-preview__project-copy"><strong>{name}</strong><small>{label} · Updated 2h ago</small></div><div className="theme-preview__progress"><span><i style={{ width: progress }} /></span><small>{progress}</small></div><MoreHorizontal size={18} /></div>)}</div></section>
        </main>
      </div>
    </div>
  </article>
);

export const HomePage = () => (
  <section className="theme-gallery">
    <div className="theme-gallery__intro"><Badge variant="outline">Theme exploration</Badge><h1>Four directions for your workspace.</h1><p>Same dashboard, same information hierarchy—four distinct visual identities. Pick the feeling that is closest, then we’ll turn it into a complete system.</p></div>
    <div className="theme-gallery__list">{themeOptions.map((option) => <DashboardPreview key={option.code} option={option} />)}</div>
  </section>
);
