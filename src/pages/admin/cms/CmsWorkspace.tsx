import { NavLink, Outlet } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpenText,
  Brush,
  CircleHelp,
  Film,
  Gauge,
  Images,
  LayoutTemplate,
} from 'lucide-react';

const links = [
  { to: '/admin/cms', label: 'Overview', icon: Gauge, end: true },
  { to: '/admin/cms/hero', label: 'Hero editor', icon: Film },
  { to: '/admin/cms/pages', label: 'Pages & sections', icon: LayoutTemplate },
  { to: '/admin/cms/design', label: 'Design & settings', icon: Brush },
  { to: '/admin/cms/media', label: 'Media library', icon: Images },
  { to: '/admin/cms/content', label: 'Content', icon: BookOpenText },
];

export default function CmsLayout() {
  return (
    <div className="grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)]">
      <aside className="h-fit rounded-2xl bg-slate-950 p-3 text-white shadow-sm lg:sticky lg:top-6">
        <div className="px-3 pb-3 pt-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-red-400">
            TruckAxic
          </p>
          <h2 className="mt-1 text-lg font-bold">Website CMS</h2>
        </div>
        <nav aria-label="CMS navigation" className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-white text-slate-950'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon aria-hidden="true" size={17} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-4 border-t border-white/10 pt-3">
          <NavLink
            to="/admin"
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft aria-hidden="true" size={16} />
            Admin dashboard
          </NavLink>
          <p className="mt-3 flex items-start gap-2 px-3 text-xs leading-5 text-slate-400">
            <CircleHelp aria-hidden="true" className="mt-0.5 shrink-0" size={14} />
            Draft content is separate from the current public website.
          </p>
        </div>
      </aside>
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  );
}

