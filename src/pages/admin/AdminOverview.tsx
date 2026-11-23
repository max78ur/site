import {
  ArrowDownRight,
  ArrowUpRight,
  ClipboardList,
  MessageSquareText,
  Truck,
  Users,
} from 'lucide-react';

const stats = [
  {
    label: 'Total carriers',
    value: '248',
    change: '+12 this month',
    positive: true,
    icon: Truck,
    iconClass: 'bg-blue-50 text-blue-700',
  },
  {
    label: 'Active fleet',
    value: '186',
    change: '+8.4% this month',
    positive: true,
    icon: Users,
    iconClass: 'bg-emerald-50 text-emerald-700',
  },
  {
    label: 'Open inquiries',
    value: '14',
    change: '3 need attention',
    positive: false,
    icon: MessageSquareText,
    iconClass: 'bg-amber-50 text-amber-700',
  },
  {
    label: 'New applications',
    value: '7',
    change: '+2 this week',
    positive: true,
    icon: ClipboardList,
    iconClass: 'bg-red-50 text-red-700',
  },
];

const activity = [
  {
    title: 'Demo Carrier A',
    detail: 'Submitted a carrier application',
    time: '12 min ago',
    color: 'bg-blue-500',
  },
  {
    title: 'Demo Contact A',
    detail: 'Sent a dispatch inquiry',
    time: '48 min ago',
    color: 'bg-amber-500',
  },
  {
    title: 'Demo Carrier B',
    detail: 'Profile status changed to Active',
    time: '2 hours ago',
    color: 'bg-emerald-500',
  },
  {
    title: 'Demo Contact B',
    detail: 'Requested a freight quote',
    time: 'Yesterday',
    color: 'bg-violet-500',
  },
];

export default function AdminOverview() {
  return (
    <section>
      <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-red-700">
            Overview
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950 sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            A snapshot of your TruckAxic operations.
          </p>
        </div>
        <p className="text-xs font-medium text-slate-500">Sample metrics · Demo</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, change, positive, icon: Icon, iconClass }) => (
          <article
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            key={label}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                  {value}
                </p>
              </div>
              <div className={`rounded-xl p-3 ${iconClass}`}>
                <Icon aria-hidden="true" size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-medium">
              {positive ? (
                <ArrowUpRight aria-hidden="true" className="text-emerald-600" size={15} />
              ) : (
                <ArrowDownRight aria-hidden="true" className="text-amber-600" size={15} />
              )}
              <span className={positive ? 'text-emerald-700' : 'text-amber-700'}>
                {change}
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Recent activity</h2>
              <p className="mt-1 text-sm text-slate-500">Illustrative activity feed</p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600">
              Demo
            </span>
          </div>
          <div className="mt-5 divide-y divide-slate-100">
            {activity.map((item) => (
              <div className="flex gap-3 py-4 first:pt-1 last:pb-1" key={item.title + item.time}>
                <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${item.color}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
                </div>
                <time className="shrink-0 text-xs text-slate-400">{item.time}</time>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Needs attention</h2>
              <p className="mt-1 text-sm text-slate-500">Demo queue summary</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-red-700">
              5
            </span>
          </div>
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  New carrier applications
                </p>
                <p className="mt-1 text-xs text-slate-500">Sample queue</p>
              </div>
              <span className="text-lg font-bold text-slate-900">3</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Unanswered inquiries
                </p>
                <p className="mt-1 text-xs text-slate-500">Sample queue</p>
              </div>
              <span className="text-lg font-bold text-slate-900">2</span>
            </div>
            <p className="rounded-lg border border-dashed border-slate-200 p-3 text-xs leading-relaxed text-slate-500">
              These counts are placeholders and are not connected to Firebase.
            </p>
          </div>
        </section>
      </div>
    </section>
  );
}
