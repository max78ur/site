import { ClipboardList } from 'lucide-react';

const applications = [
  { id: 'APP-DEMO-201', carrier: 'Demo Carrier A', mc: 'MC-DEMO-001', equipment: 'Dry Van', fleet: '12 trucks', submitted: 'Jun 12, 2025', status: 'New' },
  { id: 'APP-DEMO-202', carrier: 'Demo Carrier B', mc: 'MC-DEMO-002', equipment: 'Reefer', fleet: '6 trucks', submitted: 'Jun 11, 2025', status: 'Reviewing' },
  { id: 'APP-DEMO-203', carrier: 'Demo Carrier C', mc: 'MC-DEMO-003', equipment: 'Flatbed', fleet: '3 trucks', submitted: 'Jun 10, 2025', status: 'New' },
  { id: 'APP-DEMO-204', carrier: 'Demo Carrier D', mc: 'MC-DEMO-004', equipment: 'Power Only', fleet: '21 trucks', submitted: 'Jun 09, 2025', status: 'Approved' },
];

const applicationStatusClass: Record<string, string> = {
  New: 'bg-blue-50 text-blue-700',
  Reviewing: 'bg-amber-50 text-amber-700',
  Approved: 'bg-emerald-50 text-emerald-700',
};

export default function CarrierApplications() {
  return (
    <section>
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-red-700">Onboarding</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950 sm:text-4xl">Carrier Applications</h1>
          <p className="mt-2 text-sm text-slate-500">Review new carrier applications in the demo queue.</p>
        </div>
        <span className="w-fit rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">Sample records · Demo</span>
      </div>

      <div className="mb-5 flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <span className="rounded-xl bg-red-50 p-3 text-red-700"><ClipboardList aria-hidden="true" size={20} /></span>
        <div>
          <p className="text-sm text-slate-500">Applications in this sample</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">4</p>
        </div>
        <p className="ml-auto hidden max-w-xs text-right text-xs leading-relaxed text-slate-500 sm:block">
          Application records shown here are placeholders and are not connected to Firebase.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Application</th>
                <th className="px-5 py-4 font-semibold">Carrier / MC</th>
                <th className="px-5 py-4 font-semibold">Equipment</th>
                <th className="px-5 py-4 font-semibold">Fleet size</th>
                <th className="px-5 py-4 font-semibold">Submitted</th>
                <th className="px-5 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((application) => (
                <tr className="hover:bg-slate-50/70" key={application.id}>
                  <td className="px-5 py-4 text-sm font-medium text-slate-600">{application.id}</td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-800">{application.carrier}</p>
                    <p className="mt-1 text-xs text-slate-500">{application.mc}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{application.equipment}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{application.fleet}</td>
                  <td className="px-5 py-4 text-sm text-slate-500">{application.submitted}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${applicationStatusClass[application.status]}`}>
                      {application.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
