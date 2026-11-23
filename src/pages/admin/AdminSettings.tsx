import { Bell, ShieldCheck, UserRound } from 'lucide-react';

export default function AdminSettings() {
  return (
    <section>
      <div className="mb-7">
        <p className="text-sm font-semibold uppercase tracking-wider text-red-700">Workspace</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950 sm:text-4xl">Settings</h1>
        <p className="mt-2 text-sm text-slate-500">Admin profile and workspace preferences.</p>
      </div>

      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Demo settings only. Changes are disabled and are not saved.
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.25fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
            <span className="rounded-xl bg-slate-100 p-3 text-slate-700"><UserRound aria-hidden="true" size={20} /></span>
            <div>
              <h2 className="text-xl font-bold text-slate-950">Admin profile</h2>
              <p className="mt-1 text-sm text-slate-500">Sample profile preview</p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-600">
              Display name
              <input className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500" readOnly value="Demo Administrator" />
            </label>
            <label className="text-sm font-medium text-slate-600">
              Email
              <input className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500" readOnly value="admin@example.test" />
            </label>
            <label className="text-sm font-medium text-slate-600 sm:col-span-2">
              Role
              <input className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500" readOnly value="Administrator · Demo" />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
            <span className="rounded-xl bg-blue-50 p-3 text-blue-700"><Bell aria-hidden="true" size={20} /></span>
            <div>
              <h2 className="text-xl font-bold text-slate-950">Preferences</h2>
              <p className="mt-1 text-sm text-slate-500">Illustrative options</p>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            <label className="flex items-start gap-3 text-sm text-slate-700">
              <input className="mt-0.5 accent-red-600" disabled type="checkbox" />
              <span>
                <span className="block font-semibold">Inquiry notifications</span>
                <span className="mt-1 block text-xs text-slate-500">Sample preference; not saved.</span>
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm text-slate-700">
              <input defaultChecked className="mt-0.5 accent-red-600" disabled type="checkbox" />
              <span>
                <span className="block font-semibold">Application notifications</span>
                <span className="mt-1 block text-xs text-slate-500">Sample preference; not saved.</span>
              </span>
            </label>
          </div>
          <div className="mt-6 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-500">
            <ShieldCheck aria-hidden="true" className="shrink-0 text-slate-500" size={17} />
            Authentication and administrator permissions are managed separately.
          </div>
        </section>
      </div>
    </section>
  );
}
