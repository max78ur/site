import { useMemo, useState } from 'react';
import { Search, Truck } from 'lucide-react';

const demoCarriers = [
  { name: 'Demo Carrier A', mc: 'MC-DEMO-001', fleet: '12 trucks', type: 'Dry Van', status: 'Active', joined: 'Jun 12, 2025' },
  { name: 'Demo Carrier B', mc: 'MC-DEMO-002', fleet: '6 trucks', type: 'Reefer', status: 'Active', joined: 'Jun 10, 2025' },
  { name: 'Demo Carrier C', mc: 'MC-DEMO-003', fleet: '3 trucks', type: 'Flatbed', status: 'Review', joined: 'Jun 08, 2025' },
  { name: 'Demo Carrier D', mc: 'MC-DEMO-004', fleet: '21 trucks', type: 'Power Only', status: 'Active', joined: 'Jun 04, 2025' },
  { name: 'Demo Carrier E', mc: 'MC-DEMO-005', fleet: '2 trucks', type: 'Dry Van', status: 'Inactive', joined: 'May 29, 2025' },
];

const statusClass: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-700',
  Review: 'bg-amber-50 text-amber-700',
  Inactive: 'bg-slate-100 text-slate-600',
};

export default function Carriers() {
  const [search, setSearch] = useState('');
  const filteredCarriers = useMemo(
    () =>
      demoCarriers.filter((carrier) =>
        `${carrier.name} ${carrier.mc} ${carrier.type}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [search],
  );

  return (
    <section>
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-red-700">Directory</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950 sm:text-4xl">Carriers</h1>
          <p className="mt-2 text-sm text-slate-500">Review the carrier directory and account status.</p>
        </div>
        <span className="w-fit rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">Sample records · Demo</span>
      </div>

      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input
            aria-label="Search demo carriers"
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search carrier or MC number"
            type="search"
            value={search}
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Truck aria-hidden="true" size={17} />
          <span>{filteredCarriers.length} demo carriers</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Carrier</th>
                <th className="px-5 py-4 font-semibold">MC number</th>
                <th className="px-5 py-4 font-semibold">Fleet</th>
                <th className="px-5 py-4 font-semibold">Equipment</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCarriers.map((carrier) => (
                <tr className="hover:bg-slate-50/70" key={carrier.mc}>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-800">{carrier.name}</td>
                  <td className="px-5 py-4 text-sm text-slate-500">{carrier.mc}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{carrier.fleet}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{carrier.type}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[carrier.status]}`}>
                      {carrier.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500">{carrier.joined}</td>
                </tr>
              ))}
              {filteredCarriers.length === 0 && (
                <tr>
                  <td className="px-5 py-12 text-center text-sm text-slate-500" colSpan={6}>
                    No demo carriers match that search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
