import { useEffect, useState } from 'react';
import {
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  PanelsTopLeft,
  Settings,
  Truck,
  X,
} from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const navigation = [
  { label: 'Overview', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Carriers', to: '/admin/carriers', icon: Truck },
  { label: 'Contact Inquiries', to: '/admin/inquiries', icon: MessageSquareText },
  { label: 'Carrier Applications', to: '/admin/applications', icon: ClipboardList },
  { label: 'Website CMS', to: '/admin/cms', icon: PanelsTopLeft },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const location = useLocation();
  const isCmsWorkspace = location.pathname.startsWith('/admin/cms');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [signOutError, setSignOutError] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    setSignOutError(false);
    try {
      await signOut(auth);
    } catch {
      setSignOutError(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {mobileNavOpen && (
        <button
          aria-label="Close admin navigation"
          className="fixed inset-0 z-40 bg-slate-950/60 md:hidden"
          onClick={() => setMobileNavOpen(false)}
          type="button"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-950 text-white transition-transform duration-200 md:translate-x-0 ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600">
            <Truck aria-hidden="true" size={23} />
          </div>
          <div>
            <div className="font-bold tracking-wide">TRUCKAXIC</div>
            <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Admin Console
            </div>
          </div>
          <button
            aria-label="Close admin navigation"
            className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white md:hidden"
            onClick={() => setMobileNavOpen(false)}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-5 pb-3 pt-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Workspace
        </div>
        <nav aria-label="Admin navigation" className="space-y-1 px-3">
          {navigation.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              aria-label={label}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-950/30'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`
              }
              end={end}
              key={to}
              onClick={() => setMobileNavOpen(false)}
              to={to}
            >
              <Icon aria-hidden="true" size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-white/10 p-4">
          {signOutError && (
            <p className="mb-3 text-xs text-red-300" role="alert">
              Sign out failed. Please try again.
            </p>
          )}
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-sm font-bold">
              A
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Admin workspace</p>
              <p className="text-xs text-slate-400">Demo profile</p>
            </div>
          </div>
          <button
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            onClick={handleSignOut}
            type="button"
          >
            <LogOut aria-hidden="true" size={18} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="min-h-screen md:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              aria-expanded={mobileNavOpen}
              aria-label="Open admin navigation"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
              onClick={() => setMobileNavOpen(true)}
              type="button"
            >
              <Menu size={21} />
            </button>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                TruckAxic Admin
              </p>
              <p className="hidden text-xs text-slate-500 sm:block">
                Operations workspace
              </p>
            </div>
          </div>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 sm:text-xs">
            {isCmsWorkspace ? 'CMS workspace' : 'Demo environment'}
          </span>
        </header>

        <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {isCmsWorkspace ? (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-amber-600" />
              <p>
                CMS edits use Firebase. Draft and publish actions require the
                approved Firestore and Storage rules to be deployed separately.
                Public website pages are not connected to CMS content in this phase.
              </p>
            </div>
          ) : (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
              <p>
                <span className="font-semibold">Demo data only.</span> No Firebase
                records are connected or changed.
              </p>
            </div>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
